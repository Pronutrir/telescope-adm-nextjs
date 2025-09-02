'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
    UnifiedPDFItem, 
    PDFItem, 
    ViewMode, 
    SearchParams, 
    UnificationRequest,
    PDFPreviewState
} from '@/types/pdf'
import { UnifiedPDFService, PDFService, mapPdfInfoToUnifiedPDFItem } from '@/services/pdf/pdfService'

/**
 * Hook personalizado para gerenciamento de PDFs Unificados
 * Centraliza operações de visualização, criação e gerenciamento
 */
export const useUnifiedPDFs = () => {
    // 🎯 Estados principais
    const [unifiedPdfs, setUnifiedPdfs] = useState<UnifiedPDFItem[]>([])
    const [availablePdfs, setAvailablePdfs] = useState<PDFItem[]>([])
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Estados para criação de novo PDF unificado
    const [unifyModal, setUnifyModal] = useState({
        isOpen: false,
        selectedPdfs: [] as string[],
        form: {
            title: '',
            description: ''
        },
        isProcessing: false
    })

    // Estados para preview
    const [previewState, setPreviewState] = useState<PDFPreviewState>({
        isOpen: false,
        selectedPdf: null,
        pdfBase64: null,
        isLoading: false
    })

    // 🎯 CARREGAR PDFs UNIFICADOS
    const loadUnifiedPDFs = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            const data = await UnifiedPDFService.listUnifiedPDFs()
            setUnifiedPdfs(data)
        } catch (err) {
            console.error('Erro ao carregar PDFs unificados:', err)
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
            
            // Fallback para dados mock durante desenvolvimento
            setUnifiedPdfs([
                {
                    id: '1',
                    title: 'Relatórios Mensais Consolidados',
                    description: 'Todos os relatórios mensais de 2024',
                    fileName: 'relatorios-2024-consolidados.pdf',
                    size: '15.2 MB',
                    uploadDate: '2025-01-15',
                    url: '/unified/relatorios-consolidados.pdf',
                    sourceFiles: ['relatorio-jan.pdf', 'relatorio-fev.pdf', 'relatorio-mar.pdf'],
                    pageCount: 120
                },
                {
                    id: '2',
                    title: 'Documentação Técnica Unificada',
                    description: 'Manual do usuário + guia de instalação',
                    fileName: 'docs-tecnica-unificada.pdf',
                    size: '8.7 MB',
                    uploadDate: '2025-01-12',
                    url: '/unified/docs-tecnica.pdf',
                    sourceFiles: ['manual-usuario.pdf', 'guia-instalacao.pdf'],
                    pageCount: 85
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }, [])

    // 🎯 CARREGAR PDFs DISPONÍVEIS PARA UNIFICAÇÃO
    const loadAvailablePDFs = useCallback(async () => {
        try {
            const data = await PDFService.listPDFs()
            setAvailablePdfs(data)
        } catch (err) {
            console.error('Erro ao carregar PDFs disponíveis:', err)
            
            // Fallback para dados mock
            setAvailablePdfs([
                {
                    id: 'pdf1',
                    title: 'Relatório Janeiro',
                    fileName: 'relatorio-jan.pdf',
                    size: '2.1 MB',
                    uploadDate: '2025-01-05',
                    description: 'Relatório mensal de janeiro',
                    url: '/pdfs/relatorio-jan.pdf'
                },
                {
                    id: 'pdf2',
                    title: 'Relatório Fevereiro',
                    fileName: 'relatorio-fev.pdf',
                    size: '2.3 MB',
                    uploadDate: '2025-02-05',
                    description: 'Relatório mensal de fevereiro',
                    url: '/pdfs/relatorio-fev.pdf'
                }
            ])
        }
    }, [])

    // 🎯 BUSCAR PDFs UNIFICADOS
    const searchUnifiedPDFs = useCallback(async (query: string) => {
        if (!query.trim()) {
            await loadUnifiedPDFs()
            return
        }

        try {
            setIsLoading(true)
            
            const response = await UnifiedPDFService.searchUnifiedPDFs({
                query,
                page: 1,
                limit: 50
            })
            
            if (response && response.arquivos) {
                setUnifiedPdfs(response.arquivos.map(mapPdfInfoToUnifiedPDFItem))
            }
        } catch (err) {
            console.error('Erro na busca:', err)
            // Fallback para busca local
            const filtered = unifiedPdfs.filter(pdf =>
                pdf.title.toLowerCase().includes(query.toLowerCase()) ||
                pdf.description.toLowerCase().includes(query.toLowerCase())
            )
            setUnifiedPdfs(filtered)
        } finally {
            setIsLoading(false)
        }
    }, [unifiedPdfs, loadUnifiedPDFs])

    // 🎯 VISUALIZAR PDF UNIFICADO
    const viewUnifiedPDF = useCallback(async (pdf: UnifiedPDFItem) => {
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
        } catch (err) {
            console.error('Erro ao carregar PDF:', err)
            setPreviewState(prev => ({ 
                ...prev, 
                isLoading: false,
                error: err instanceof Error ? err.message : 'Erro ao carregar PDF'
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

    // 🎯 MODAL DE UNIFICAÇÃO
    const openUnifyModal = useCallback(() => {
        setUnifyModal(prev => ({ ...prev, isOpen: true }))
    }, [])

    const closeUnifyModal = useCallback(() => {
        setUnifyModal({
            isOpen: false,
            selectedPdfs: [],
            form: { title: '', description: '' },
            isProcessing: false
        })
    }, [])

    // 🎯 SELEÇÃO DE PDFs PARA UNIFICAÇÃO
    const togglePDFSelection = useCallback((pdfId: string) => {
        setUnifyModal(prev => ({
            ...prev,
            selectedPdfs: prev.selectedPdfs.includes(pdfId)
                ? prev.selectedPdfs.filter(id => id !== pdfId)
                : [...prev.selectedPdfs, pdfId]
        }))
    }, [])

    // 🎯 ATUALIZAR FORMULÁRIO
    const updateUnifyForm = useCallback((field: string, value: string) => {
        setUnifyModal(prev => ({
            ...prev,
            form: { ...prev.form, [field]: value }
        }))
    }, [])

    // 🎯 UNIFICAR PDFs SELECIONADOS
    const unifySelectedPDFs = useCallback(async (): Promise<UnifiedPDFItem> => {
        const { selectedPdfs, form } = unifyModal

        if (selectedPdfs.length < 2) {
            throw new Error('Selecione pelo menos 2 PDFs para unificar')
        }

        if (!form.title.trim()) {
            throw new Error('Digite um título para o PDF unificado')
        }

        try {
            setUnifyModal(prev => ({ ...prev, isProcessing: true }))
            
            // Converter IDs dos PDFs selecionados para nomes de arquivo
            const selectedPDFData = availablePdfs.filter(pdf => selectedPdfs.includes(pdf.id))
            const fileNames = selectedPDFData.map(pdf => pdf.fileName)
            
            console.log('📄 PDFs selecionados para unificação:', selectedPDFData.map(pdf => ({ id: pdf.id, fileName: pdf.fileName })))
            
            const request: UnificationRequest = {
                title: form.title,
                description: form.description,
                sourceFileIds: fileNames, // Usar nomes de arquivo em vez de IDs
                mergeOrder: fileNames // Ordem atual de seleção com nomes de arquivo
            }

            const result = await UnifiedPDFService.unifyPDFs(request)
            
            // Recarregar lista e fechar modal
            await loadUnifiedPDFs()
            closeUnifyModal()
            
            if (!result.success || !result.data) {
                throw new Error(result.error || result.message || 'Failed to unify PDFs')
            }
            
            return result.data
        } catch (err) {
            console.error('Erro ao unificar PDFs:', err)
            throw err
        } finally {
            setUnifyModal(prev => ({ ...prev, isProcessing: false }))
        }
    }, [unifyModal, availablePdfs, loadUnifiedPDFs, closeUnifyModal])

    // 🎯 DELETAR PDF UNIFICADO
    const deleteUnifiedPDF = useCallback(async (id: string) => {
        try {
            // Assumindo que existe um método de delete
            // await UnifiedPDFService.deleteUnifiedPDF(id)
            
            // Por enquanto, apenas remover da lista local
            setUnifiedPdfs(prev => prev.filter(pdf => pdf.id !== id))
        } catch (err) {
            console.error('Erro ao deletar PDF unificado:', err)
            throw err
        }
    }, [])

    // 🎯 ALTERAR MODO DE VISUALIZAÇÃO
    const changeViewMode = useCallback((mode: ViewMode) => {
        setViewMode(mode)
    }, [])

    // 🎯 ATUALIZAR TERMO DE BUSCA
    const updateSearchTerm = useCallback((term: string) => {
        setSearchTerm(term)
    }, [])

    // 🎯 EXECUTAR BUSCA COM DEBOUNCE
    const performSearch = useCallback(async () => {
        await searchUnifiedPDFs(searchTerm)
    }, [searchTerm, searchUnifiedPDFs])

    // 🎯 RECARREGAR DADOS
    const refreshData = useCallback(async () => {
        await Promise.all([
            loadUnifiedPDFs(),
            loadAvailablePDFs()
        ])
    }, [loadUnifiedPDFs, loadAvailablePDFs])

    // 🎯 Effects iniciais
    useEffect(() => {
        loadUnifiedPDFs()
        loadAvailablePDFs()
    }, []) // Removidas as dependências para evitar loops

    // Effect para busca com debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                performSearch()
            } else {
                loadUnifiedPDFs()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm]) // Apenas searchTerm como dependência

    return {
        // Estados
        unifiedPdfs,
        availablePdfs,
        viewMode,
        searchTerm,
        isLoading,
        error,
        unifyModal,
        previewState,
        
        // Ações de carregamento
        loadUnifiedPDFs,
        loadAvailablePDFs,
        refreshData,
        
        // Ações de busca
        updateSearchTerm,
        performSearch,
        searchUnifiedPDFs,
        
        // Ações de visualização
        viewUnifiedPDF,
        closePreview,
        changeViewMode,
        
        // Ações de unificação
        openUnifyModal,
        closeUnifyModal,
        togglePDFSelection,
        updateUnifyForm,
        unifySelectedPDFs,
        
        // Ações de gerenciamento
        deleteUnifiedPDF,
        
        // Estados computados
        hasUnifiedPdfs: unifiedPdfs.length > 0,
        hasAvailablePdfs: availablePdfs.length > 0,
        canUnify: unifyModal.selectedPdfs.length >= 2 && unifyModal.form.title.trim() !== '',
        selectedPDFsData: availablePdfs.filter(pdf => unifyModal.selectedPdfs.includes(pdf.id))
    }
}
