/**
 * Serviços de API para o sistema de biblioteca de PDFs
 * Baseado nos endpoints identificados no projeto app_pdfs
 */

import { 
  PDFItem, 
  PdfInfo,
  UnifiedPDFItem, 
  PDFListResponse, 
  PDFSearchResponse,
  PDFSearchResponseFrontend,
  UnifiedPDFListResponse,
  UnifiedPDFSearchResponse,
  PDFUploadResponse,
  PDFUnificationResponse,
  SearchParams,
  UnificationRequest,
  APIError
} from '@/types/pdf';

// Função utilitária para converter PdfInfo (API) para PDFItem (Frontend)
const mapPdfInfoToPDFItem = (pdfInfo: PdfInfo): PDFItem => ({
  id: pdfInfo.nome, // Usar o nome como ID
  title: pdfInfo.nome.replace(/\.[^/.]+$/, ""), // Remove extensão do nome
  url: `/api/pdfs/preview/${encodeURIComponent(pdfInfo.nome)}`,
  fileName: pdfInfo.nome,
  size: pdfInfo.tamanhoMB.toFixed(2),
  uploadDate: pdfInfo.dataCriacao,
  description: `Arquivo PDF - ${pdfInfo.numeroPaginas || 0} páginas`
});

// Função para converter para UnifiedPDFItem
export const mapPdfInfoToUnifiedPDFItem = (pdfInfo: PdfInfo): UnifiedPDFItem => ({
  ...mapPdfInfoToPDFItem(pdfInfo),
  sourceFiles: [], // PDFs unificados não têm sourceFiles na API atual
  pageCount: pdfInfo.numeroPaginas || 0
});

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_PDF_API_URL || '/api';

// Headers padrão para as requisições
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // Adicionar token de autenticação se necessário
  // 'Authorization': `Bearer ${getAuthToken()}`,
});

// Função utilitária para tratar erros da API
const handleAPIError = async (response: Response): Promise<never> => {
  let errorData: APIError;
  
  try {
    errorData = await response.json();
  } catch {
    errorData = {
      code: 'NETWORK_ERROR',
      message: `Erro ${response.status}: ${response.statusText}`,
    };
  }
  
  throw new Error(errorData.message || 'Erro desconhecido na API');
};

// Função utilitária para fazer requisições
const apiRequest = async <T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      ...options,
    });

    if (!response.ok) {
      await handleAPIError(response);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro de comunicação com o servidor');
  }
};

/**
 * Serviço principal para operações com PDFs
 */
export class PDFService {
  
  /**
   * Lista todos os PDFs disponíveis
   */
  static async listPDFs(): Promise<PDFItem[]> {
    const response = await apiRequest<PDFListResponse>('/pdfs/listar');
    
    if (!response.sucesso) {
      throw new Error(response.mensagem || 'Erro ao listar PDFs');
    }
    
    return response.arquivos.map(mapPdfInfoToPDFItem);
  }

  /**
   * Busca PDFs com paginação
   */
  static async searchPDFs(params: SearchParams): Promise<PDFSearchResponseFrontend> {
    const queryParams = new URLSearchParams({
      query: params.query,
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    const response = await apiRequest<PDFSearchResponse>(
      `/pdfs/buscar?${queryParams}`
    );
    
    if (!response.sucesso) {
      throw new Error(response.mensagem || 'Erro ao buscar PDFs');
    }
    
    // Transformar a resposta da API real para o formato esperado pelo frontend
    return {
      success: response.sucesso,
      data: response.arquivos.map(mapPdfInfoToPDFItem),
      pagination: {
        currentPage: response.paginaAtual,
        totalPages: response.totalPaginas,
        totalItems: response.totalEncontrados,
        itemsPerPage: response.itensPorPagina
      },
      message: response.mensagem
    };
  }

  /**
   * Upload de arquivo PDF
   */
  static async uploadPDF(file: File, customName?: string): Promise<PDFItem> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (customName) {
      formData.append('customName', customName);
    }

    const response = await fetch(`${API_BASE_URL}/pdfs/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        // Remover Content-Type para FormData
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      await handleAPIError(response);
    }

    const result: PDFUploadResponse = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.message || 'Erro no upload do PDF');
    }
    
    return result.data;
  }

  /**
   * Visualizar PDF (retorna base64) - Baseado na implementação original
   */
  static async viewPDF(fileName: string): Promise<string> {
    console.log('🚀 Iniciando busca do PDF:', fileName);

    try {
      // URL encode para caracteres especiais - requisição direta para API backend
      const nomeEncoded = encodeURIComponent(fileName);
      const url = `http://localhost:5000/api/pdfs/download/${nomeEncoded}`;

      console.log('🌐 URL da requisição:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Permitir CORS
      });

      console.log('📡 Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
        console.warn('⚠️ Endpoint retornou:', response.status);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('📥 PDF obtido da API:', {
        sucesso: data.sucesso,
        nome: data.nomeArquivo || data.nome,
        tamanho: (data.tamanhoMB || data.tamanho) + ' MB',
        base64Length: data.conteudoBase64?.length || 0,
        mensagem: data.mensagem
      });

      // Verificar diferentes formatos de resposta da API
      const base64Content = data.conteudoBase64 || data.base64 || data.content;

      if (data.sucesso && base64Content) {
        // Validar se o base64 é válido
        try {
          // Tentar decodificar para verificar se é base64 válido
          const binaryString = atob(base64Content);
          if (binaryString.length < 100) {
            throw new Error('Base64 muito pequeno para ser um PDF válido');
          }

          // Verificar se começa com header PDF
          if (!binaryString.startsWith('%PDF')) {
            console.warn('⚠️ Conteúdo pode não ser um PDF válido');
          }

          const pdfDataUrl = `data:application/pdf;base64,${base64Content}`;
          console.log('✅ PDF carregado em base64 com sucesso');
          console.log('📊 Tamanho final da data URL:', Math.round(pdfDataUrl.length / 1024), 'KB');

          return pdfDataUrl;

        } catch (validationError) {
          console.error('❌ Erro na validação do base64:', validationError);
          throw new Error('Base64 do PDF inválido');
        }
      } else {
        console.error('❌ Erro na resposta da API:', data.mensagem || 'Erro desconhecido');
        console.error('📄 Dados recebidos completos:', data);
        throw new Error(data.mensagem || 'Erro ao carregar preview do PDF');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar PDF:', error);
      throw error;
    }
  }

  /**
   * Deletar PDF
   */
  static async deletePDF(id: string): Promise<void> {
    const response = await apiRequest<{
      sucesso: boolean;
      mensagem?: string;
    }>(`/pdfs/excluir/${id}`, {
      method: 'DELETE',
    });

    if (!response.sucesso) {
      throw new Error(response.mensagem || 'Erro ao deletar PDF');
    }
  }
}

/**
 * Serviço para operações com PDFs unificados
 */
export class UnifiedPDFService {
  
  /**
   * Lista todos os PDFs unificados
   */
  static async listUnifiedPDFs(): Promise<UnifiedPDFItem[]> {
    console.log('🚀 Carregando PDFs unificados da API...');

    try {
      const url = 'http://localhost:5000/api/Pdfs/unificados';
      console.log('🌐 URL da requisição:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      console.log('📡 Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Dados recebidos da API:', data);

      if (data && data.sucesso && data.arquivos && Array.isArray(data.arquivos)) {
        const mappedPdfs: UnifiedPDFItem[] = data.arquivos.map((arquivo: {
          nome?: string;
          caminhoCompleto?: string;
          tamanhoMB?: number;
          dataCriacao?: string;
          dataModificacao?: string;
          numeroPaginas?: number;
        }, index: number) => ({
          id: `unified-${index}`,
          title: arquivo.nome?.replace('.pdf', '') || `PDF Unificado ${index + 1}`,
          url: arquivo.caminhoCompleto || '',
          fileName: arquivo.nome || '',
          originalPath: arquivo.caminhoCompleto || '',
          thumbnail: '/file.svg',
          size: `${arquivo.tamanhoMB?.toFixed(2) || '0.00'} MB`,
          uploadDate: arquivo.dataCriacao || arquivo.dataModificacao || new Date().toISOString(),
          description: `PDF unificado • ${arquivo.numeroPaginas || 0} páginas • Criado em ${new Date(arquivo.dataCriacao || '').toLocaleDateString('pt-BR')}`,
          sourceFiles: ['Múltiplos arquivos consolidados'],
          pageCount: arquivo.numeroPaginas || 0
        }));

        console.log('✅ PDFs unificados mapeados:', mappedPdfs.length, 'documentos');
        return mappedPdfs;
      } else {
        console.warn('⚠️ Nenhum PDF unificado encontrado na resposta');
        return [];
      }
    } catch (error) {
      console.error('❌ Erro ao carregar PDFs unificados:', error);
      throw error;
    }
  }

  /**
   * Unificar PDFs específicos
   */
  static async unifyPDFs(request: UnificationRequest): Promise<UnifiedPDFItem> {
    const response = await apiRequest<PDFUnificationResponse>('/pdfs/unificar', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Erro ao unificar PDFs');
    }
    
    return response.data;
  }

  /**
   * Buscar PDFs unificados
   */
  static async searchUnifiedPDFs(params: SearchParams): Promise<UnifiedPDFSearchResponse> {
    const queryParams = new URLSearchParams({
      query: params.query,
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    const response = await apiRequest<UnifiedPDFSearchResponse>(
      `/pdfs/unificados/buscar?${queryParams}`
    );
    
    if (!response.sucesso) {
      throw new Error(response.mensagem || 'Erro ao buscar PDFs unificados');
    }
    
    return response;
  }

  /**
   * Visualizar PDF unificado (retorna base64)
   */
  static async viewUnifiedPDF(fileName: string): Promise<string> {
    console.log('🚀 Iniciando busca do PDF unificado:', fileName);

    try {
      // URL encode para caracteres especiais - endpoint específico para PDFs unificados
      const nomeEncoded = encodeURIComponent(fileName);
      const url = `http://localhost:5000/api/Pdfs/download-unificado/${nomeEncoded}`;

      console.log('🌐 URL da requisição (unificado):', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Permitir CORS
      });

      console.log('📡 Status da resposta (unificado):', response.status, response.statusText);

      if (!response.ok) {
        console.warn('⚠️ Endpoint retornou:', response.status);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('📥 PDF unificado obtido da API:', {
        sucesso: data.sucesso,
        nome: data.nomeArquivo || data.nome,
        tamanho: (data.tamanhoMB || data.tamanho) + ' MB',
        base64Length: data.conteudoBase64?.length || 0,
        mensagem: data.mensagem
      });

      // Verificar diferentes formatos de resposta da API
      const base64Content = data.conteudoBase64 || data.base64 || data.content;

      if (data.sucesso && base64Content) {
        // Validar se o base64 é válido
        try {
          // Tentar decodificar para verificar se é base64 válido
          const binaryString = atob(base64Content);
          if (binaryString.length < 100) {
            throw new Error('Base64 muito pequeno para ser um PDF válido');
          }

          // Verificar se começa com header PDF
          if (!binaryString.startsWith('%PDF')) {
            console.warn('⚠️ Conteúdo pode não ser um PDF válido');
          }

          const pdfDataUrl = `data:application/pdf;base64,${base64Content}`;
          console.log('✅ PDF unificado carregado em base64 com sucesso');
          console.log('📊 Tamanho final da data URL:', Math.round(pdfDataUrl.length / 1024), 'KB');

          return pdfDataUrl;

        } catch (validationError) {
          console.error('❌ Erro na validação do base64:', validationError);
          throw new Error('Base64 do PDF inválido');
        }
      } else {
        console.error('❌ Erro na resposta da API:', data.mensagem || 'Erro desconhecido');
        console.error('📄 Dados recebidos completos:', data);
        throw new Error(data.mensagem || 'Erro ao carregar preview do PDF unificado');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar PDF unificado:', error);
      throw error;
    }
  }
}

/**
 * Utilitários para validação de arquivos
 */
export class PDFValidationService {
  
  /**
   * Valida se o arquivo é um PDF válido
   */
  static validatePDFFile(file: File): { isValid: boolean; error?: string } {
    // Verificar tipo MIME
    if (file.type !== 'application/pdf') {
      return {
        isValid: false,
        error: 'Apenas arquivos PDF são permitidos',
      };
    }

    // Verificar tamanho (exemplo: máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Arquivo muito grande. Máximo permitido: 50MB',
      };
    }

    // Verificar extensão do nome
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return {
        isValid: false,
        error: 'Arquivo deve ter extensão .pdf',
      };
    }

    return { isValid: true };
  }

  /**
   * Gera nome único para arquivo
   */
  static generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const nameWithoutExt = originalName.replace(/\.pdf$/i, '');
    return `${nameWithoutExt}_${timestamp}.pdf`;
  }

  /**
   * Formata tamanho do arquivo para exibição
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Exportações por conveniência
export default PDFService;
