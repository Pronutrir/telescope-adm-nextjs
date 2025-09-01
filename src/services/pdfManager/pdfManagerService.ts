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
      console.log('📊 [PDFManagerService] listarTodosPdfs iniciado')
      console.log('📡 [PDFManagerService] Fazendo requisição para /api/test-list...')
      
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

      console.log('📈 [PDFManagerService] Response status:', response.status)
      console.log('📈 [PDFManagerService] Response ok:', response.ok)

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      const pdfs: SharePointPdfItem[] = await response.json()
      
      console.log(`✅ [PDFManagerService] ${pdfs.length} PDFs carregados do SharePoint`)
      console.log('📋 [PDFManagerService] Primeiros itens:', pdfs.slice(0, 3).map(p => ({ id: p.id, name: p.name })))
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
      console.log(`✂️ Editando PDF: ${request.pdfId}`, {
        pagesToRemove: request.pagesToRemove,
        outputFileName: request.outputFileName
      })
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos para edição
      
      // Usar o endpoint correto da API de PDFs
      const response = await fetch(`/pdf-api/Pdfs/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      console.log(`✅ PDF ${request.pdfId} editado com sucesso`)
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

      console.log('🔍 Buscando PDFs no SharePoint:', { searchTerm, page, pageSize })
      
      const url = `/api/test-search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`
      
      console.log('🔍 [buscarPdfs] URL construída:', url)
      console.log('🔍 [buscarPdfs] Parâmetros:', { searchTerm, page, pageSize })
      
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
        console.error('❌ Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      const searchResponse: PagedPdfResponse = await response.json()
      
      console.log(`✅ Busca concluída:`, {
        totalItems: searchResponse.totalItems,
        currentPage: searchResponse.currentPage,
        totalPages: searchResponse.totalPages,
        itemsCount: searchResponse.items?.length || 0,
        searchTerm: searchResponse.searchTerm
      })
      
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
      console.log(`📥 Tentando baixar PDF: ${id}`)
      
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

      console.log(`✅ PDF ${id} baixado com sucesso`)
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
    console.log('🔄 [convertToPDFItem] SharePoint item:', {
      id: item.id,
      name: item.name,
      lastModified: item.lastModified,
      lastModifiedType: typeof item.lastModified,
      downloadUrl: item.downloadUrl
    })
    
    // Garantir que temos uma data válida
    let uploadDate = new Date().toISOString() // Fallback para data atual
    
    if (item.lastModified) {
      // Se lastModified já é uma string de data válida, usar diretamente
      if (typeof item.lastModified === 'string') {
        uploadDate = item.lastModified
      } else if (item.lastModified instanceof Date) {
        uploadDate = item.lastModified.toISOString()
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
    
    console.log('🔄 [convertToPDFItem] Converted item:', {
      id: converted.id,
      fileName: converted.fileName,
      uploadDate: converted.uploadDate,
      uploadDateType: typeof converted.uploadDate
    })
    
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
      console.log(`📤 Fazendo upload do PDF: ${finalFileName}`)
      
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
      
      console.log(`✅ PDF ${finalFileName} enviado com sucesso:`, uploadedPdf)
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
      console.log('🗓️ [PDFManagerService.formatDate] Input:', dateString, typeof dateString)
      
      if (!dateString) {
        console.log('🗓️ [PDFManagerService.formatDate] Input vazio')
        return 'Data inválida'
      }
      
      const date = new Date(dateString)
      console.log('🗓️ [PDFManagerService.formatDate] Date object:', date)
      
      if (isNaN(date.getTime())) {
        console.log('🗓️ [PDFManagerService.formatDate] Data inválida detectada')
        return 'Data inválida'
      }
      
      const formatted = date.toLocaleDateString('pt-BR')
      console.log('🗓️ [PDFManagerService.formatDate] Formatted:', formatted)
      return formatted
    } catch (error) {
      console.error('🗓️ [PDFManagerService.formatDate] Error:', error, 'Input:', dateString)
      return 'Data inválida'
    }
  }
}

// Export default para compatibilidade
export default PDFManagerService
