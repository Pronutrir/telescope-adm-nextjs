import { useState, useEffect, useCallback } from 'react'
import PDFManagerService, { 
    type SharePointPdfItem, 
    type PagedPdfResponse
} from '@/services/pdfManager/pdfManagerService'
import type { PDFItem } from '@/types/pdf'

interface UsePDFManagerReturn {
    pdfs: PDFItem[]
    filteredPdfs: PDFItem[]
    isLoading: boolean
    error: string | null
    totalItems: number
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    loadPDFs: () => Promise<void>
    searchPDFs: (term: string, page?: number) => Promise<void>
    refreshPDFs: () => Promise<void>
    clearError: () => void
}

export const usePDFManager = (): UsePDFManagerReturn => {
    // IMPORTANTE: O carregamento inicial é feito no componente pai (page.tsx)
    // para evitar conflitos com o sistema de busca
    const [pdfs, setPdfs] = useState<PDFItem[]>([])
    const [filteredPdfs, setFilteredPdfs] = useState<PDFItem[]>([])
    const [isLoading, setIsLoading] = useState(true) // Iniciar como loading para evitar flash
    const [error, setError] = useState<string | null>(null)
    const [totalItems, setTotalItems] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [currentSearchTerm, setCurrentSearchTerm] = useState('')

    // Função para converter SharePoint items para PDFItem
    const convertSharePointToPDFItems = useCallback((items: SharePointPdfItem[]): PDFItem[] => {
        return (items || []).map(item => PDFManagerService.convertToPDFItem(item))
    }, [])

    // Carregar todos os PDFs
    const loadPDFs = useCallback(async () => {
        console.log('🔍 [usePDFManager] Iniciando loadPDFs...')
        setIsLoading(true)
        setError(null) // Limpar erro no início
        
        try {
            // Não verifica status aqui, deixa o serviço lidar com fallback
            console.log('📡 [usePDFManager] Chamando PDFManagerService.listarTodosPdfs()...')
            const sharePointItems = await PDFManagerService.listarTodosPdfs()
            console.log('📊 [usePDFManager] Recebidos', sharePointItems.length, 'itens do SharePoint')
            
            const pdfItems = convertSharePointToPDFItems(sharePointItems)
            console.log('🔄 [usePDFManager] Convertidos para', pdfItems.length, 'PDFItems')
            
            setPdfs(pdfItems)
            setFilteredPdfs(pdfItems)
            setTotalItems(pdfItems.length)
            setCurrentPage(1)
            setTotalPages(1)
            setCurrentSearchTerm('')
            
            if (pdfItems.length === 0) {
                // Sinalizar indisponibilidade amigavelmente sem quebrar a página
                setError('Serviço de PDF temporariamente indisponível (503). Tente novamente mais tarde.')
                console.warn('⚠️ [usePDFManager] Lista vazia recebida — possivelmente 503 upstream')
            } else {
                console.log('✅ [usePDFManager] Dados reais do SharePoint carregados')
                setError(null)
            }
            
        } catch (error) {
            console.error('❌ [usePDFManager] Erro ao carregar PDFs:', error)
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao carregar PDFs'
            
            // Não mostrar erros relacionados a modo demonstração (não usamos mais)
            if (!errorMessage.includes('demonstração') && !errorMessage.includes('indisponível')) {
                setError(errorMessage)
            }
            
            setPdfs([])
            setFilteredPdfs([])
            setTotalItems(0)
            setTotalPages(1)
            setCurrentPage(1)
        } finally {
            setIsLoading(false)
            console.log('🏁 [usePDFManager] loadPDFs finalizado')
        }
    }, [convertSharePointToPDFItems])

    // Buscar PDFs
    const searchPDFs = useCallback(async (term: string, page: number = 1) => {
        setIsLoading(true)
        setError(null)
        
        try {
            // Não verifica status aqui, deixa o serviço lidar com fallback
            let response: PagedPdfResponse

            if (term.trim()) {
                // Fazer busca específica
                response = await PDFManagerService.buscarPdfs({
                    searchTerm: term,
                    page,
                    pageSize: 20
                })
                setCurrentSearchTerm(term)
            } else {
                // Para sem termo de busca, carregar todos e simular paginação
                const allItems = await PDFManagerService.listarTodosPdfs()
                const startIndex = (page - 1) * 20
                const endIndex = startIndex + 20
                const pageItems = allItems.slice(startIndex, endIndex)
                
                response = {
                    items: pageItems,
                    currentPage: page,
                    pageSize: 20,
                    totalItems: allItems.length,
                    totalPages: Math.ceil(allItems.length / 20),
                    hasPreviousPage: page > 1,
                    hasNextPage: endIndex < allItems.length,
                    searchTerm: ''
                }
                setCurrentSearchTerm('')
            }

            const pdfItems = convertSharePointToPDFItems(response.items || [])
            setPdfs(pdfItems)
            setFilteredPdfs(pdfItems)
            setTotalItems(response.totalItems)
            setCurrentPage(response.currentPage)
            setTotalPages(response.totalPages)
            
            // Com as APIs diretas, sempre temos dados reais - sem verificação de demo
            
        } catch (error) {
            console.error('Erro na busca:', error)
            const errorMessage = error instanceof Error ? error.message : 'Erro na busca de PDFs'
            
            // Não mostrar erros relacionados a modo demonstração (não usamos mais)
            if (!errorMessage.includes('demonstração') && !errorMessage.includes('indisponível')) {
                setError(errorMessage)
            }
            
            setPdfs([])
            setFilteredPdfs([])
            setTotalItems(0)
            setTotalPages(1)
            setCurrentPage(1)
        } finally {
            setIsLoading(false)
        }
    }, [convertSharePointToPDFItems])

    // Atualizar dados
    const refreshPDFs = useCallback(async () => {
        if (currentSearchTerm) {
            await searchPDFs(currentSearchTerm, currentPage)
        } else {
            await loadPDFs()
        }
    }, [currentSearchTerm, currentPage, searchPDFs, loadPDFs])

    // Limpar erro
    const clearError = useCallback(() => {
        setError(null)
    }, [])

    // Calcular navegação de páginas
    const hasNextPage = currentPage < totalPages
    const hasPreviousPage = currentPage > 1

    return {
        pdfs,
        filteredPdfs,
        isLoading,
        error,
        totalItems,
        currentPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        loadPDFs,
        searchPDFs,
        refreshPDFs,
        clearError
    }
}
