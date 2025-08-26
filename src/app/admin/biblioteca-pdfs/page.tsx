'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    Upload,
    FileText,
    Search,
    Grid,
    List,
    ChevronLeft,
    ChevronRight,
    X,
    Layers,
    Edit3,
    Check
} from 'lucide-react'
import InlinePDFViewer from '@/components/pdf/InlinePDFViewer'
import { SortablePDFList } from '@/components/pdf/SortablePDFList'
import { twMerge } from 'tailwind-merge'
import { PDFItem, PDFUIState, SearchParams, PDFEditState } from '@/types/pdf'
import PDFService from '@/services/pdf/pdfService'
import { useUnifiedPDFs } from '@/hooks/useUnifiedPDFs'

const BibliotecaPDFsPage = () => {
    // 🎯 STEP 1: ANÁLISE - Contextos obrigatórios conforme AGENT-CONTEXT
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    // 🎯 STEP 2: Hook para unificação de PDFs
    const {
        availablePdfs,
        loadAvailablePDFs,
        unifyModal,
        openUnifyModal,
        closeUnifyModal,
        togglePDFSelection: unifyTogglePDFSelection,
        updateUnifyForm,
        unifySelectedPDFs,
        canUnify
    } = useUnifiedPDFs()

    // 🎯 STEP 3: PRESERVAÇÃO - Estados migrados do app_pdfs
    const [ mounted, setMounted ] = useState(false)
    const [ pdfs, setPdfs ] = useState<PDFItem[]>([])
    const [ selectionOrder, setSelectionOrder ] = useState<string[]>([]) // Nova state para ordem de seleção
    const [ uiState, setUiState ] = useState<PDFUIState>({
        isLoading: true,
        isSearching: false,
        isSelectionMode: false,
        selectedForMerge: new Set<string>(),
        viewMode: 'grid',
        searchTerm: '',
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12
    })

    // Estado para preview migrado do app_pdfs
    const [ previewState, setPreviewState ] = useState({
        isOpen: false,
        selectedPdf: null as PDFItem | null,
        pdfBase64: null as string | null,
        isLoading: false
    })

    // Estado para edição de PDF com páginas
    const [ editState, setEditState ] = useState<PDFEditState>({
        isOpen: false,
        selectedPdf: null,
        isLoading: false,
        isLoadingPages: false,
        form: {
            title: '',
            description: '',
            fileName: ''
        },
        pages: []
    })

    // Carregar PDFs iniciais - migrado do app_pdfs
    const loadPDFs = useCallback(async () => {
        try {
            setUiState(prev => ({ ...prev, isLoading: true }))
            const data = await PDFService.listPDFs()
            setPdfs(data)
            setUiState(prev => ({
                ...prev,
                isLoading: false,
                totalItems: data.length,
                totalPages: Math.ceil(data.length / prev.itemsPerPage)
            }))
        } catch (error) {
            console.error('Erro ao carregar PDFs:', error)
            setUiState(prev => ({ ...prev, isLoading: false }))
            // Fallback para dados mock durante desenvolvimento
            setPdfs([
                {
                    id: '1',
                    title: 'Relatório Mensal.pdf',
                    size: '2.5 MB',
                    uploadDate: '2025-01-10',
                    description: 'Relatório mensal de atividades',
                    fileName: 'relatorio-mensal.pdf',
                    url: '/docs/relatorio-mensal.pdf'
                },
                {
                    id: '2',
                    title: 'Manual do Usuário.pdf',
                    size: '5.1 MB',
                    uploadDate: '2025-01-08',
                    description: 'Manual completo do sistema',
                    fileName: 'manual-usuario.pdf',
                    url: '/docs/manual-usuario.pdf'
                }
            ])
        }
    }, [])

    // Buscar PDFs com paginação - migrado do app_pdfs
    const searchPDFs = useCallback(async (query: string, page: number = 1) => {
        if (!query.trim()) {
            // Recarregar PDFs sem dependência do loadPDFs
            try {
                setUiState(prev => ({ ...prev, isLoading: true }))
                const data = await PDFService.listPDFs()
                setPdfs(data)
                setUiState(prev => ({
                    ...prev,
                    isLoading: false,
                    totalItems: data.length,
                    totalPages: Math.ceil(data.length / 12) // usar valor fixo em vez de uiState.itemsPerPage
                }))
            } catch (error) {
                console.error('Erro ao carregar PDFs:', error)
                setUiState(prev => ({ ...prev, isLoading: false }))
            }
            return
        }

        try {
            setUiState(prev => ({ ...prev, isSearching: true }))

            const searchParams: SearchParams = {
                query,
                page,
                limit: 12 // usar valor fixo em vez de uiState.itemsPerPage
            }

            const response = await PDFService.searchPDFs(searchParams)
            setPdfs(response.data)
            setUiState(prev => ({
                ...prev,
                isSearching: false,
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
                totalItems: response.pagination.totalItems
            }))
        } catch (error) {
            console.error('Erro na busca:', error)
            setUiState(prev => ({ ...prev, isSearching: false }))
            // Fallback para busca local durante desenvolvimento
            // Usar callback para acessar o valor atual de pdfs
            setPdfs(currentPdfs => {
                const filteredPdfs = currentPdfs.filter(pdf =>
                    pdf.title.toLowerCase().includes(query.toLowerCase()) ||
                    pdf.description.toLowerCase().includes(query.toLowerCase())
                )
                return filteredPdfs
            })
        }
    }, []) // Removidas dependências problemáticas: uiState.itemsPerPage, loadPDFs, pdfs

    // Visualizar PDF - migrado do app_pdfs
    const handleViewPDF = async (pdf: PDFItem) => {
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
            setPreviewState(prev => ({ ...prev, isLoading: false }))
        }
    }

    // Fechar preview
    const closePreview = () => {
        setPreviewState({
            isOpen: false,
            selectedPdf: null,
            pdfBase64: null,
            isLoading: false
        })
    }

    // Abrir modal de edição
    const handleEditPDF = async (pdf: PDFItem) => {
        setEditState({
            isOpen: true,
            selectedPdf: pdf,
            isLoading: false,
            isLoadingPages: true,
            form: {
                title: '', // Não usado mais
                description: '', // Não usado mais
                fileName: pdf.fileName
            },
            pages: []
        })

        // Carregar páginas do PDF
        try {
            const pages = await PDFService.getPDFPages(pdf.fileName)
            setEditState(prev => ({
                ...prev,
                pages,
                isLoadingPages: false
            }))
        } catch (error) {
            console.error('Erro ao carregar páginas do PDF:', error)
            setEditState(prev => ({
                ...prev,
                isLoadingPages: false
            }))
        }
    }

    // Fechar modal de edição
    const closeEditModal = () => {
        setEditState({
            isOpen: false,
            selectedPdf: null,
            isLoading: false,
            isLoadingPages: false,
            form: {
                title: '',
                description: '',
                fileName: ''
            },
            pages: []
        })
    }

    // Toggle seleção de página
    const togglePageSelection = (pageNumber: number) => {
        setEditState(prev => ({
            ...prev,
            pages: prev.pages.map(page =>
                page.pageNumber === pageNumber
                    ? { ...page, selected: !page.selected }
                    : page
            )
        }))
    }

    // Selecionar/desselecionar todas as páginas
    const toggleAllPages = () => {
        const allSelected = editState.pages.every(page => page.selected)
        setEditState(prev => ({
            ...prev,
            pages: prev.pages.map(page => ({
                ...page,
                selected: !allSelected
            }))
        }))
    }

    // Salvar edição do PDF
    const handleSaveEdit = async () => {
        if (!editState.selectedPdf) return

        const selectedPages = editState.pages.filter(page => page.selected)

        if (selectedPages.length === 0) {
            alert('Selecione pelo menos uma página para manter no PDF')
            return
        }

        try {
            setEditState(prev => ({ ...prev, isLoading: true }))

            const editData = {
                id: editState.selectedPdf.id,
                title: editState.selectedPdf.title, // Manter título original
                description: editState.selectedPdf.description || '', // Manter descrição original
                fileName: editState.form.fileName,
                pagesToKeep: selectedPages.map(page => page.pageNumber)
            }

            const response = await PDFService.editPDF(editData)

            if (response.success) {
                alert(response.message || `PDF editado com sucesso! ${selectedPages.length} páginas mantidas.`)
                closeEditModal()

                // Recarregar a lista completa para garantir dados atualizados
                console.log('🔄 Recarregando lista de PDFs após edição...')
                await loadPDFs()

            } else {
                // Se houve erro na API mas ainda retornou response
                alert(response.message || 'Erro ao editar PDF')
            }
        } catch (error) {
            console.error('Erro ao editar PDF:', error)
            alert(error instanceof Error ? error.message : 'Erro ao editar PDF')

            // Mesmo em caso de erro, recarregar a lista para garantir consistência
            try {
                console.log('🔄 Recarregando lista de PDFs após erro...')
                await loadPDFs()
            } catch (reloadError) {
                console.error('Erro ao recarregar lista após falha:', reloadError)
            }
        } finally {
            setEditState(prev => ({ ...prev, isLoading: false }))
        }
    }

    // Toggle modo de seleção - migrado do app_pdfs
    const toggleSelectionMode = () => {
        setUiState(prev => ({
            ...prev,
            isSelectionMode: !prev.isSelectionMode,
            selectedForMerge: new Set()
        }))
        setSelectionOrder([]) // Limpar ordem de seleção
    }

    // Toggle seleção de PDF para merge - migrado do app_pdfs
    const togglePDFSelection = (pdfId: string) => {
        setUiState(prev => {
            const newSelected = new Set(prev.selectedForMerge)
            let newOrder = [ ...selectionOrder ]

            if (newSelected.has(pdfId)) {
                // Removendo da seleção
                newSelected.delete(pdfId)
                newOrder = newOrder.filter(id => id !== pdfId)
            } else {
                // Adicionando à seleção
                newSelected.add(pdfId)
                newOrder.push(pdfId)
            }

            setSelectionOrder(newOrder)
            return { ...prev, selectedForMerge: newSelected }
        })
    }

    // Iniciar processo de unificação
    const handleStartUnification = async () => {
        if (uiState.selectedForMerge.size < 2) {
            alert('Selecione pelo menos 2 PDFs para unificar')
            return
        }

        try {
            // Obter dados dos PDFs selecionados na ordem correta
            const selectedPDFData = selectionOrder.map(pdfId => pdfs.find(pdf => pdf.id === pdfId)!).filter(Boolean)

            console.log('📄 Iniciando unificação de PDFs:', selectedPDFData.map(pdf => ({ id: pdf.id, fileName: pdf.fileName })))

            // Preparar dados para o hook
            // Primeiro, vamos simular o carregamento dos PDFs no hook (se necessário)
            await loadAvailablePDFs()

            // Selecionar os PDFs no hook usando os IDs na ordem correta
            selectionOrder.forEach(pdfId => {
                unifyTogglePDFSelection(pdfId)
            })

            // Abrir modal de unificação
            openUnifyModal()

        } catch (error) {
            console.error('Erro ao iniciar unificação:', error)
            alert('Erro ao iniciar processo de unificação')
        }
    }

    // Formatar data - migrado do app_pdfs
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    // Função para reorganizar PDFs
    const handlePDFSort = (sortedPDFs: PDFItem[]) => {
        setPdfs(sortedPDFs)
        // Aqui você pode implementar a lógica para salvar a nova ordem no backend
        console.log('Nova ordem dos PDFs:', sortedPDFs.map(pdf => ({ id: pdf.id, title: pdf.title })))
    }

    // Navegação para páginas
    const handleUpload = () => {
        window.location.href = '/admin/biblioteca-pdfs/upload'
    }

    const handleUnifiedPDFs = () => {
        window.location.href = '/admin/biblioteca-pdfs/unificados'
    }

    // 🎯 EXECUTAR UNIFICAÇÃO
    const handleExecuteUnification = async () => {
        if (!canUnify) {
            alert('Preencha o título e selecione pelo menos 2 PDFs')
            return
        }

        try {
            const result = await unifySelectedPDFs()
            alert(`PDF unificado criado com sucesso: ${result.title}`)

            // Limpar seleção atual
            setUiState(prev => ({ ...prev, selectedForMerge: new Set(), isSelectionMode: false }))
            setSelectionOrder([])

        } catch (error) {
            console.error('Erro ao unificar PDFs:', error)
            alert(error instanceof Error ? error.message : 'Erro ao unificar PDFs')
        }
    }

    // Prevenir hidratação inconsistente
    useEffect(() => {
        setMounted(true)
        loadPDFs()
    }, []) // Removido loadPDFs da dependência para evitar loop

    // Effect para busca com debounce - migrado do app_pdfs
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (uiState.searchTerm.trim()) {
                searchPDFs(uiState.searchTerm.trim(), 1)
            } else if (uiState.searchTerm === '') {
                // Se campo está vazio mas foi limpo, recarregar todos os PDFs
                searchPDFs('', 1)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [ uiState.searchTerm ]) // Removido searchPDFs da dependência para evitar loop

    if (!mounted) {
        return (
            <PageWrapper maxWidth="full" spacing="xl">
                <div className="w-full space-y-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper maxWidth="full" spacing="xl">
            <div className="w-full space-y-8">
                {/* 🎯 PRESERVAÇÃO: Header baseado no layout original */}
                <div className="text-center space-y-4">
                    <h1 className={twMerge(
                        'text-4xl font-bold',
                        isDark ? 'text-white' : 'text-slate-800'
                    )}>
                        Biblioteca de PDFs
                    </h1>

                    <p className={twMerge(
                        'text-lg',
                        isDark ? 'text-gray-300' : 'text-muted-foreground'
                    )}>
                        {uiState.isLoading ? 'Carregando...' : `${pdfs.length} documentos disponíveis`}
                    </p>

                    {/* 🎯 PRESERVAÇÃO: Botões de ação principais */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={handleUpload}
                            className={twMerge(
                                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                                isDark
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            )}
                        >
                            <Upload className="w-5 h-5 pdf-icon" />
                            📤 Upload
                        </Button>

                        <Button
                            onClick={handleUnifiedPDFs}
                            variant="outline"
                            className={twMerge(
                                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                                isDark
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            )}
                        >
                            <Layers className="w-5 h-5 pdf-icon" />
                            📚 PDFs Unificados
                        </Button>

                        {/* Botão de seleção múltipla */}
                        <Button
                            onClick={toggleSelectionMode}
                            variant="outline"
                            className={twMerge(
                                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                                uiState.isSelectionMode
                                    ? isDark
                                        ? 'bg-green-900/20 border-green-600 text-green-300'
                                        : 'bg-green-50 border-green-300 text-green-700'
                                    : isDark
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            )}
                        >
                            {uiState.isSelectionMode ? 'Cancelar Seleção' : 'Selecionar PDFs'}
                        </Button>
                    </div>
                </div>

                {/* 🎯 PRESERVAÇÃO: Barra de ferramentas */}
                <div className={twMerge(
                    'p-6 rounded-lg border',
                    isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
                )}>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        {/* Busca */}
                        <div className="relative flex-1 max-w-md">
                            <Search className={twMerge(
                                'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pdf-icon',
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            )} />
                            <input
                                type="text"
                                placeholder="Buscar documentos..."
                                value={uiState.searchTerm}
                                onChange={(e) => setUiState(prev => ({ ...prev, searchTerm: e.target.value }))}
                                className={twMerge(
                                    'w-full pl-10 pr-10 py-2 rounded-lg border transition-all duration-200',
                                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                )}
                            />
                            {uiState.searchTerm && (
                                <button
                                    onClick={() => {
                                        setUiState(prev => ({ ...prev, searchTerm: '' }))
                                        // Usar searchPDFs com string vazia para recarregar
                                        searchPDFs('', 1)
                                    }}
                                    className={twMerge(
                                        'absolute right-3 top-1/2 transform -translate-y-1/2',
                                        isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <X className="w-4 h-4 pdf-icon" />
                                </button>
                            )}
                        </div>

                        {/* Controles de visualização */}
                        <div className="flex items-center gap-2">
                            <div className={twMerge(
                                'flex items-center rounded-lg',
                                isDark ? 'border-gray-600' : 'border-gray-300'
                            )}>
                                <button
                                    onClick={() => setUiState(prev => ({ ...prev, viewMode: 'grid' }))}
                                    className={twMerge(
                                        'p-2 rounded-l-lg transition-all duration-200 mr-1',
                                        uiState.viewMode === 'grid'
                                            ? isDark
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-500 text-white'
                                            : isDark
                                                ? 'text-gray-400 hover:text-gray-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <Grid className="w-4 h-4 pdf-icon" />
                                </button>
                                <button
                                    onClick={() => setUiState(prev => ({ ...prev, viewMode: 'list' }))}
                                    className={twMerge(
                                        'p-2 rounded-r-lg transition-all duration-200 ml-1',
                                        uiState.viewMode === 'list'
                                            ? isDark
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-500 text-white'
                                            : isDark
                                                ? 'text-gray-400 hover:text-gray-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <List className="w-4 h-4 pdf-icon" />
                                </button>
                            </div>

                            {uiState.selectedForMerge.size > 0 && (
                                <span className={twMerge(
                                    'px-3 py-1 rounded-full text-sm font-medium',
                                    isDark
                                        ? 'bg-blue-900 text-blue-200'
                                        : 'bg-blue-100 text-blue-800'
                                )}>
                                    {uiState.selectedForMerge.size} selecionados
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🎯 PRESERVAÇÃO: Ações em lote */}
                {uiState.selectedForMerge.size > 0 && (
                    <div className={twMerge(
                        'p-6 rounded-lg border',
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    )}>
                        <div className="space-y-4">
                            {/* Cabeçalho */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={twMerge(
                                        'text-lg font-semibold',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        Documentos Selecionados para Unificação
                                    </h3>
                                    <p className={twMerge(
                                        'text-sm mt-1',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {uiState.selectedForMerge.size} documento{uiState.selectedForMerge.size > 1 ? 's' : ''} selecionado{uiState.selectedForMerge.size > 1 ? 's' : ''} • Ordem de unificação:
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="inline-flex items-center gap-2"
                                        onClick={handleStartUnification}
                                        disabled={uiState.selectedForMerge.size < 2}
                                    >
                                        <FileText className="w-4 h-4 pdf-icon" />
                                        Unificar PDFs
                                    </Button>
                                </div>
                            </div>

                            {/* Lista de documentos na ordem de unificação */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {selectionOrder.map((pdfId, index) => {
                                    const pdf = pdfs.find(p => p.id === pdfId)
                                    if (!pdf) return null

                                    return (
                                        <div
                                            key={pdfId}
                                            className={twMerge(
                                                'flex items-center gap-3 p-3 rounded-lg border',
                                                isDark
                                                    ? 'bg-gray-700/50 border-gray-600'
                                                    : 'bg-gray-50 border-gray-200'
                                            )}
                                        >
                                            <div className={twMerge(
                                                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                                                isDark
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 text-white'
                                            )}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={twMerge(
                                                    'font-medium text-sm truncate',
                                                    isDark ? 'text-white' : 'text-gray-900'
                                                )}>
                                                    {pdf.title}
                                                </h4>
                                                <p className={twMerge(
                                                    'text-xs truncate',
                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                )}>
                                                    {pdf.size} • {formatDate(pdf.uploadDate)}
                                                </p>
                                            </div>
                                            <div className={twMerge(
                                                'text-xs font-medium px-2 py-1 rounded',
                                                isDark
                                                    ? 'bg-blue-900/30 text-blue-300'
                                                    : 'bg-blue-100 text-blue-700'
                                            )}>
                                                {index === 0 ? '1º' : index === 1 ? '2º' : index === 2 ? '3º' : `${index + 1}º`}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Informação adicional */}
                            <div className={twMerge(
                                'text-xs p-3 rounded-lg',
                                isDark
                                    ? 'bg-blue-900/20 border border-blue-800/50 text-blue-300'
                                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                            )}>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 pdf-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span>Os PDFs serão unificados na ordem mostrada acima. A ordem é definida pela sequência de seleção.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estados de loading */}
                {(uiState.isLoading || uiState.isSearching) && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className={twMerge(
                            'mt-2 text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            {uiState.isSearching ? 'Buscando...' : 'Carregando...'}
                        </p>
                    </div>
                )}

                {/* 🎯 PRESERVAÇÃO: Lista/Grid de documentos */}
                {!uiState.isLoading && !uiState.isSearching && pdfs.length === 0 && (
                    <div className={twMerge(
                        'text-center py-12 rounded-lg border-2 border-dashed',
                        isDark
                            ? 'border-gray-600 bg-gray-800/30'
                            : 'border-gray-300 bg-gray-50/50'
                    )}>
                        <FileText className={twMerge(
                            'w-16 h-16 mx-auto mb-4',
                            isDark ? 'text-gray-500' : 'text-gray-400'
                        )} />
                        <h3 className={twMerge(
                            'text-lg font-medium mb-2',
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        )}>
                            Nenhum documento encontrado
                        </h3>
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            {uiState.searchTerm ? 'Tente alterar os termos de busca' : 'Faça upload do seu primeiro documento'}
                        </p>
                    </div>
                )}

                {/* Lista de PDFs */}
                {!uiState.isLoading && !uiState.isSearching && pdfs.length > 0 && (
                    <SortablePDFList
                        items={pdfs}
                        onSortEnd={handlePDFSort}
                        onViewPDF={handleViewPDF}
                        onEditPDF={handleEditPDF}
                        onSelectPDF={togglePDFSelection}
                        isDark={isDark}
                        viewMode={uiState.viewMode}
                        isSelectionMode={uiState.isSelectionMode}
                        selectedItems={uiState.selectedForMerge}
                        selectionOrder={selectionOrder}
                        formatDate={formatDate}
                        animation={200}
                        disabled={false}
                        gridCols={3}
                        className="transition-all duration-300"
                    />
                )}

                {/* Paginação */}
                {uiState.searchTerm && uiState.totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className={twMerge(
                            'text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            Mostrando {((uiState.currentPage - 1) * uiState.itemsPerPage) + 1} a {Math.min(uiState.currentPage * uiState.itemsPerPage, uiState.totalItems)} de {uiState.totalItems} resultados
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => searchPDFs(uiState.searchTerm, uiState.currentPage - 1)}
                                disabled={uiState.currentPage <= 1}
                                className={twMerge(
                                    'p-2 rounded-md border transition-colors',
                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                    isDark
                                        ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                )}
                            >
                                <ChevronLeft className="w-4 h-4 pdf-icon" />
                            </button>

                            <span className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                Página {uiState.currentPage} de {uiState.totalPages}
                            </span>

                            <button
                                onClick={() => searchPDFs(uiState.searchTerm, uiState.currentPage + 1)}
                                disabled={uiState.currentPage >= uiState.totalPages}
                                className={twMerge(
                                    'p-2 rounded-md border transition-colors',
                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                    isDark
                                        ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                )}
                            >
                                <ChevronRight className="w-4 h-4 pdf-icon" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Unificação - Usando componente Modal unificado */}
            <Modal
                isOpen={unifyModal.isOpen}
                onClose={closeUnifyModal}
                title="Unificar PDFs Selecionados"
                size="xl"
            >
                <div className="space-y-4">
                    {/* Formulário */}
                    <div className="space-y-4">
                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Título do PDF Unificado *
                            </label>
                            <input
                                type="text"
                                value={unifyModal.form.title}
                                onChange={(e) => updateUnifyForm('title', e.target.value)}
                                placeholder="Digite um título para o PDF unificado"
                                className={twMerge(
                                    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                )}
                            />
                        </div>

                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Descrição (opcional)
                            </label>
                            <textarea
                                value={unifyModal.form.description}
                                onChange={(e) => updateUnifyForm('description', e.target.value)}
                                placeholder="Descreva o conteúdo do PDF unificado"
                                rows={3}
                                className={twMerge(
                                    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                )}
                            />
                        </div>
                    </div>

                    {/* Resumo da seleção */}
                    <div className={twMerge(
                        'p-4 rounded-lg border',
                        isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                    )}>
                        <h4 className={twMerge(
                            'font-medium mb-2',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            PDFs que serão unificados ({unifyModal.selectedPdfs.length}):
                        </h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {selectionOrder.map((pdfId, index) => {
                                const pdf = pdfs.find(p => p.id === pdfId)
                                if (!pdf) return null
                                return (
                                    <div key={pdfId} className={twMerge(
                                        'text-sm flex items-center gap-2',
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    )}>
                                        <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900 px-1 rounded">
                                            {index + 1}º
                                        </span>
                                        <span className="truncate">{pdf.title}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer customizado */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={closeUnifyModal}
                        disabled={unifyModal.isProcessing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleExecuteUnification}
                        disabled={!canUnify || unifyModal.isProcessing}
                        className="inline-flex items-center gap-2"
                    >
                        {unifyModal.isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processando...
                            </>
                        ) : (
                            <>
                                <Layers className="w-4 h-4 pdf-icon" />
                                Unificar PDFs
                            </>
                        )}
                    </Button>
                </div>
            </Modal>

            {/* Modal de Preview - Também migrado para componente Modal unificado */}
            <Modal
                isOpen={previewState.isOpen}
                onClose={closePreview}
                title=""
                size="full"
                showCloseButton={false}
                className="p-0 h-full"
            >
                {previewState.isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className={twMerge(
                                'mt-4 text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            )}>
                                Carregando PDF...
                            </p>
                        </div>
                    </div>
                ) : previewState.pdfBase64 ? (
                    <div className="w-full h-full">
                        <InlinePDFViewer
                            pdfBase64={previewState.pdfBase64}
                            fileName={previewState.selectedPdf?.fileName || 'documento.pdf'}
                            height="100%"
                            className="w-full h-full"
                            onClose={closePreview}
                            onEdit={() => {
                                // Fechar modal de preview e abrir modal de edição
                                if (previewState.selectedPdf) {
                                    closePreview()
                                    handleEditPDF(previewState.selectedPdf)
                                }
                            }}
                            onSave={(signedPdfBase64) => {
                                // Aqui você pode implementar a lógica para salvar o PDF assinado
                                console.log('PDF assinado recebido, salvando...')

                                // Exemplo: Atualizar o estado para mostrar o PDF assinado
                                setPreviewState(prev => ({
                                    ...prev,
                                    pdfBase64: signedPdfBase64
                                }))

                                // Aqui você chamaria o serviço para salvar o PDF assinado
                                // PDFService.savePDF(previewState.selectedPdf?.id, signedPdfBase64)

                                alert('PDF assinado com sucesso!')
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            )}>
                                Erro ao carregar PDF
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal de Edição */}
            <Modal
                isOpen={editState.isOpen}
                onClose={closeEditModal}
                title="Editar PDF"
                size="xl"
            >
                <div className="space-y-6">
                    {/* Formulário de Edição - Apenas Nome do Arquivo */}
                    <div className="space-y-4">
                        <div>
                            <label className={twMerge(
                                'block text-sm font-medium mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Nome do Arquivo *
                            </label>
                            <input
                                type="text"
                                value={editState.form.fileName}
                                onChange={(e) => setEditState(prev => ({
                                    ...prev,
                                    form: { ...prev.form, fileName: e.target.value }
                                }))}
                                placeholder="nome-do-arquivo.pdf"
                                className={twMerge(
                                    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                )}
                            />
                            <p className={twMerge(
                                'text-xs mt-1',
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            )}>
                                Altere apenas o nome do arquivo, mantendo a extensão .pdf
                            </p>
                        </div>
                    </div>

                    {/* Visualização e Seleção de Páginas para Exclusão */}
                    <div className={twMerge(
                        'border rounded-lg p-4',
                        isDark ? 'border-gray-600' : 'border-gray-200'
                    )}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className={twMerge(
                                    'font-medium',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    Páginas do Documento
                                </h4>
                                <p className={twMerge(
                                    'text-sm mt-1',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    Desmarque as páginas que deseja excluir do documento
                                </p>
                            </div>

                            {editState.pages.length > 0 && (
                                <div className="flex items-center gap-4">
                                    <span className={twMerge(
                                        'text-sm',
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    )}>
                                        {editState.pages.filter(p => p.selected).length} de {editState.pages.length} páginas mantidas
                                    </span>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={toggleAllPages}
                                    >
                                        {editState.pages.every(page => page.selected) ? 'Desmarcar Todas' : 'Marcar Todas'}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {editState.isLoadingPages ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className={twMerge(
                                        'mt-2 text-sm',
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    )}>
                                        Carregando páginas do PDF...
                                    </p>
                                </div>
                            </div>
                        ) : editState.pages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
                                {editState.pages.map((page) => (
                                    <div
                                        key={page.pageNumber}
                                        onClick={() => togglePageSelection(page.pageNumber)}
                                        className={twMerge(
                                            'relative cursor-pointer rounded-lg border-2 p-2 transition-all duration-200 hover:shadow-md',
                                            page.selected
                                                ? isDark
                                                    ? 'border-green-500 bg-green-900/20'
                                                    : 'border-green-500 bg-green-50'
                                                : isDark
                                                    ? 'border-red-500 bg-red-900/20'
                                                    : 'border-red-300 bg-red-50'
                                        )}
                                    >
                                        {/* Status da página */}
                                        <div className="absolute top-1 right-1 z-10">
                                            <div className={twMerge(
                                                'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                                                page.selected
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'bg-red-500 border-red-500 text-white'
                                            )}>
                                                {page.selected ? '✓' : '✗'}
                                            </div>
                                        </div>

                                        {/* Miniatura da página */}
                                        <div className="aspect-[3/4] mb-2 rounded overflow-hidden bg-white border">
                                            {page.thumbnail ? (
                                                <img
                                                    src={page.thumbnail}
                                                    alt={`Página ${page.pageNumber}`}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        // Fallback para um placeholder em caso de erro na imagem
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const parent = target.parentElement;
                                                        if (parent) {
                                                            parent.innerHTML = `
                                                                <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                                    <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                                    </svg>
                                                                    <span class="text-xs text-gray-400 dark:text-gray-500">PDF</span>
                                                                </div>
                                                            `;
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                    <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1" />
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">PDF</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Informações da página */}
                                        <div className="text-center space-y-1">
                                            <div className={twMerge(
                                                'text-sm font-medium',
                                                isDark ? 'text-gray-300' : 'text-gray-700'
                                            )}>
                                                Página {page.pageNumber}
                                            </div>
                                            <div className={twMerge(
                                                'text-xs px-2 py-1 rounded-full font-medium',
                                                page.selected
                                                    ? isDark
                                                        ? 'bg-green-900/50 text-green-300'
                                                        : 'bg-green-100 text-green-700'
                                                    : isDark
                                                        ? 'bg-red-900/50 text-red-300'
                                                        : 'bg-red-100 text-red-700'
                                            )}>
                                                {page.selected ? 'Manter' : 'Excluir'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className={twMerge(
                                    'text-sm',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                    Não foi possível carregar as páginas do PDF
                                </p>
                            </div>
                        )}

                        {/* Informação adicional */}
                        {editState.pages.length > 0 && (
                            <div className={twMerge(
                                'mt-4 text-xs p-3 rounded-lg',
                                isDark
                                    ? 'bg-blue-900/20 border border-blue-800/50 text-blue-300'
                                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                            )}>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 pdf-icon" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span>
                                        Clique nas páginas para alternar entre &quot;Manter&quot; e &quot;Excluir&quot;.
                                        Páginas marcadas como &quot;Excluir&quot; serão removidas permanentemente do documento.
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Resumo das alterações */}
                        {editState.pages.length > 0 && (
                            <div className={twMerge(
                                'mt-4 p-4 rounded-lg border',
                                isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                            )}>
                                <h5 className={twMerge(
                                    'font-medium mb-2',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    Resumo das Alterações
                                </h5>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="text-center">
                                        <div className={twMerge(
                                            'text-lg font-bold',
                                            isDark ? 'text-gray-300' : 'text-gray-600'
                                        )}>
                                            {editState.pages.length}
                                        </div>
                                        <div className={twMerge(
                                            'text-xs',
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        )}>
                                            Total
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-green-500">
                                            {editState.pages.filter(p => p.selected).length}
                                        </div>
                                        <div className={twMerge(
                                            'text-xs',
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        )}>
                                            Manter
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-red-500">
                                            {editState.pages.filter(p => !p.selected).length}
                                        </div>
                                        <div className={twMerge(
                                            'text-xs',
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        )}>
                                            Excluir
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer com botões de ação */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={closeEditModal}
                            disabled={editState.isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            disabled={
                                !editState.form.fileName.trim() ||
                                editState.pages.filter(p => p.selected).length === 0 ||
                                editState.isLoading
                            }
                            className="inline-flex items-center gap-2"
                        >
                            {editState.isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Edit3 className="w-4 h-4" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageWrapper>
    )
}

export default BibliotecaPDFsPage
