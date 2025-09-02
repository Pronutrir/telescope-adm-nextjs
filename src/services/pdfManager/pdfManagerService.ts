/**
 * Serviço para integração com API SharePoint PDF - Gerenciador de PDFs
 * API: http://localhost:5000
 * Documentação: http://localhost:5000/swagger
 * 
 * Baseado na especificação OpenAPI 3.0.1 oficial da API
 */

export interface SharePointPdfItem {
  id: string | null
  name: string | null
  size: number // int64
  lastModified: string // date-time format
  downloadUrl: string | null
}

export interface PagedPdfResponse {
  items: SharePointPdfItem[] | null
  currentPage: number // int32
  pageSize: number // int32
  totalItems: number // int32
  totalPages: number // int32
  hasPreviousPage: boolean
  hasNextPage: boolean
  searchTerm: string | null
}

export interface EditPdfRequest {
  pdfId: string // required, minLength: 1
  pagesToRemove: number[] // required, array of int32
  outputFileName?: string | null // optional
}

export interface PdfManagerSearchParams {
  searchTerm?: string
  page?: number
  pageSize?: number
}

export class PDFManagerService {
  // Use proxy Next.js para resolver CORS
  private static readonly API_BASE_URL = '/api/sharepoint'

  /**
   * Lista todos os PDFs da pasta "PdfsTeste" no SharePoint
   * @returns Promise<SharePointPdfItem[]>
   */
  static async listarTodosPdfs(): Promise<SharePointPdfItem[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout
      
      const response = await fetch(`/api/test-list`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      const pdfs: SharePointPdfItem[] = await response.json()
      return pdfs
      
    } catch (error) {
      console.error('❌ [PDFManagerService] Erro ao listar PDFs do SharePoint:', error)
      // Retornar array vazio e deixar a UI lidar com o erro
      return []
    }
  }

  /**
   * Edita um PDF removendo páginas específicas
   * @param request Dados da edição
   * @returns Promise<Response>
   */
  static async editarPdf(request: EditPdfRequest): Promise<Response> {
    try {
      // Validações mais rigorosas
      if (!request.pdfId || typeof request.pdfId !== 'string' || request.pdfId.trim().length === 0) {
        throw new Error('pdfId é obrigatório e deve ser uma string não vazia')
      }

      if (!request.pagesToRemove || !Array.isArray(request.pagesToRemove) || request.pagesToRemove.length === 0) {
        throw new Error('pagesToRemove é obrigatório e deve ser um array não vazio')
      }

      // Verificar se todos os elementos são números
      const invalidPages = request.pagesToRemove.filter(page => typeof page !== 'number' || isNaN(page) || page < 1)
      if (invalidPages.length > 0) {
        throw new Error(`Páginas inválidas encontradas: ${invalidPages.join(', ')}. Todas as páginas devem ser números positivos.`)
      }
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos para edição
      
      const requestBody = JSON.stringify(request)
      
      // Usar o endpoint correto da API de PDFs
      const response = await fetch(`/pdf-api/Pdfs/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status} ${response.statusText}`
        let errorData = null
        
        try {
          const responseText = await response.text()
          
          // Tentar parsear como JSON se possível
          if (responseText) {
            try {
              errorData = JSON.parse(responseText)
              errorMessage = errorData.message || errorData.error || errorData.title || errorMessage
            } catch (parseError) {
              errorMessage = responseText || errorMessage
            }
          }
        } catch (readError) {
          // Silently handle read error
        }
        
        throw new Error(errorMessage)
      }

      return response
      
    } catch (error) {
      console.error(`❌ Erro ao editar PDF ${request.pdfId}:`, error)
      throw new Error(`Falha na edição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  /**
   * Busca PDFs com paginação e termo de pesquisa
   * @param params Parâmetros de busca
   * @returns Promise<PagedPdfResponse>
   */
  static async buscarPdfs(params: PdfManagerSearchParams = {}): Promise<PagedPdfResponse> {
    try {
      const {
        searchTerm = '',
        page = 1,
        pageSize = 10
      } = params
      
      const url = `/api/test-search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      const searchResponse: PagedPdfResponse = await response.json()
      return searchResponse
      
    } catch (error) {
      console.error('❌ Erro na busca de PDFs:', error)
      // Retornar resultado vazio ao invés de dados demo para evitar modo demonstração
      return {
        items: [],
        currentPage: params.page || 1,
        pageSize: params.pageSize || 10,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        searchTerm: params.searchTerm || null
      }
    }
  }

  /**
   * Baixa um PDF específico pelo ID
   * @param id ID do PDF no SharePoint
   * @returns Promise<Response>
   */
  static async baixarPdf(id: string): Promise<Response> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos para download
      
      const response = await fetch(`${this.API_BASE_URL}/download?id=${id}`, {
        method: 'GET',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      return response
      
    } catch (error) {
      console.error(`❌ Erro ao baixar PDF ${id}:`, error)
      throw new Error(`Falha no download: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  /**
   * Converte SharePointPdfItem para o formato PDFItem usado na interface
   * @param item Item do SharePoint
   * @returns PDFItem formatado
   */
  static convertToPDFItem(item: SharePointPdfItem) {
    // Garantir que temos uma data válida
    let uploadDate = new Date().toISOString() // Fallback para data atual
    
    if (item.lastModified) {
      // Se lastModified já é uma string de data válida, usar diretamente
      if (typeof item.lastModified === 'string') {
        uploadDate = item.lastModified
      } else if (item.lastModified && Object.prototype.toString.call(item.lastModified) === '[object Date]') {
        uploadDate = (item.lastModified as Date).toISOString()
      }
    }
    
    const converted = {
      id: item.id || 'unknown',
      title: (item.name || 'Documento sem nome').replace('.pdf', ''),
      url: item.downloadUrl || '#',
      fileName: item.name || 'documento.pdf',
      size: item.size ? `${(item.size / 1024 / 1024).toFixed(2)} MB` : '0 MB',
      uploadDate: uploadDate,
      description: `Documento ${item.name || 'sem nome'}`,
      thumbnailUrl: null // SharePoint não fornece thumbnail diretamente
    }
    
    return converted
  }

  /**
   * Upload de um novo PDF para o SharePoint
   * @param file Arquivo PDF para upload
   * @param fileName Nome do arquivo (opcional)
   * @returns Promise<SharePointPdfItem>
   */
  static async uploadPdf(file: File, fileName?: string): Promise<SharePointPdfItem> {
    try {
      const finalFileName = fileName || file.name
      
      const formData = new FormData()
      formData.append('file', file)
      if (fileName) {
        formData.append('fileName', fileName)
      }
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos para upload
      
      const response = await fetch(`${this.API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      const uploadedPdf: SharePointPdfItem = await response.json()
      return uploadedPdf
      
    } catch (error) {
      console.error(`❌ Erro no upload do PDF:`, error)
      throw new Error(`Falha no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  /**
   * Formatar data para exibição em português brasileiro
   * @param dateString String de data ISO ou timestamp
   * @returns Data formatada em DD/MM/AAAA
   */
  static formatDate(dateString: string): string {
    try {
      if (!dateString) {
        return 'Data inválida'
      }
      
      const date = new Date(dateString)
      
      if (isNaN(date.getTime())) {
        return 'Data inválida'
      }
      
      return date.toLocaleDateString('pt-BR')
    } catch (error) {
      console.error('🗓️ [PDFManagerService.formatDate] Error:', error, 'Input:', dateString)
      return 'Data inválida'
    }
  }
  
  /**
   * Faz upload de múltiplos PDFs para o SharePoint em lote
   * @param files Array com arquivos e parâmetros de composição
   * @returns Promise<any>
   */
  static async uploadMultiplePDFs(
    files: Array<{
      file: File
      nomeComposicao: {
        cdPessoaFisica: string
        numeroAtendimento: string
        dataUpload: string
        hash: string
      }
    }>
  ): Promise<any> {
    try {
      const formData = new FormData()
      
      // Adicionar todos os arquivos ao FormData
      files.forEach((fileData, index) => {
        const { file, nomeComposicao } = fileData
        
        // Compor o nome do arquivo com hash único
        const uniqueHash = `${nomeComposicao.hash}${index.toString().padStart(2, '0')}`
        const nomeComposto = `${nomeComposicao.cdPessoaFisica}_${nomeComposicao.numeroAtendimento}_${nomeComposicao.dataUpload}_${uniqueHash}.pdf`
        
        // Criar um novo arquivo com o nome composto
        const renamedFile = new File([file], nomeComposto, { type: file.type })
        formData.append('PdfFiles', renamedFile)
      })
      
      formData.append('OverwriteExisting', 'false')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minutos para múltiplos arquivos
      
      const response = await fetch(`/pdf-api/Pdfs/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
      
    } catch (error) {
      console.error('❌ [PDFManagerService] Erro no upload em lote:', error)
      throw error
    }
  }

  /**
   * Faz upload de um PDF para o SharePoint com composição personalizada do nome
   * @param file Arquivo PDF para upload
   * @param nomeComposicao Parâmetros para composição do nome do arquivo
   * @returns Promise<any>
   */
  static async uploadPDF(
    file: File, 
    nomeComposicao: {
      cdPessoaFisica: string
      numeroAtendimento: string
      dataUpload: string
      hash: string
    }
  ): Promise<any> {
    // Para um único arquivo, usar o método de lote
    return this.uploadMultiplePDFs([{ file, nomeComposicao }])
  }

  /**
   * Extrai informações de composição de nome a partir de um nome de arquivo PDF
   * Formato esperado: cdPessoaFisica_numeroAtendimento_dataUpload_hash.pdf
   */
  private static extractNomeComposicao(fileName: string): {
    cdPessoaFisica: string;
    numeroAtendimento: string;
    dataUpload: string;
    hash: string;
  } | null {
    try {
      // Remove a extensão .pdf
      const nameWithoutExt = fileName.replace(/\.pdf$/i, '');
      
      // Divide por underscore
      const parts = nameWithoutExt.split('_');
      
      // Verifica se tem pelo menos 4 partes (cdPessoa_numAtend_data_hash)
      if (parts.length >= 4) {
        return {
          cdPessoaFisica: parts[0],
          numeroAtendimento: parts[1], 
          dataUpload: parts[2],
          hash: parts[3]
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Gera nome composto para PDF unificado baseado nas informações dos arquivos selecionados
   */
  private static generateUnifiedFileName(pdfIds: string[], customFileName?: string): string {
    // Tentar extrair informações do primeiro arquivo que segue o padrão
    let baseComposicao: { cdPessoaFisica: string; numeroAtendimento: string; dataUpload: string; hash: string } | null = null;
    
    for (const pdfId of pdfIds) {
      const composicao = this.extractNomeComposicao(pdfId);
      if (composicao) {
        baseComposicao = composicao;
        break;
      }
    }
    
    if (baseComposicao) {
      // Usar padrão de nomeação estruturado
      const dataUnificacao = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      }).replace(/\//g, '');
      
      // Gerar hash único para o PDF unificado
      const timestamp = Date.now().toString();
      const hashUnificado = timestamp.slice(-8); // Últimos 8 dígitos do timestamp
      
      const nomeUnificado = `${baseComposicao.cdPessoaFisica}_${baseComposicao.numeroAtendimento}_${dataUnificacao}_UNIF${hashUnificado}.pdf`;
      return nomeUnificado;
    }
    
    // Fallback para o padrão anterior se não conseguir extrair informações
    const fallbackName = customFileName || `PDFs_Unificados_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '_')}.pdf`;
    return fallbackName;
  }

  /**
   * Unifica múltiplos PDFs em um único arquivo
   * POST /api/Pdfs/merge
   * @param pdfIds Array com IDs dos PDFs na ordem de unificação
   * @param outputFileName Nome do arquivo de saída (opcional)
   * @param maintainOrder Se deve manter a ordem dos PDFs (default: true)
   * @param overwrite Se deve sobrescrever arquivo existente (default: true)
   * @returns Promise com informações do PDF unificado
   */
  static async mergePDFs(
    pdfIds: string[],
    outputFileName?: string,
    maintainOrder: boolean = true,
    overwrite: boolean = true
  ): Promise<{
    success: boolean
    message?: string
    mergedFileId?: string
    mergedFileName?: string
    webUrl?: string
    errorMessage?: string
    totalPages?: number
    processedCount?: number
    sourcePdfs?: Array<{
      id: string
      fileName: string
      size: number
      pageCount: number
      order: number
      success: boolean
      errorMessage?: string
    }>
    processingTime?: {
      clicks: number
      days: number
      hours: number
      milliseconds: number
      microseconds: number
      nanoseconds: number
      minutes: number
    }
  }> {
    try {
      // Validação mais detalhada
      if (!pdfIds || !Array.isArray(pdfIds)) {
        throw new Error('IDs dos PDFs devem ser fornecidos como um array')
      }

      if (pdfIds.length === 0) {
        throw new Error('É necessário fornecer pelo menos um PDF para unificação')
      }

      if (pdfIds.length === 1) {
        throw new Error('É necessário selecionar pelo menos 2 PDFs para unificação')
      }

      // Gerar nome do arquivo seguindo o mesmo padrão dos uploads
      const nomeArquivoUnificado = this.generateUnifiedFileName(pdfIds, outputFileName);

      const requestBody = {
        pdfIds,
        outputFileName: nomeArquivoUnificado,
        maintainOrder,
        overwrite
      }

      const response = await fetch('/pdf-api/Pdfs/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status} ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // Silently handle parse error
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      
      // Validar se a API conseguiu processar os PDFs corretamente
      if (result.processedCount && result.processedCount < 2) {
        const failedPdfs = result.sourcePdfs?.filter((pdf: any) => !pdf.success) || []
        if (failedPdfs.length > 0) {
          const errorMessages = failedPdfs.map((pdf: any) => `${pdf.id}: ${pdf.errorMessage}`).join('; ')
          throw new Error(`Apenas ${result.processedCount} PDFs foram processados com sucesso. É necessário pelo menos 2 PDFs. Falhas: ${errorMessages}`)
        } else {
          throw new Error(`Apenas ${result.processedCount} PDFs foram processados com sucesso. É necessário pelo menos 2 PDFs`)
        }
      }
      
      return result

    } catch (error) {
      console.error('❌ [PDFManagerService] Erro ao unificar PDFs:', error)
      throw error
    }
  }

  /**
   * Lista PDFs unificados do SharePoint
   * GET /api/Pdfs/unified
   * @returns Promise com lista de PDFs unificados
   */
  static async listarPDFsUnificados(): Promise<SharePointPdfItem[]> {
    try {
      const response = await fetch('/pdf-api/Pdfs/unified', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status} ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // Silently handle parse error
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      
      // Verificar se é um array ou um objeto com propriedade de array
      if (Array.isArray(result)) {
        return result
      } else if (result.items && Array.isArray(result.items)) {
        return result.items
      } else {
        return []
      }

    } catch (error) {
      console.error('❌ [PDFManagerService] Erro ao listar PDFs unificados:', error)
      throw error
    }
  }
}

// Export default para compatibilidade
export default PDFManagerService
