/**
 * Serviços de API para o sistema de biblioteca de PDFs
 * Baseado nos endpoints identificados no projeto app_pdfs
 */

import { getPdfApiConfig } from '@/config/env'
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
  UnificationAPIRequest,
  UnificationAPIResponse,
  APIError,
  PDFEditRequest,
  PDFEditResponse,
  PDFPageInfo
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
const pdfApiConfig = getPdfApiConfig()
const API_BASE_URL = pdfApiConfig.publicUrl

// Headers padrão para as requisições
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // Adicionar token de autenticação se necessário
  // 'Authorization': `Bearer ${getAuthToken()}`,
})

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
      ...options,
      headers: {
        ...getHeaders(),
        ...options?.headers,
      },
      signal: AbortSignal.timeout(pdfApiConfig.timeout),
    })

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
   * Buscar todos os PDFs da biblioteca
   * @deprecated Use getAllPDFs instead
   */
  static async listPDFs(): Promise<PDFItem[]> {
    const response = await this.getAllPDFs();
    return response.arquivos.map(mapPdfInfoToPDFItem);
  }

  /**
   * Buscar todos os PDFs da biblioteca
   */
  static async getAllPDFs(): Promise<PDFListResponse> {
    try {
      const data = await apiRequest<PdfInfo[]>('/pdfs');
      
      return {
        sucesso: true,
        arquivos: data,
        totalArquivos: data.length,
        tamanhoTotalMB: data.reduce((total, pdf) => total + pdf.tamanhoMB, 0),
        dataConsulta: new Date().toISOString(),
        mensagem: 'PDFs carregados com sucesso'
      };
    } catch (error) {
      console.error('Erro ao buscar PDFs:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao buscar PDFs');
    }
  }

  /**
   * Pesquisar PDFs com filtros específicos
   */
  static async searchPDFs(searchParams: SearchParams): Promise<PDFSearchResponseFrontend> {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.query) {
        queryParams.append('termo', searchParams.query);
      }

      const endpoint = `/pdfs/pesquisar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const data = await apiRequest<PDFSearchResponse>(endpoint);
      
      const pdfs: PDFItem[] = data.arquivos.map(mapPdfInfoToPDFItem);
      
      return {
        success: true,
        data: pdfs,
        pagination: {
          currentPage: data.paginaAtual,
          totalPages: data.totalPaginas,
          totalItems: data.totalEncontrados,
          itemsPerPage: data.itensPorPagina
        },
        message: `${data.totalEncontrados} PDF(s) encontrado(s)`
      };
    } catch (error) {
      console.error('Erro ao pesquisar PDFs:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao pesquisar PDFs');
    }
  }

  /**
   * Upload de um PDF
   */
  static async uploadPDF(file: File, customName?: string): Promise<PDFUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('arquivo', file);

      const response = await fetch(`${API_BASE_URL}/pdfs/upload`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(pdfApiConfig.timeout),
      });

      if (!response.ok) {
        await handleAPIError(response);
      }

      const data = await response.json();
      
      return {
        success: data.sucesso,
        message: data.mensagem || 'Upload realizado com sucesso',
        data: data.sucesso ? mapPdfInfoToPDFItem({
          nome: data.nomeArquivo || file.name,
          caminhoCompleto: data.caminhoCompleto || '',
          tamanhoBytes: file.size,
          tamanhoMB: file.size / (1024 * 1024),
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString(),
          numeroPaginas: data.numeroPaginas
        }) : undefined
      };
    } catch (error) {
      console.error('Erro no upload:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro no upload do PDF');
    }
  }

  /**
   * Unificar PDFs selecionados
   */
  static async unifyPDFs(request: UnificationRequest): Promise<PDFUnificationResponse> {
    try {
      const apiRequestBody: UnificationAPIRequest = {
        nomesPdfs: request.sourceFileIds,
        nomeArquivoSaida: request.title
      };

      const data = await apiRequest<UnificationAPIResponse>('/pdfs/unificar', {
        method: 'POST',
        body: JSON.stringify(apiRequestBody),
      });

      return {
        success: data.sucesso,
        message: data.mensagem || 'PDFs unificados com sucesso',
        data: data.sucesso ? mapPdfInfoToUnifiedPDFItem({
          nome: data.nomeArquivoSaida || request.title,
          caminhoCompleto: data.caminhoArquivoSaida || '',
          tamanhoBytes: data.tamanhoFinalMB * 1024 * 1024,
          tamanhoMB: data.tamanhoFinalMB,
          dataCriacao: data.dataCriacao,
          dataModificacao: data.dataCriacao,
          numeroPaginas: 0
        }) : undefined
      };
    } catch (error) {
      console.error('Erro na unificação:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao unificar PDFs');
    }
  }

  /**
   * Buscar PDFs unificados
   */
  static async getUnifiedPDFs(): Promise<UnifiedPDFListResponse> {
    try {
      const data = await apiRequest<PdfInfo[]>('/pdfs/unificados');
      
      return {
        sucesso: true,
        arquivos: data,
        totalArquivos: data.length,
        tamanhoTotalMB: data.reduce((total, pdf) => total + pdf.tamanhoMB, 0),
        dataConsulta: new Date().toISOString(),
        mensagem: 'PDFs unificados carregados com sucesso'
      };
    } catch (error) {
      console.error('Erro ao buscar PDFs unificados:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao buscar PDFs unificados');
    }
  }

  /**
   * Pesquisar PDFs unificados
   */
  static async searchUnifiedPDFs(searchParams: SearchParams): Promise<UnifiedPDFSearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.query) {
        queryParams.append('termo', searchParams.query);
      }

      const endpoint = `/pdfs/unificados/pesquisar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const data = await apiRequest<PDFSearchResponse>(endpoint);
      
      return {
        sucesso: true,
        mensagem: `${data.totalEncontrados} PDF(s) unificado(s) encontrado(s)`,
        termoBusca: searchParams.query || '',
        totalEncontrados: data.totalEncontrados,
        paginaAtual: data.paginaAtual,
        itensPorPagina: data.itensPorPagina,
        totalPaginas: data.totalPaginas,
        temPaginaAnterior: data.temPaginaAnterior,
        temProximaPagina: data.temProximaPagina,
        totalTamanhoMB: data.totalTamanhoMB,
        totalTamanhoGeralMB: data.totalTamanhoGeralMB,
        dataConsulta: data.dataConsulta,
        arquivos: data.arquivos
      };
    } catch (error) {
      console.error('Erro ao pesquisar PDFs unificados:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao pesquisar PDFs unificados');
    }
  }

  /**
   * Visualizar PDF (retorna base64)
   */
  static async viewPDF(fileName: string): Promise<string> {
    try {
      // URL encode para caracteres especiais - usar endpoint correto da API
      const nomeEncoded = encodeURIComponent(fileName);
      const url = `http://20.65.208.119:5000/api/Pdfs/download/${nomeEncoded}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Permitir CORS
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

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

          return base64Content;
        } catch (decodeError) {
          console.error('Erro ao decodificar base64:', decodeError);
          throw new Error('Conteúdo base64 inválido recebido da API');
        }
      } else {
        throw new Error(data.mensagem || 'Nenhum conteúdo encontrado para o PDF');
      }
    } catch (error) {
      console.error('Erro ao visualizar PDF:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao visualizar PDF');
    }
  }

  /**
   * Deletar PDF
   */
  static async deletePDF(id: string): Promise<void> {
    try {
      const response = await apiRequest<{
        sucesso: boolean;
        mensagem?: string;
      }>(`/pdfs/excluir/${id}`, {
        method: 'DELETE',
      });

      if (!response.sucesso) {
        throw new Error(response.mensagem || 'Falha ao excluir o PDF');
      }
    } catch (error) {
      console.error('Erro ao deletar PDF:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao deletar PDF');
    }
  }

  /**
   * Edita informações de um PDF e remove páginas selecionadas
   */
  static async editPDF(editData: PDFEditRequest): Promise<PDFEditResponse> {
    try {
      let totalPages: number = 0;
      
      try {
        const pagesInfo = await PDFService.getPDFPages(editData.fileName);
        totalPages = pagesInfo.length;
      } catch (error) {
        console.error('Erro ao obter informações das páginas:', error);
        throw new Error('Não foi possível obter informações do PDF para edição');
      }

      const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
      const pagesToRemove = allPages.filter(page => !editData.pagesToKeep.includes(page));

      if (pagesToRemove.length === 0) {
        return {
          success: false,
          message: 'Nenhuma página foi selecionada para remoção'
        };
      }

      // Fazer requisição para a API
      const response = await fetch(`http://20.65.208.119:5000/api/Pdfs/editar/${encodeURIComponent(editData.fileName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nomeArquivo: editData.fileName,
          titulo: editData.title,
          descricao: editData.description,
          paginasParaRemover: pagesToRemove.map(p => p.toString())
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.sucesso) {
        return {
          success: false,
          message: data.mensagem || 'Erro ao editar o PDF'
        };
      }

      return {
        success: true,
        message: data.mensagem || 'PDF editado com sucesso',
        updatedPdf: mapPdfInfoToPDFItem({
          nome: data.nomeArquivo || editData.fileName,
          caminhoCompleto: data.caminhoArquivo || '',
          tamanhoBytes: data.tamanhoFinalBytes || 0,
          tamanhoMB: data.tamanhoFinalMB || 0,
          dataCriacao: data.dataModificacao || new Date().toISOString(),
          dataModificacao: data.dataModificacao || new Date().toISOString(),
          numeroPaginas: data.totalPaginasFinais || 0
        })
      };
    } catch (error) {
      console.error('Erro ao editar PDF:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido ao editar PDF'
      };
    }
  }

  /**
   * Obter informações das páginas de um PDF
   */
  static async getPDFPages(fileName: string): Promise<PDFPageInfo[]> {
    try {
      try {
        const url = `http://20.65.208.119:5000/api/Pdfs/paginas/${encodeURIComponent(fileName)}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (fetchError) {
        console.error(`Erro ao buscar páginas para ${fileName}:`, fetchError);
        
        // Fallback: retornar array com páginas numeradas
        const fallbackPages: PDFPageInfo[] = Array.from({ length: 10 }, (_, i) => ({
          pageNumber: i + 1,
          thumbnail: '',
          selected: false
        }));
        
        return fallbackPages;
      }
    } catch (error) {
      console.error('Erro ao obter páginas do PDF:', error);
      return [];
    }
  }

  /**
   * Gerar thumbnail de uma página específica
   */
  static async generatePageThumbnail(pageNumber: number, fileName: string): Promise<string> {
    try {
      const response = await fetch(`http://20.65.208.119:5000/api/Pdfs/thumbnail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fileName: fileName,
          pageNumber: pageNumber
        }),
      });

      if (!response.ok) {
        console.error(`Erro HTTP ${response.status} ao gerar thumbnail da página ${pageNumber} do arquivo ${fileName}`);
        return '';
      }

      const data = await response.json();
      
      if (data.sucesso && data.thumbnail) {
        return data.thumbnail;
      } else {
        console.error(`Falha ao gerar thumbnail: ${data.mensagem || 'Erro desconhecido'} para página ${pageNumber} do arquivo ${fileName}`);
        return '';
      }
    } catch (error) {
      console.error(`Erro ao gerar thumbnail para página ${pageNumber} do arquivo ${fileName}:`, error);
      return '';
    }
  }

  /**
   * Visualizar PDF Unificado (retorna base64)
   */
  static async viewUnifiedPDF(fileName: string): Promise<string> {
    try {
      const nomeEncoded = encodeURIComponent(fileName);
      const url = `http://20.65.208.119:5000/api/Pdfs/download/${nomeEncoded}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      const base64Content = data.conteudoBase64 || data.base64 || data.content;

      if (data.sucesso && base64Content) {
        try {
          const binaryString = atob(base64Content);
          if (binaryString.length < 100) {
            throw new Error('Base64 muito pequeno para ser um PDF válido');
          }

          return base64Content;
        } catch (decodeError) {
          console.error('Erro ao decodificar base64:', decodeError);
          throw new Error('Conteúdo base64 inválido recebido da API');
        }
      } else {
        throw new Error(data.mensagem || 'Nenhum conteúdo encontrado para o PDF unificado');
      }
    } catch (error) {
      console.error('Erro ao visualizar PDF unificado:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao visualizar PDF unificado');
    }
  }

  /**
   * Editar PDF unificado removendo páginas específicas
   */
  static async editUnifiedPDF(fileName: string, pagesToRemove: number[]): Promise<PDFEditResponse> {
    try {
      if (!fileName || typeof fileName !== 'string') {
        throw new Error('Nome do arquivo inválido');
      }

      if (!Array.isArray(pagesToRemove) || pagesToRemove.length === 0) {
        throw new Error('Lista de páginas para remoção inválida ou vazia');
      }

      const invalidPages = pagesToRemove.filter(page => typeof page !== 'number' || page < 1);
      if (invalidPages.length > 0) {
        throw new Error('Algumas páginas têm números inválidos');
      }

      const nomeEncoded = encodeURIComponent(fileName);
      const url = `http://20.65.208.119:5000/api/Pdfs/editar/${nomeEncoded}`;

      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            nomeArquivo: fileName,
            paginasParaRemover: pagesToRemove.map(p => p.toString())
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.sucesso) {
          return {
            success: true,
            message: data.mensagem || 'PDF editado com sucesso'
          };
        } else {
          return {
            success: false,
            message: data.mensagem || 'Falha na edição do PDF'
          };
        }
      } catch (fetchError) {
        console.error('Erro na requisição de edição:', fetchError);
        return {
          success: false,
          message: `Erro de comunicação com o servidor: ${fetchError instanceof Error ? fetchError.message : 'Erro desconhecido'}`
        };
      }
    } catch (error) {
      console.error('Erro ao editar PDF unificado:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido ao editar PDF unificado'
      };
    }
  }
}

/**
 * Serviço para PDFs unificados (alias para PDFService para compatibilidade)
 */
export class UnifiedPDFService extends PDFService {
  /**
   * Buscar PDFs unificados
   */
  static async getUnified(): Promise<UnifiedPDFListResponse> {
    return super.getUnifiedPDFs();
  }

  /**
   * Listar PDFs unificados (compatibility method)
   */
  static async listUnifiedPDFs(): Promise<UnifiedPDFItem[]> {
    const response = await super.getAllPDFs();
    return response.arquivos.map(mapPdfInfoToUnifiedPDFItem);
  }

  /**
   * Obter páginas de um PDF unificado
   */
  static async getUnifiedPDFPages(fileName: string): Promise<PDFPageInfo[]> {
    return super.getPDFPages(fileName);
  }

  /**
   * Pesquisar PDFs unificados
   */
  static async searchUnified(searchParams: SearchParams): Promise<UnifiedPDFSearchResponse> {
    return super.searchUnifiedPDFs(searchParams);
  }
}

/**
 * Serviço de validação de PDFs
 */
export class PDFValidationService {
  /**
   * Validar arquivo antes do upload (compatibility method)
   */
  static validatePDFFile(file: File): { isValid: boolean; error?: string } {
    return this.validateFile(file);
  }

  /**
   * Validar arquivo antes do upload
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Verificar tipo de arquivo
    if (file.type !== 'application/pdf') {
      return { isValid: false, error: 'Apenas arquivos PDF são permitidos' };
    }

    // Verificar tamanho (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'Arquivo muito grande. Tamanho máximo: 50MB' };
    }

    // Verificar nome do arquivo
    if (!file.name || file.name.trim().length === 0) {
      return { isValid: false, error: 'Nome do arquivo inválido' };
    }

    return { isValid: true };
  }

  /**
   * Formatar tamanho do arquivo
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validar nome personalizado
   */
  static validateCustomName(customName: string): { isValid: boolean; error?: string } {
    if (!customName || customName.trim().length === 0) {
      return { isValid: false, error: 'Nome personalizado é obrigatório' };
    }

    // Verificar caracteres inválidos
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(customName)) {
      return { isValid: false, error: 'Nome contém caracteres inválidos' };
    }

    // Verificar comprimento
    if (customName.length > 255) {
      return { isValid: false, error: 'Nome muito longo (máximo 255 caracteres)' };
    }

    return { isValid: true };
  }

  /**
   * Gerar nome único para arquivo
   */
  static generateUniqueName(originalName: string, timestamp?: Date): string {
    const now = timestamp || new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    const baseName = originalName.replace(/\.pdf$/i, '');
    return `${baseName}_${dateStr}_${timeStr}.pdf`;
  }
}

export default PDFService;
