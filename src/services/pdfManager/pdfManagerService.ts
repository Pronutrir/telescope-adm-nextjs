/**
 * Serviço para integração com API SharePoint PDF - Gerenciador de PDFs
 * 
 * URL configurada via variável de ambiente: PDF_API_URL
 * Documentação: Acesse /swagger na URL configurada
 * 
 * Baseado na especificação OpenAPI 3.0.1 oficial da API
 */

export interface SharePointPdfItem {
  id: string | null
  name: string | null
  size: number // int64
  lastModified: string // date-time format
  downloadUrl: string | null
  customFields?: {
    FileLeafRef?: string
    MediaServiceImageTags?: Record<string, any>
    Modified?: string
    Tasy?: boolean | string
    NAS?: boolean | string
    ContentType?: string
    Created?: string
    AuthorLookupId?: string
    EditorLookupId?: string
    LinkFilenameNoMenu?: string
    LinkFilename?: string
    DocIcon?: string
    FileSizeDisplay?: string
    ItemChildCount?: string
    FolderChildCount?: string
    AppAuthorLookupId?: string
    Edit?: string
    ParentVersionStringLookupId?: string
    ParentLeafNameLookupId?: string
    [key: string]: any // Permitir campos customizados adicionais
  }
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
      console.log('🔍 [PDFManagerService] Iniciando listagem de PDFs...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos timeout
      
      // Usar a rota específica para listar PDFs
      const response = await fetch(`/api/pdfs/listar`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('📡 [PDFManagerService] Resposta recebida:', response.status, response.statusText)

      if (!response.ok) {
        console.error(`❌ [PDFManagerService] Falha ao listar PDFs: ${response.status} ${response.statusText}`)
        // Não lançar erro; retornar lista vazia para UI lidar com estado de indisponibilidade
        return []
      }

      const pdfs: SharePointPdfItem[] = await response.json()
      console.log('✅ [PDFManagerService] PDFs carregados:', pdfs.length)
      return pdfs
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('❌ [PDFManagerService] Timeout ao listar PDFs do SharePoint')
      } else {
        console.error('❌ [PDFManagerService] Erro ao listar PDFs do SharePoint:', error)
      }
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
            } catch {
              errorMessage = responseText || errorMessage
            }
          }
        } catch {
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
      
      const url = `/api/pdfs/buscar?query=${encodeURIComponent(searchTerm)}&page=${page}&limit=${pageSize}`
      
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
        await response.text()
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
      }

      const searchResponse: PagedPdfResponse = await response.json()
      return searchResponse
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('❌ [PDFManagerService] Timeout na busca de PDFs')
      } else {
        console.error('❌ Erro na busca de PDFs:', error)
      }
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
    } catch (e) {
      console.error('🗓️ [PDFManagerService.formatDate] Error:', e, 'Input:', dateString)
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
        setor: string
        nomeCompleto: string
        numeroAtendimento: string
        dataUpload: string
        hash: string
      }
    }>
  ): Promise<any> {
    try {
      // Lista de setores com siglas
      const setores = [
        { nome: 'Autorização', sigla: 'AU' },
        { nome: 'Prescrição', sigla: 'PR' },
        { nome: 'Conta', sigla: 'CO' },
        { nome: 'Sadt', sigla: 'SA' },
        { nome: 'Guia', sigla: 'GU' }
      ]

      const formData = new FormData()
      
      // Adicionar todos os arquivos ao FormData
      files.forEach((fileData, index) => {
        const { file, nomeComposicao } = fileData
        
        // Obter sigla do setor
        const setorSelecionado = setores.find(s => s.nome === nomeComposicao.setor)
        const siglaSetor = setorSelecionado?.sigla || nomeComposicao.setor.substring(0, 2).toUpperCase()
        
        // Formatar nome completo (manter espaços, apenas normalizar múltiplos espaços)
        const nomeFormatado = nomeComposicao.nomeCompleto.trim().replace(/\s+/g, ' ')
        
        // Compor o nome do arquivo com hash único e sigla do setor
        const uniqueHash = `${nomeComposicao.hash}${index.toString().padStart(2, '0')}`
        const nomeComposto = `${siglaSetor}_${nomeFormatado}_${nomeComposicao.numeroAtendimento}_${nomeComposicao.dataUpload}_${uniqueHash}.pdf`
        
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
      setor: string
      nomeCompleto: string
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
    } catch {
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
        } catch {
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

    } catch (e) {
      console.error('❌ [PDFManagerService] Erro ao unificar PDFs:', e)
      throw e
    }
  }

  /**
   * Obter informações das páginas de um PDF específico
   * @param fileName Nome do arquivo PDF
   * @returns Promise com array de informações das páginas
   */
  static async getPDFPages(fileName: string): Promise<Array<{
    pageNumber: number
    thumbnail: string
    selected: boolean
  }>> {
    try {
      console.log(`📄 [PDFManagerService] Obtendo páginas para PDF: ${fileName}`)

      // Extrair informações do nome do arquivo para estimar número de páginas
      let estimatedPages = 10 // Padrão

      if (fileName.includes('unificad') || fileName.includes('UNI_') || fileName.includes('UNIF')) {
        estimatedPages = 25 // PDFs unificados tendem a ter mais páginas
      } else if (fileName.includes('relatorio')) {
        estimatedPages = 15
      } else if (fileName.includes('doc') || fileName.includes('manual')) {
        estimatedPages = 30
      }

      // Gerar array de páginas com thumbnails
      const pages = Array.from({ length: estimatedPages }, (_, i) => ({
        pageNumber: i + 1,
        thumbnail: this.generatePageThumbnail(i + 1),
        selected: true // Por padrão, todas as páginas estão selecionadas
      }))

      console.log(`✅ [PDFManagerService] Retornando ${pages.length} páginas para ${fileName}`)
      return pages

    } catch (error) {
      console.error('❌ [PDFManagerService] Erro ao obter páginas do PDF:', error)
      
      // Fallback com páginas básicas
      const fallbackPages = Array.from({ length: 10 }, (_, i) => ({
        pageNumber: i + 1,
        thumbnail: this.generatePageThumbnail(i + 1),
        selected: true
      }))
      
      return fallbackPages
    }
  }

  /**
   * Gerar thumbnail SVG para uma página
   * @param pageNumber Número da página
   * @returns Data URL do thumbnail SVG
   */
  private static generatePageThumbnail(pageNumber: number): string {
    const svg = `
      <svg width="120" height="160" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="160" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1" rx="4"/>
        <rect x="10" y="15" width="100" height="4" fill="#dee2e6" rx="2"/>
        <rect x="10" y="25" width="80" height="4" fill="#dee2e6" rx="2"/>
        <rect x="10" y="35" width="90" height="4" fill="#dee2e6" rx="2"/>
        <rect x="10" y="45" width="70" height="4" fill="#dee2e6" rx="2"/>
        <rect x="10" y="55" width="95" height="4" fill="#dee2e6" rx="2"/>
        
        <!-- Número da página -->
        <circle cx="60" cy="130" r="15" fill="#6c757d"/>
        <text x="60" y="135" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${pageNumber}</text>
        
        <!-- Ícone PDF -->
        <rect x="45" y="80" width="30" height="35" fill="#dc3545" rx="2"/>
        <text x="60" y="100" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">PDF</text>
      </svg>
    `
    
    const encodedSvg = encodeURIComponent(svg)
    return `data:image/svg+xml,${encodedSvg}`
  }

  /**
   * Lista PDFs unificados do SharePoint
   * GET /api/Pdfs/unified
   * @returns Promise com lista de PDFs unificados
   */
  static async listarPDFsUnificados(): Promise<SharePointPdfItem[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch('/api/pdfs/unificados', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`)
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

    } catch (_error) {
      if (_error instanceof Error && _error.name === 'AbortError') {
        console.error('❌ [PDFManagerService] Timeout ao listar PDFs unificados')
        return []
      }
      console.error('❌ [PDFManagerService] Erro ao listar PDFs unificados:', _error)
      return []
    }
  }

  /**
   * Buscar PDFs unificados com filtro
   * GET /api/Pdfs/unified/search?searchTerm=termo&page=1&pageSize=10
   * @param searchTerm - Termo de busca
   * @param page - Número da página (padrão: 1)
   * @param pageSize - Tamanho da página (padrão: 10)
   * @returns Promise com lista de PDFs unificados filtrados
   */
  static async buscarPDFsUnificados(
    searchTerm: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<SharePointPdfItem[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      // Construir query params
      const params = new URLSearchParams({
        searchTerm: searchTerm,
        page: page.toString(),
        pageSize: pageSize.toString()
      })

      const response = await fetch(`/api/pdfs/unificados/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`)
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

    } catch (_error) {
      if (_error instanceof Error && _error.name === 'AbortError') {
        console.error('❌ [PDFManagerService] Timeout ao buscar PDFs unificados')
        return []
      }
      console.error('❌ [PDFManagerService] Erro ao buscar PDFs unificados:', _error)
      return []
    }
  }
}

// Export default para compatibilidade
export default PDFManagerService
