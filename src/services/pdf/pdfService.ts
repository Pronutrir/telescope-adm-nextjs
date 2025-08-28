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
   * Lista todos os PDFs disponíveis
   */
  static async listPDFs(): Promise<PDFItem[]> {
    console.log('📂 Listando todos os PDFs...');

    try {
      const url = 'http://20.65.208.119:5000/api/Pdfs/listar';
      console.log('🌐 URL da listagem:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      console.log('📡 Status da listagem:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Dados da listagem:', data);
      
      if (!data.sucesso) {
        throw new Error(data.mensagem || 'Erro ao listar PDFs');
      }
      
      return data.arquivos.map(mapPdfInfoToPDFItem);
    } catch (error) {
      console.error('❌ Erro ao listar PDFs:', error);
      throw error;
    }
  }

  /**
   * Busca PDFs com paginação
   */
  static async searchPDFs(params: SearchParams): Promise<PDFSearchResponseFrontend> {
    console.log('🔍 Buscando PDFs:', params);

    try {
      // Usar o endpoint correto da API: /api/Pdfs/buscar-paginado
      const queryParams = new URLSearchParams({
        termo: params.query, // API usa 'termo' em vez de 'query'
        pagina: params.page.toString(), // API usa 'pagina' em vez de 'page'
        itensPorPagina: params.limit.toString(), // API usa 'itensPorPagina' em vez de 'limit'
      });

      const url = `http://20.65.208.119:5000/api/Pdfs/buscar-paginado?${queryParams}`;
      console.log('🌐 URL da busca:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      console.log('📡 Status da busca:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Dados da busca:', data);
      
      if (!data.sucesso) {
        throw new Error(data.mensagem || 'Erro ao buscar PDFs');
      }
      
      // Transformar a resposta da API real para o formato esperado pelo frontend
      return {
        success: data.sucesso,
        data: data.arquivos.map(mapPdfInfoToPDFItem),
        pagination: {
          currentPage: data.paginaAtual,
          totalPages: data.totalPaginas,
          totalItems: data.totalEncontrados,
          itemsPerPage: data.itensPorPagina
        },
        message: data.mensagem
      };
    } catch (error) {
      console.error('❌ Erro na busca de PDFs:', error);
      throw error;
    }
  }

  /**
   * Upload de arquivo PDF
   */
  static async uploadPDF(file: File, customName?: string): Promise<PDFItem> {
    console.log('📤 Iniciando upload de PDF:', file.name);
    
    const formData = new FormData();
    formData.append('arquivo', file); // API espera campo 'arquivo'
    
    console.log('📋 Dados do FormData:');
    console.log('  - Nome do arquivo:', file.name);
    console.log('  - Tamanho:', file.size, 'bytes');
    console.log('  - Tipo:', file.type);
    
    if (customName) {
      console.log('  - Nome personalizado:', customName);
    }

    try {
      let uploadUrl = `${API_BASE_URL}/pdfs/upload`;
      
      if (customName) {
        uploadUrl += `?nomePersonalizado=${encodeURIComponent(customName)}`;
      }

      console.log('🌐 URL do upload:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Remover Content-Type para FormData (o browser define automaticamente)
        },
      });

      console.log('📡 Status do upload:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Erro na resposta:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Upload concluído:', result);
      
      if (!result.sucesso) {
        throw new Error(result.mensagem || 'Erro no upload');
      }

      // Converter resposta da API para PDFItem
      return {
        id: result.nomeArquivo,
        title: result.nomeArquivo.replace(/\.[^/.]+$/, ''),
        fileName: result.nomeArquivo,
        url: result.caminhoCompleto || `/pdfs/${result.nomeArquivo}`,
        size: `${result.tamanhoMB.toFixed(2)} MB`,
        uploadDate: result.dataUpload,
        description: `PDF enviado em ${new Date(result.dataUpload).toLocaleDateString('pt-BR')}`
      };

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      throw error;
    }
  }

  /**
   * Visualizar PDF (retorna base64) - Baseado na implementação original
   */
  static async viewPDF(fileName: string): Promise<string> {
    console.log('🚀 Iniciando busca do PDF:', fileName);

    try {
      // URL encode para caracteres especiais - usar endpoint correto da API
      const nomeEncoded = encodeURIComponent(fileName);
      const url = `http://20.65.208.119:5000/api/Pdfs/download/${nomeEncoded}`;

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

  /**
   * Edita informações de um PDF e remove páginas selecionadas
   */
  static async editPDF(editData: PDFEditRequest): Promise<PDFEditResponse> {
    try {
      console.log('📝 Editando PDF:', editData);

      // Primeiro, obter o número real de páginas do PDF
      let totalPages = 0;
      try {
        const pagesInfo = await this.getPDFPages(editData.fileName);
        totalPages = pagesInfo.length;
        console.log(`📄 PDF ${editData.fileName} tem ${totalPages} páginas totais`);
      } catch (error) {
        console.error('Erro ao obter páginas do PDF:', error);
        throw new Error('Não foi possível obter informações das páginas do PDF');
      }

      // Calcular páginas para remover (todas menos as selecionadas)
      const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
      const pagesToRemove = allPages.filter(page => !editData.pagesToKeep.includes(page));
      
      console.log('📄 Páginas selecionadas para manter:', editData.pagesToKeep);
      console.log('📄 Páginas para remover:', pagesToRemove);
      
      if (pagesToRemove.length === 0) {
        console.log('📝 Nenhuma página para remover');
        return {
          success: true,
          message: 'Nenhuma modificação necessária - todas as páginas foram mantidas',
          updatedPdf: {
            id: editData.id,
            title: editData.title,
            fileName: editData.fileName,
            description: editData.description,
            url: `/api/pdfs/preview/${encodeURIComponent(editData.fileName)}`,
            size: '2.5 MB',
            uploadDate: new Date().toISOString().split('T')[0]
          }
        };
      }

      // Chamar API real para remover páginas
      const url = `http://20.65.208.119:5000/api/Pdfs/remover-paginas/${encodeURIComponent(editData.fileName)}`;
      console.log('🌐 Chamando API de remoção de páginas:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paginasParaRemover: pagesToRemove
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na API: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const apiResult = await response.json();
      console.log('✅ Resposta da API de remoção:', apiResult);

      if (apiResult.sucesso) {
        // Construir resposta com dados da API
        const updatedPdf: PDFItem = {
          id: editData.id,
          title: editData.title,
          fileName: apiResult.nomeArquivo || editData.fileName,
          description: editData.description,
          url: `/api/pdfs/preview/${encodeURIComponent(apiResult.nomeArquivo || editData.fileName)}`,
          size: `${apiResult.tamanhoFinalMB?.toFixed(2) || '0.00'} MB`,
          uploadDate: apiResult.dataModificacao ? new Date(apiResult.dataModificacao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };

        const message = `PDF editado com sucesso! ${apiResult.paginasRemovidasCount || 0} página(s) removida(s). ${apiResult.totalPaginasFinais || 0} página(s) restante(s).`;

        return {
          success: true,
          message,
          updatedPdf
        };
      } else {
        throw new Error(apiResult.mensagem || 'Erro na API de remoção de páginas');
      }

    } catch (error) {
      console.error('❌ Erro ao editar PDF:', error);
      
      // Se a API falhar, ainda permitir a edição do nome (sem remoção de páginas)
      if (error instanceof Error && error.message.includes('Erro na API')) {
        return {
          success: false,
          message: `Não foi possível remover as páginas: ${error.message}. O nome do arquivo foi preservado.`,
          updatedPdf: undefined
        };
      }
      
      throw new Error(error instanceof Error ? error.message : 'Erro ao editar PDF');
    }
  }

  /**
   * Obtém informações das páginas de um PDF
   */
  static async getPDFPages(fileName: string): Promise<PDFPageInfo[]> {
    try {
      console.log('📄 Carregando páginas do PDF:', fileName);

      // Primeiro, tentar obter informações reais da API
      try {
        const url = `http://20.65.208.119:5000/api/Pdfs/listar?nome=${encodeURIComponent(fileName)}`;
        console.log('🌐 Tentando obter informações reais da API:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Informações reais obtidas da API:', data);
          
          if (data.sucesso && data.arquivos && data.arquivos.length > 0) {
            const arquivo = data.arquivos.find((arq: any) => arq.nome === fileName) || data.arquivos[0];
            
            if (arquivo && arquivo.numeroPaginas && typeof arquivo.numeroPaginas === 'number') {
              const pageCount = arquivo.numeroPaginas;
              console.log(`📄 PDF ${fileName} tem ${pageCount} páginas reais`);
              
              return Array.from({ length: pageCount }, (_, index) => ({
                pageNumber: index + 1,
                selected: true,
                thumbnail: this.generatePageThumbnail(index + 1)
              }));
            } else {
              console.log('⚠️ Campo numeroPaginas não encontrado ou inválido:', arquivo);
            }
          } else {
            console.log('⚠️ Estrutura de resposta inesperada:', data);
          }
        } else {
          console.log('⚠️ API não retornou sucesso, status:', response.status);
        }
      } catch (apiError) {
        console.log('⚠️ Erro na API real, usando fallback mock:', apiError);
      }

      // Fallback: usar dados mock consistentes
      const hashCode = fileName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      const pageCount = Math.abs(hashCode % 8) + 3; // Entre 3 e 10 páginas (consistente para o mesmo arquivo)
      
      console.log(`📄 Usando mock: ${pageCount} páginas para ${fileName}`);
      
      const mockPages: PDFPageInfo[] = Array.from({ length: pageCount }, (_, index) => ({
        pageNumber: index + 1,
        selected: true,
        thumbnail: this.generatePageThumbnail(index + 1)
      }));

      return mockPages;

    } catch (error) {
      console.error('❌ Erro ao carregar páginas do PDF:', error);
      throw new Error(error instanceof Error ? error.message : 'Erro ao carregar páginas do PDF');
    }
  }

  /**
   * Gera thumbnail SVG para uma página
   */
  private static generatePageThumbnail(pageNumber: number): string {
    const thumbnailSvg = `
      <svg width="200" height="280" xmlns="http://www.w3.org/2000/svg" style="background: white;">
        <defs>
          <pattern id="textLines${pageNumber}" patternUnits="userSpaceOnUse" width="200" height="20">
            <rect width="200" height="20" fill="white"/>
            <rect x="20" y="8" width="${120 + Math.random() * 60}" height="2" fill="#333" opacity="0.8"/>
            <rect x="20" y="12" width="${100 + Math.random() * 80}" height="2" fill="#333" opacity="0.6"/>
            <rect x="20" y="16" width="${140 + Math.random() * 40}" height="2" fill="#333" opacity="0.7"/>
          </pattern>
        </defs>
        
        <!-- Fundo da página -->
        <rect width="200" height="280" fill="white" stroke="#ddd" stroke-width="1"/>
        
        <!-- Header simulado -->
        <rect x="20" y="20" width="160" height="25" fill="#f0f0f0" stroke="#ddd"/>
        <rect x="25" y="25" width="60" height="3" fill="#666"/>
        <rect x="25" y="30" width="40" height="2" fill="#999"/>
        <text x="25" y="40" font-family="Arial, sans-serif" font-size="8" fill="#333">Página ${pageNumber}</text>
        
        <!-- Conteúdo simulado com linhas de texto -->
        <rect x="0" y="60" width="200" height="180" fill="url(#textLines${pageNumber})"/>
        
        <!-- Rodapé -->
        <rect x="20" y="250" width="160" height="15" fill="#f8f8f8" stroke="#eee"/>
        <text x="90" y="260" font-family="Arial, sans-serif" font-size="8" fill="#666" text-anchor="middle">${pageNumber}</text>
        
        <!-- Elementos decorativos baseados no número da página -->
        ${pageNumber % 3 === 0 ? `<rect x="20" y="100" width="160" height="40" fill="#f0f8ff" stroke="#bde4ff" stroke-dasharray="2,2"/>` : ''}
        ${pageNumber % 4 === 0 ? `<circle cx="170" cy="80" r="8" fill="#ffe4e1" stroke="#ffb6c1"/>` : ''}
        ${pageNumber % 5 === 0 ? `<rect x="140" y="120" width="40" height="30" fill="#f0fff0" stroke="#90ee90" stroke-width="0.5"/>` : ''}
      </svg>
    `;
    
    // Converter SVG para data URI
    return `data:image/svg+xml;base64,${btoa(thumbnailSvg)}`;
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
      const url = 'http://20.65.208.119:5000/api/Pdfs/unificados';
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
   * Obter informações das páginas de um PDF unificado específico
   * Como PDFs unificados usam endpoint diferente, geramos páginas baseado no numeroPaginas
   */
  static async getUnifiedPDFPages(fileName: string): Promise<PDFPageInfo[]> {
    console.log('🚀 Obtendo páginas do PDF unificado:', fileName);

    try {
      // Primeiro obter informações do PDF unificado da lista
      const unifiedPdfs = await this.listUnifiedPDFs();
      const targetPdf = unifiedPdfs.find(pdf => pdf.fileName === fileName);

      if (!targetPdf) {
        throw new Error(`PDF unificado não encontrado: ${fileName}`);
      }

      const totalPages = targetPdf.pageCount || 0;
      console.log('📄 Total de páginas encontradas:', totalPages);

      // Gerar array de páginas baseado no número total
      const pages: PDFPageInfo[] = Array.from({ length: totalPages }, (_, index) => ({
        pageNumber: index + 1,
        selected: true, // Todas as páginas selecionadas por padrão
        thumbnail: undefined // PDFs unificados não têm thumbnails específicos
      }));

      console.log('✅ Páginas do PDF unificado geradas:', pages.length);
      return pages;

    } catch (error) {
      console.error('❌ Erro ao obter páginas do PDF unificado:', error);
      throw error;
    }
  }

  /**
   * Unificar PDFs específicos usando o endpoint real da API
   */
  static async unifyPDFs(request: UnificationRequest): Promise<UnifiedPDFItem> {
    console.log('🚀 Iniciando unificação de PDFs:', request);

    try {
      // Converter o request do frontend para o formato da API
      const apiRequest: UnificationAPIRequest = {
        nomesPdfs: request.sourceFileIds, // IDs dos PDFs (na verdade são nomes de arquivo)
        nomeArquivoSaida: request.title.endsWith('.pdf') ? request.title : `${request.title}.pdf`
      };

      console.log('📤 Payload para API:', apiRequest);

      const response = await fetch('http://20.65.208.119:5000/api/Pdfs/unificar-especificos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiRequest),
        mode: 'cors',
      });

      console.log('📡 Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: UnificationAPIResponse = await response.json();
      console.log('📥 Resposta da API:', data);

      if (!data.sucesso) {
        throw new Error(data.mensagem || 'Erro ao unificar PDFs');
      }

      // Converter a resposta da API para UnifiedPDFItem
      const unifiedPDF: UnifiedPDFItem = {
        id: `unified-${Date.now()}`,
        title: request.title,
        url: data.caminhoArquivoSaida || '',
        fileName: data.nomeArquivoSaida || `${request.title}.pdf`,
        size: `${data.tamanhoFinalMB.toFixed(2)} MB`,
        uploadDate: data.dataCriacao,
        description: request.description || `PDF unificado com ${data.totalArquivosUnificados} arquivos`,
        sourceFiles: data.arquivosProcessados,
        pageCount: 0 // A API não retorna o número de páginas, pode ser calculado depois
      };

      console.log('✅ PDF unificado criado com sucesso:', unifiedPDF);
      return unifiedPDF;

    } catch (error) {
      console.error('❌ Erro ao unificar PDFs:', error);
      throw error;
    }
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
      const url = `http://20.65.208.119:5000/api/Pdfs/download-unificado/${nomeEncoded}`;

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

  /**
   * Editar PDF unificado removendo páginas específicas
   */
  static async editUnifiedPDF(fileName: string, pagesToRemove: number[]): Promise<{
    sucesso: boolean;
    mensagem: string;
    nomeArquivo: string;
    caminhoArquivo: string;
    caminhoBackup: string;
    totalPaginasOriginais: number;
    totalPaginasFinais: number;
    paginasRemovidas: number[];
    paginasRemovidasCount: number;
    paginasNaoEncontradas: number[];
    tamanhoFinalBytes: number;
    tamanhoFinalMB: number;
    dataModificacao: string;
  }> {
    console.log('🚀 Editando PDF unificado:', {
      fileName,
      pagesToRemove,
      fileNameType: typeof fileName,
      pagesToRemoveType: typeof pagesToRemove,
      pagesToRemoveLength: pagesToRemove?.length,
      isValidArray: Array.isArray(pagesToRemove)
    });

    // Validações mais rigorosas
    if (!fileName || typeof fileName !== 'string') {
      throw new Error('Nome do arquivo é obrigatório e deve ser uma string');
    }

    if (!Array.isArray(pagesToRemove) || pagesToRemove.length === 0) {
      throw new Error('Lista de páginas para remover é obrigatória e deve ser um array não vazio');
    }

    // Verificar se todas as páginas são números válidos
    const invalidPages = pagesToRemove.filter(page => !Number.isInteger(page) || page < 1);
    if (invalidPages.length > 0) {
      throw new Error(`Páginas inválidas encontradas: ${invalidPages.join(', ')}`);
    }

    try {
      // URL encode para caracteres especiais
      const nomeEncoded = encodeURIComponent(fileName);
      const url = `http://20.65.208.119:5000/api/Pdfs/remover-paginas-unificado/${nomeEncoded}`;

      console.log('🔗 URLs de comparação:', {
        'URL construída': url,
        'URL exemplo (curl)': `http://20.65.208.119:5000/api/Pdfs/remover-paginas-unificado/{nomePdf}`,
        'Nome original': fileName,
        'Nome encoded': nomeEncoded,
        'Diferença': fileName !== nomeEncoded ? 'SIM - Nome foi encoded' : 'NÃO - Nome não mudou'
      });

      const requestBody = {
        paginasParaRemover: pagesToRemove
      };

      console.log('🌐 Requisição completa:', {
        url,
        method: 'PUT',
        fileName: fileName,
        fileNameEncoded: nomeEncoded,
        requestBody: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Status da resposta:', response.status, response.statusText);
      console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()));

      // Tentar ler a resposta mesmo em caso de erro para debug
      let responseText = '';
      try {
        responseText = await response.text();
        console.log('� Resposta raw:', responseText);
      } catch (textError) {
        console.error('❌ Erro ao ler resposta como texto:', textError);
      }

      if (!response.ok) {
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          url: url,
          method: 'PUT',
          requestBody: requestBody,
          responseText: responseText,
          headers: Object.fromEntries(response.headers.entries())
        };
        
        console.error('❌ Erro HTTP completo:', errorDetails);
        
        // Criar mensagem de erro mais informativa
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        if (responseText && responseText.trim()) {
          try {
            const responseData = JSON.parse(responseText);
            if (responseData.mensagem) {
              errorMessage += ` - ${responseData.mensagem}`;
            }
          } catch {
            errorMessage += ` - ${responseText}`;
          }
        }
        
        // Se for 400, adicionar detalhes específicos
        if (response.status === 400) {
          errorMessage += `\n\nDetalhes da requisição:`;
          errorMessage += `\n- URL: ${url}`;
          errorMessage += `\n- Arquivo: ${fileName}`;
          errorMessage += `\n- Páginas para remover: ${pagesToRemove.join(', ')}`;
        }
        
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Erro ao fazer parse JSON da resposta:', parseError);
        throw new Error('Resposta inválida do servidor - não é um JSON válido');
      }
      console.log('📥 Resposta da edição:', data);

      if (data.sucesso) {
        console.log('✅ PDF unificado editado com sucesso:', {
          arquivo: data.nomeArquivo,
          paginasOriginais: data.totalPaginasOriginais,
          paginasFinais: data.totalPaginasFinais,
          paginasRemovidas: data.paginasRemovidasCount,
          tamanhoFinal: data.tamanhoFinalMB + ' MB'
        });
      }

      return data;

    } catch (error) {
      console.error('❌ Erro ao editar PDF unificado:', error);
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

  /**
   * Valida arquivo PDF antes do upload
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Verificar tipo MIME
    if (!file.type || file.type !== 'application/pdf') {
      return {
        isValid: false,
        error: 'Arquivo deve ser do tipo PDF',
      };
    }

    // Verificar tamanho (máximo 50MB)
    const maxSizeInBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
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
}

// Exportações por conveniência
export default PDFService;
