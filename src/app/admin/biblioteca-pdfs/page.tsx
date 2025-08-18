'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    Upload,
    FileText,
    Search,
    Grid,
    List,
    Download,
    Trash2,
    Eye,
    Plus,
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    Layers
} from 'lucide-react'
import InlinePDFViewer from '@/components/pdf/InlinePDFViewer'
import { twMerge } from 'tailwind-merge'
import { PDFItem, PDFUIState, SearchParams } from '@/types/pdf'
import { PDFService } from '@/services/pdf/pdfService'

const BibliotecaPDFsPage = () => {
    // 🎯 STEP 1: ANÁLISE - Contextos obrigatórios conforme AGENT-CONTEXT
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    // 🎯 STEP 2: PRESERVAÇÃO - Estados migrados do app_pdfs
    const [ mounted, setMounted ] = useState(false)
    const [ pdfs, setPdfs ] = useState<PDFItem[]>([])
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
            loadPDFs()
            return
        }

        try {
            setUiState(prev => ({ ...prev, isSearching: true }))

            const searchParams: SearchParams = {
                query,
                page,
                limit: uiState.itemsPerPage
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
            const filteredPdfs = pdfs.filter(pdf =>
                pdf.title.toLowerCase().includes(query.toLowerCase()) ||
                pdf.description.toLowerCase().includes(query.toLowerCase())
            )
            setPdfs(filteredPdfs)
        }
    }, [ uiState.itemsPerPage, loadPDFs, pdfs ])

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

    // Toggle modo de seleção - migrado do app_pdfs
    const toggleSelectionMode = () => {
        setUiState(prev => ({
            ...prev,
            isSelectionMode: !prev.isSelectionMode,
            selectedForMerge: new Set()
        }))
    }

    // Toggle seleção de PDF para merge - migrado do app_pdfs
    const togglePDFSelection = (pdfId: string) => {
        setUiState(prev => {
            const newSelected = new Set(prev.selectedForMerge)
            if (newSelected.has(pdfId)) {
                newSelected.delete(pdfId)
            } else {
                newSelected.add(pdfId)
            }
            return { ...prev, selectedForMerge: newSelected }
        })
    }

    // Formatar data - migrado do app_pdfs
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    // Navegação para páginas
    const handleUpload = () => {
        window.location.href = '/admin/biblioteca-pdfs/upload'
    }

    const handleUnifiedPDFs = () => {
        window.location.href = '/admin/biblioteca-pdfs/unificados'
    }

    // Prevenir hidratação inconsistente
    useEffect(() => {
        setMounted(true)
        loadPDFs()
    }, [ loadPDFs ])

    // Effect para busca com debounce - migrado do app_pdfs
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (uiState.searchTerm) {
                searchPDFs(uiState.searchTerm, 1)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [ uiState.searchTerm, searchPDFs ])

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
                            <Upload className="w-5 h-5" />
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
                            <Layers className="w-5 h-5" />
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
                                'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4',
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
                                        loadPDFs()
                                    }}
                                    className={twMerge(
                                        'absolute right-3 top-1/2 transform -translate-y-1/2',
                                        isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Controles de visualização */}
                        <div className="flex items-center gap-2">
                            <div className={twMerge(
                                'flex items-center rounded-lg border',
                                isDark ? 'border-gray-600' : 'border-gray-300'
                            )}>
                                <button
                                    onClick={() => setUiState(prev => ({ ...prev, viewMode: 'grid' }))}
                                    className={twMerge(
                                        'p-2 rounded-l-lg transition-all duration-200',
                                        uiState.viewMode === 'grid'
                                            ? isDark
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-500 text-white'
                                            : isDark
                                                ? 'text-gray-400 hover:text-gray-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setUiState(prev => ({ ...prev, viewMode: 'list' }))}
                                    className={twMerge(
                                        'p-2 rounded-r-lg transition-all duration-200',
                                        uiState.viewMode === 'list'
                                            ? isDark
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-blue-500 text-white'
                                            : isDark
                                                ? 'text-gray-400 hover:text-gray-300'
                                                : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    <List className="w-4 h-4" />
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
                    <div className={twMerge(
                        uiState.viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-3'
                    )}>
                        {pdfs.map((pdf) => (
                            <div
                                key={pdf.id}
                                className={twMerge(
                                    'group relative rounded-lg border transition-all duration-200 cursor-pointer',
                                    'hover:shadow-lg',
                                    uiState.selectedForMerge.has(pdf.id)
                                        ? isDark
                                            ? 'border-blue-500 bg-blue-900/20'
                                            : 'border-blue-500 bg-blue-50'
                                        : isDark
                                            ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                            : 'border-gray-200 bg-white hover:border-gray-300',
                                    uiState.viewMode === 'grid' ? 'p-6' : 'p-4'
                                )}
                                onClick={() => !uiState.isSelectionMode && handleViewPDF(pdf)}
                            >
                                {/* Checkbox para seleção */}
                                {uiState.isSelectionMode && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <input
                                            type="checkbox"
                                            checked={uiState.selectedForMerge.has(pdf.id)}
                                            onChange={() => togglePDFSelection(pdf.id)}
                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}

                                {uiState.viewMode === 'grid' ? (
                                    <div className="text-center space-y-4">
                                        <div className={twMerge(
                                            'w-16 h-16 mx-auto rounded-lg flex items-center justify-center transition-colors',
                                            isDark
                                                ? 'bg-blue-900/30 border border-blue-800/50'
                                                : 'bg-blue-50 border border-blue-200/50'
                                        )}>
                                            <FileText className={twMerge(
                                                'w-8 h-8 transition-colors',
                                                isDark ? 'text-blue-300' : 'text-blue-600'
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className={twMerge(
                                                'font-medium text-sm line-clamp-2',
                                                isDark ? 'text-white' : 'text-gray-900'
                                            )}>
                                                {pdf.title}
                                            </h3>
                                            <p className={twMerge(
                                                'text-xs mt-1 line-clamp-2',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                {pdf.description}
                                            </p>
                                            <p className={twMerge(
                                                'text-xs mt-1',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                {pdf.size} • {formatDate(pdf.uploadDate)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleViewPDF(pdf)
                                                }}
                                                className={twMerge(
                                                    'p-2 rounded-lg transition-all duration-200',
                                                    isDark
                                                        ? 'hover:bg-blue-900/50 text-blue-300 hover:text-blue-200 border border-blue-800/50 hover:border-blue-700'
                                                        : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300'
                                                )}
                                                title="Visualizar PDF"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className={twMerge(
                                            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                                            isDark
                                                ? 'bg-blue-900/30 border border-blue-800/50'
                                                : 'bg-blue-50 border border-blue-200/50'
                                        )}>
                                            <FileText className={twMerge(
                                                'w-5 h-5 transition-colors',
                                                isDark ? 'text-blue-300' : 'text-blue-600'
                                            )} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={twMerge(
                                                'font-medium text-sm truncate',
                                                isDark ? 'text-white' : 'text-gray-900'
                                            )}>
                                                {pdf.title}
                                            </h3>
                                            <p className={twMerge(
                                                'text-xs mt-1 truncate',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                {pdf.description}
                                            </p>
                                            <p className={twMerge(
                                                'text-xs mt-1',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                {pdf.size} • {formatDate(pdf.uploadDate)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleViewPDF(pdf)
                                                }}
                                                className={twMerge(
                                                    'p-2 rounded-lg transition-all duration-200',
                                                    isDark
                                                        ? 'hover:bg-blue-900/50 text-blue-300 hover:text-blue-200 border border-blue-800/50 hover:border-blue-700'
                                                        : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300'
                                                )}
                                                title="Visualizar PDF"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
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
                                <ChevronLeft className="w-4 h-4" />
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
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* 🎯 PRESERVAÇÃO: Ações em lote */}
                {uiState.selectedForMerge.size > 0 && (
                    <div className={twMerge(
                        'fixed bottom-6 left-1/2 transform -translate-x-1/2 p-4 rounded-lg border shadow-lg z-50',
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    )}>
                        <div className="flex items-center gap-4">
                            <span className={twMerge(
                                'text-sm font-medium',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                {uiState.selectedForMerge.size} documento(s) selecionado(s)
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="inline-flex items-center gap-2"
                                    onClick={() => console.log('Unificar PDFs:', Array.from(uiState.selectedForMerge))}
                                >
                                    <FileText className="w-4 h-4" />
                                    Unificar PDFs
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="inline-flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Preview */}
            {previewState.isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="fixed inset-0 flex flex-col">
                            {/* Conteúdo do modal - área do PDF */}
                            <div className={twMerge(
                                'flex-1 relative',
                                isDark ? 'bg-gray-900' : 'bg-gray-50'
                            )}>
                                {previewState.isLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
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
                                    <div className="absolute inset-0 p-4">
                                        <InlinePDFViewer
                                            pdfBase64={previewState.pdfBase64}
                                            fileName={previewState.selectedPdf?.fileName || 'documento.pdf'}
                                            height="100%"
                                            className="w-full h-full"
                                            onClose={closePreview}
                                        />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
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
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    )
}

export default BibliotecaPDFsPage
