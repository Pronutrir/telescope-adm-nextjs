'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
    PDFItem, 
    ViewMode, 
    PDFUIState, 
    SearchParams,
    PDFPreviewState,
    PDFFilters 
} from '@/types/pdf'
import { PDFService } from '@/services/pdf/pdfService'

/**
 * Hook personalizado para gerenciamento completo de PDFs
 * Centraliza toda a lógica de estado e operações relacionadas a PDFs
 */
export const usePDFManager = () => {
    // 🎯 Estados principais migrados do app_pdfs
    const [pdfs, setPdfs] = useState<PDFItem[]>([])
    const [filteredPdfs, setFilteredPdfs] = useState<PDFItem[]>([])
    const [uiState, setUiState] = useState<PDFUIState>({
        isLoading: true,
        isSearching: false,
        error: null,
        isSelectionMode: false,
        selectedForMerge: new Set(),
        viewMode: 'grid',
        searchTerm: '',
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 20
    })
    
    // Estados para preview
    const [previewState, setPreviewState] = useState<PDFPreviewState>({
        isOpen: false,
        selectedPdf: null,
        pdfBase64: null,
        isLoading: false
    })

    // Estados para filtros avançados
    const [filters, setFilters] = useState<PDFFilters>({})

    // 🎯 CARREGAR PDFs
    const loadPDFs = useCallback(async (params?: {
        page?: number
        limit?: number
        searchTerm?: string
        filters?: PDFFilters
    }) => {
        try {
            setUiState(prev => ({ ...prev, isLoading: true, error: null }))
            
            const searchParams = {
                page: params?.page || uiState.currentPage,
                limit: params?.limit || uiState.itemsPerPage,
                searchTerm: params?.searchTerm || uiState.searchTerm,
                ...params?.filters
            }

            // Se há termo de busca, usar busca
            if (searchParams.searchTerm) {
                const response = await PDFService.searchPDFs({
                    query: searchParams.searchTerm,
                    page: searchParams.page,
                    limit: searchParams.limit
                })
                
                setPdfs(response.data)
                setFilteredPdfs(response.data)
                setUiState(prev => ({
                    ...prev,
                    totalItems: response.pagination.totalItems,
                    totalPages: response.pagination.totalPages,
                    currentPage: response.pagination.currentPage
                }))
            } else {
                // Carregamento normal
                const data = await PDFService.listPDFs()
                setPdfs(data)
                setFilteredPdfs(data)
                setUiState(prev => ({
                    ...prev,
                    totalItems: data.length,
                    totalPages: Math.ceil(data.length / searchParams.limit)
                }))
            }
        } catch (error) {
            console.error('Erro ao carregar PDFs:', error)
            setUiState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            }))
            
            // Fallback para dados mock durante desenvolvimento
            const mockPdfs: PDFItem[] = [
                {
                    id: '1',
                    title: 'Manual do Usuário',
                    fileName: 'manual-usuario.pdf',
                    size: '2.5 MB',
                    uploadDate: '2025-01-10',
                    description: 'Manual completo do sistema',
                    url: '/pdfs/manual-usuario.pdf'
                },
                {
                    id: '2',
                    title: 'Relatório Anual 2024',
                    fileName: 'relatorio-2024.pdf',
                    size: '15.2 MB',
                    uploadDate: '2025-01-05',
                    description: 'Relatório financeiro anual',
                    url: '/pdfs/relatorio-2024.pdf'
                }
            ]
            setPdfs(mockPdfs)
            setFilteredPdfs(mockPdfs)
        } finally {
            setUiState(prev => ({ ...prev, isLoading: false }))
        }
    }, [uiState.currentPage, uiState.itemsPerPage, uiState.searchTerm])

    // 🎯 BUSCAR PDFs
    const searchPDFs = useCallback(async (searchTerm: string) => {
        setUiState(prev => ({ ...prev, searchTerm, currentPage: 1 }))
        await loadPDFs({ searchTerm, page: 1 })
    }, [loadPDFs])

    // 🎯 VISUALIZAR PDF
    const viewPDF = useCallback(async (pdf: PDFItem) => {
        setPreviewState(prev => ({ 
            ...prev, 
            isOpen: true, 
            selectedPdf: pdf, 
            isLoading: true,
            pdfBase64: null 
        }))

        try {
            const base64 = await PDFService.viewPDF(pdf.fileName)
            setPreviewState(prev => ({ 
                ...prev, 
                pdfBase64: base64, 
                isLoading: false 
            }))
        } catch (error) {
            console.error('Erro ao carregar PDF:', error)
            setPreviewState(prev => ({ 
                ...prev, 
                isLoading: false,
                error: error instanceof Error ? error.message : 'Erro ao carregar PDF'
            }))
        }
    }, [])

    // 🎯 FECHAR PREVIEW
    const closePreview = useCallback(() => {
        setPreviewState({
            isOpen: false,
            selectedPdf: null,
            pdfBase64: null,
            isLoading: false
        })
    }, [])

    // 🎯 ALTERAR MODO DE VISUALIZAÇÃO
    const changeViewMode = useCallback((mode: ViewMode) => {
        setUiState(prev => ({ ...prev, viewMode: mode }))
    }, [])

    // 🎯 PAGINAÇÃO
    const goToPage = useCallback(async (page: number) => {
        if (page >= 1 && page <= uiState.totalPages) {
            setUiState(prev => ({ ...prev, currentPage: page }))
            await loadPDFs({ page })
        }
    }, [uiState.totalPages, loadPDFs])

    const nextPage = useCallback(() => {
        if (uiState.currentPage < uiState.totalPages) {
            goToPage(uiState.currentPage + 1)
        }
    }, [uiState.currentPage, uiState.totalPages, goToPage])

    const prevPage = useCallback(() => {
        if (uiState.currentPage > 1) {
            goToPage(uiState.currentPage - 1)
        }
    }, [uiState.currentPage, goToPage])

    // 🎯 SELEÇÃO PARA MERGE
    const toggleSelectionMode = useCallback(() => {
        setUiState(prev => ({
            ...prev,
            isSelectionMode: !prev.isSelectionMode,
            selectedForMerge: new Set()
        }))
    }, [])

    const togglePDFSelection = useCallback((pdfId: string) => {
        setUiState(prev => {
            const newSelected = new Set(prev.selectedForMerge)
            if (newSelected.has(pdfId)) {
                newSelected.delete(pdfId)
            } else {
                newSelected.add(pdfId)
            }
            return { ...prev, selectedForMerge: newSelected }
        })
    }, [])

    const clearSelection = useCallback(() => {
        setUiState(prev => ({ ...prev, selectedForMerge: new Set() }))
    }, [])

    // 🎯 FILTROS AVANÇADOS
    const applyFilters = useCallback(async (newFilters: PDFFilters) => {
        setFilters(newFilters)
        await loadPDFs({ filters: newFilters, page: 1 })
    }, [loadPDFs])

    const clearFilters = useCallback(async () => {
        setFilters({})
        await loadPDFs({ filters: {}, page: 1 })
    }, [loadPDFs])

    // 🎯 UPLOAD PDF
    const uploadPDF = useCallback(async (file: File, customName?: string): Promise<PDFItem> => {
        const response = await PDFService.uploadPDF(file, customName)
        
        // Recarregar lista após upload
        await loadPDFs()
        
        return response
    }, [loadPDFs])

    // 🎯 DELETAR PDF
    const deletePDF = useCallback(async (id: string) => {
        try {
            await PDFService.deletePDF(id)
            
            // Remover da lista local
            setPdfs(prev => prev.filter(pdf => pdf.id !== id))
            setFilteredPdfs(prev => prev.filter(pdf => pdf.id !== id))
            
            // Atualizar contadores
            setUiState(prev => ({
                ...prev,
                totalItems: prev.totalItems - 1,
                selectedForMerge: new Set([...prev.selectedForMerge].filter(selectedId => selectedId !== id))
            }))
        } catch (error) {
            console.error('Erro ao deletar PDF:', error)
            throw error
        }
    }, [])

    // 🎯 ATUALIZAR DADOS
    const refreshData = useCallback(() => {
        loadPDFs()
    }, [loadPDFs])

    // Effect inicial para carregar dados
    useEffect(() => {
        loadPDFs()
    }, []) // Removido loadPDFs das dependências para evitar loop

    return {
        // Estados
        pdfs,
        filteredPdfs,
        uiState,
        previewState,
        filters,
        
        // Ações de carregamento
        loadPDFs,
        searchPDFs,
        refreshData,
        
        // Ações de visualização
        viewPDF,
        closePreview,
        changeViewMode,
        
        // Ações de paginação
        goToPage,
        nextPage,
        prevPage,
        
        // Ações de seleção
        toggleSelectionMode,
        togglePDFSelection,
        clearSelection,
        
        // Ações de filtros
        applyFilters,
        clearFilters,
        
        // Ações de CRUD
        uploadPDF,
        deletePDF,
        
        // Estados computados
        selectedPDFs: pdfs.filter(pdf => uiState.selectedForMerge.has(pdf.id)),
        hasNextPage: uiState.currentPage < uiState.totalPages,
        hasPrevPage: uiState.currentPage > 1,
        isLastPage: uiState.currentPage === uiState.totalPages,
        isFirstPage: uiState.currentPage === 1
    }
}
