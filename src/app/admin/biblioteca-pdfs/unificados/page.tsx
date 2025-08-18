'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    FileText,
    Search,
    Grid,
    List,
    ArrowLeft,
    Plus,
    Eye,
    Download,
    Trash2,
    Layers,
    ChevronDown,
    CheckCircle,
    X,
    Loader2
} from 'lucide-react'
import DirectPDFViewer from '@/components/DirectPDFViewer'
import InlinePDFViewer from '@/components/InlinePDFViewer'
import { twMerge } from 'tailwind-merge'
import { UnifiedPDFItem, PDFItem, ViewMode, SearchParams, UnificationRequest } from '@/types/pdf'
import { mapPdfInfoToUnifiedPDFItem, PDFService, UnifiedPDFService } from '@/services/pdf/pdfService'

const UnificadosPDFsPage = () => {
    // 🎯 STEP 1: ANÁLISE - Contextos obrigatórios conforme AGENT-CONTEXT
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    // 🎯 STEP 2: PRESERVAÇÃO - Estados migrados do app_pdfs
    const [ mounted, setMounted ] = useState(false)
    const [ unifiedPdfs, setUnifiedPdfs ] = useState<UnifiedPDFItem[]>([])
    const [ availablePdfs, setAvailablePdfs ] = useState<PDFItem[]>([])
    const [ viewMode, setViewMode ] = useState<ViewMode>('grid')
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ isLoading, setIsLoading ] = useState(true)

    // Estados para criação de novo PDF unificado
    const [ showUnifyModal, setShowUnifyModal ] = useState(false)
    const [ selectedPdfs, setSelectedPdfs ] = useState<string[]>([])
    const [ unifyForm, setUnifyForm ] = useState({
        title: '',
        description: ''
    })
    const [ isUnifying, setIsUnifying ] = useState(false)

    // Estado para preview
    const [ previewState, setPreviewState ] = useState({
        isOpen: false,
        selectedPdf: null as UnifiedPDFItem | null,
        pdfBase64: null as string | null,
        isLoading: false
    })

    // Carregar PDFs unificados
    const loadUnifiedPDFs = useCallback(async () => {
        try {
            setIsLoading(true)
            console.log('🚀 Carregando PDFs unificados...');

            const data = await UnifiedPDFService.listUnifiedPDFs()
            setUnifiedPdfs(data)

            console.log('✅ PDFs unificados carregados:', data.length, 'documentos');
        } catch (error) {
            console.error('❌ Erro ao carregar PDFs unificados:', error)

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
                    sourceFiles: [ 'relatorio-jan.pdf', 'relatorio-fev.pdf', 'relatorio-mar.pdf' ],
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
                    sourceFiles: [ 'manual-usuario.pdf', 'guia-instalacao.pdf' ],
                    pageCount: 85
                }
            ])

            console.log('🔄 Usando dados mock para desenvolvimento');
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Carregar PDFs disponíveis para unificação
    const loadAvailablePDFs = useCallback(async () => {
        try {
            const data = await PDFService.listPDFs()
            setAvailablePdfs(data)
        } catch (error) {
            console.error('Erro ao carregar PDFs disponíveis:', error)
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

    // Buscar PDFs unificados
    const searchUnifiedPDFs = useCallback(async (query: string) => {
        if (!query.trim()) {
            loadUnifiedPDFs()
            return
        }

        try {
            const response = await UnifiedPDFService.searchUnifiedPDFs({
                query,
                page: 1,
                limit: 50
            })

            if (response && response.arquivos) {
                setUnifiedPdfs(response.arquivos.map(mapPdfInfoToUnifiedPDFItem))
            }
        } catch (error) {
            console.error('Erro na busca:', error)
            // Fallback para busca local
            const filtered = unifiedPdfs.filter(pdf =>
                pdf.title.toLowerCase().includes(query.toLowerCase()) ||
                pdf.description.toLowerCase().includes(query.toLowerCase())
            )
            setUnifiedPdfs(filtered)
        }
    }, [ unifiedPdfs, loadUnifiedPDFs ])

    // Visualizar PDF unificado
    const handleViewPDF = async (pdf: UnifiedPDFItem) => {
        setPreviewState(prev => ({
            ...prev,
            isOpen: true,
            selectedPdf: pdf,
            isLoading: true,
            pdfBase64: null
        }))

        try {
            const base64 = await UnifiedPDFService.viewUnifiedPDF(pdf.fileName)
            setPreviewState(prev => ({
                ...prev,
                pdfBase64: base64,
                isLoading: false
            }))
        } catch (error) {
            console.error('Erro ao carregar PDF unificado:', error)
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

    // Toggle seleção de PDF para unificação
    const togglePDFSelection = (pdfId: string) => {
        setSelectedPdfs(prev =>
            prev.includes(pdfId)
                ? prev.filter(id => id !== pdfId)
                : [ ...prev, pdfId ]
        )
    }

    // Unificar PDFs selecionados
    const handleUnifyPDFs = async () => {
        if (selectedPdfs.length < 2) {
            alert('Selecione pelo menos 2 PDFs para unificar')
            return
        }

        if (!unifyForm.title.trim()) {
            alert('Digite um título para o PDF unificado')
            return
        }

        try {
            setIsUnifying(true)

            const request: UnificationRequest = {
                title: unifyForm.title,
                description: unifyForm.description,
                sourceFileIds: selectedPdfs,
                mergeOrder: selectedPdfs // Ordem atual de seleção
            }

            await UnifiedPDFService.unifyPDFs(request)

            // Recarregar lista e fechar modal
            await loadUnifiedPDFs()
            setShowUnifyModal(false)
            setSelectedPdfs([])
            setUnifyForm({ title: '', description: '' })

        } catch (error) {
            console.error('Erro ao unificar PDFs:', error)
            alert('Erro ao unificar PDFs. Tente novamente.')
        } finally {
            setIsUnifying(false)
        }
    }

    // Formatar data
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    // Effect para carregar dados iniciais
    useEffect(() => {
        setMounted(true)
        loadUnifiedPDFs()
        loadAvailablePDFs()
    }, [ loadUnifiedPDFs, loadAvailablePDFs ])

    // Effect para busca com debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                searchUnifiedPDFs(searchTerm)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [ searchTerm, searchUnifiedPDFs ])

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
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            onClick={() => window.location.href = '/admin/biblioteca-pdfs'}
                            variant="outline"
                            size="sm"
                            className="inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar
                        </Button>
                        <h1 className={twMerge(
                            'text-4xl font-bold',
                            isDark ? 'text-white' : 'text-slate-800'
                        )}>
                            PDFs Unificados
                        </h1>
                    </div>

                    <p className={twMerge(
                        'text-lg',
                        isDark ? 'text-gray-300' : 'text-muted-foreground'
                    )}>
                        {isLoading ? 'Carregando...' : `${unifiedPdfs.length} documentos unificados`}
                    </p>

                    {/* Botão para criar novo PDF unificado */}
                    <Button
                        onClick={() => setShowUnifyModal(true)}
                        className={twMerge(
                            'inline-flex items-center gap-2',
                            isDark
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                        )}
                    >
                        <Plus className="w-4 h-4" />
                        Criar PDF Unificado
                    </Button>
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
                                placeholder="Buscar PDFs unificados..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={twMerge(
                                    'w-full pl-10 pr-10 py-2 rounded-lg border transition-all duration-200',
                                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                )}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('')
                                        loadUnifiedPDFs()
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
                                    onClick={() => setViewMode('grid')}
                                    className={twMerge(
                                        'p-2 rounded-l-lg transition-all duration-200',
                                        viewMode === 'grid'
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
                                    onClick={() => setViewMode('list')}
                                    className={twMerge(
                                        'p-2 rounded-r-lg transition-all duration-200',
                                        viewMode === 'list'
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
                        </div>
                    </div>
                </div>

                {/* Estados de loading */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className={twMerge(
                            'mt-2 text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            Carregando PDFs unificados...
                        </p>
                    </div>
                )}

                {/* Lista de PDFs unificados */}
                {!isLoading && unifiedPdfs.length === 0 && (
                    <div className={twMerge(
                        'text-center py-12 rounded-lg border-2 border-dashed',
                        isDark
                            ? 'border-gray-600 bg-gray-800/30'
                            : 'border-gray-300 bg-gray-50/50'
                    )}>
                        <Layers className={twMerge(
                            'w-16 h-16 mx-auto mb-4',
                            isDark ? 'text-gray-500' : 'text-gray-400'
                        )} />
                        <h3 className={twMerge(
                            'text-lg font-medium mb-2',
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        )}>
                            Nenhum PDF unificado encontrado
                        </h3>
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            {searchTerm ? 'Tente alterar os termos de busca' : 'Crie seu primeiro PDF unificado'}
                        </p>
                    </div>
                )}

                {!isLoading && unifiedPdfs.length > 0 && (
                    <div className={twMerge(
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                    )}>
                        {unifiedPdfs.map((pdf) => (
                            <div
                                key={pdf.id}
                                className={twMerge(
                                    'group relative rounded-lg border transition-all duration-200 cursor-pointer',
                                    'hover:shadow-lg',
                                    isDark
                                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                        : 'border-gray-200 bg-white hover:border-gray-300',
                                    viewMode === 'grid' ? 'p-6' : 'p-4'
                                )}
                                onClick={() => handleViewPDF(pdf)}
                            >
                                {viewMode === 'grid' ? (
                                    <div className="text-center space-y-4">
                                        <div className={twMerge(
                                            'w-16 h-16 mx-auto rounded-lg flex items-center justify-center relative transition-colors',
                                            isDark
                                                ? 'bg-purple-900/30 border border-purple-800/50'
                                                : 'bg-purple-50 border border-purple-200/50'
                                        )}>
                                            <Layers className={twMerge(
                                                'w-8 h-8 transition-colors',
                                                isDark ? 'text-purple-300' : 'text-purple-600'
                                            )} />
                                            <div className={twMerge(
                                                'absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border',
                                                isDark
                                                    ? 'bg-blue-700 text-blue-100 border-blue-600'
                                                    : 'bg-blue-500 text-white border-blue-400'
                                            )}>
                                                {pdf.sourceFiles.length}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className={twMerge(
                                                'font-medium text-sm line-clamp-2 mb-2',
                                                isDark ? 'text-white' : 'text-gray-900'
                                            )}>
                                                {pdf.title}
                                            </h3>
                                            <p className={twMerge(
                                                'text-xs line-clamp-2 mb-2',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                {pdf.description}
                                            </p>
                                            <div className={twMerge(
                                                'text-xs space-y-1',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                <p>{pdf.size} • {pdf.pageCount} páginas</p>
                                                <p>Criado em {formatDate(pdf.uploadDate)}</p>
                                                <p>{pdf.sourceFiles.length} arquivos fonte</p>
                                            </div>
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
                                                        ? 'hover:bg-purple-900/50 text-purple-300 hover:text-purple-200 border border-purple-800/50 hover:border-purple-700'
                                                        : 'hover:bg-purple-50 text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300'
                                                )}
                                                title="Visualizar PDF Unificado"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className={twMerge(
                                            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative transition-colors',
                                            isDark
                                                ? 'bg-purple-900/30 border border-purple-800/50'
                                                : 'bg-purple-50 border border-purple-200/50'
                                        )}>
                                            <Layers className={twMerge(
                                                'w-6 h-6 transition-colors',
                                                isDark ? 'text-purple-300' : 'text-purple-600'
                                            )} />
                                            <div className={twMerge(
                                                'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border',
                                                isDark
                                                    ? 'bg-blue-700 text-blue-100 border-blue-600'
                                                    : 'bg-blue-500 text-white border-blue-400'
                                            )}>
                                                {pdf.sourceFiles.length}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={twMerge(
                                                'font-medium text-sm line-clamp-1 mb-1',
                                                isDark ? 'text-white' : 'text-gray-900'
                                            )}>
                                                {pdf.title}
                                            </h3>
                                            <p className={twMerge(
                                                'text-xs line-clamp-1 mb-2',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                {pdf.description}
                                            </p>
                                            <div className={twMerge(
                                                'text-xs',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                {pdf.size} • {pdf.pageCount} páginas • {pdf.sourceFiles.length} arquivos
                                            </div>
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
                                                        ? 'hover:bg-purple-900/50 text-purple-300 hover:text-purple-200 border border-purple-800/50 hover:border-purple-700'
                                                        : 'hover:bg-purple-50 text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300'
                                                )}
                                                title="Visualizar PDF Unificado"
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
            </div>

            {/* Modal para criar PDF unificado */}
            {showUnifyModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className={twMerge(
                            'fixed inset-0 transition-opacity',
                            isDark ? 'bg-black bg-opacity-75' : 'bg-gray-500 bg-opacity-75'
                        )} onClick={() => setShowUnifyModal(false)}></div>

                        <div className={twMerge(
                            'inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full',
                            isDark ? 'bg-gray-800' : 'bg-white'
                        )}>
                            <div className={twMerge(
                                'px-4 pt-5 pb-4 sm:p-6 sm:pb-4',
                                isDark ? 'bg-gray-800' : 'bg-white'
                            )}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className={twMerge(
                                        'text-lg font-medium',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        Criar PDF Unificado
                                    </h3>
                                    <button
                                        onClick={() => setShowUnifyModal(false)}
                                        className={twMerge(
                                            'transition-colors',
                                            isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                                        )}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Formulário */}
                                <div className="space-y-6">
                                    <div>
                                        <label className={twMerge(
                                            'block text-sm font-medium mb-2',
                                            isDark ? 'text-gray-300' : 'text-gray-700'
                                        )}>
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            value={unifyForm.title}
                                            onChange={(e) => setUnifyForm(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Digite o título do PDF unificado"
                                            className={twMerge(
                                                'w-full px-3 py-2 border rounded-lg transition-colors',
                                                'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
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
                                            Descrição
                                        </label>
                                        <textarea
                                            value={unifyForm.description}
                                            onChange={(e) => setUnifyForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Descrição opcional do PDF unificado"
                                            rows={3}
                                            className={twMerge(
                                                'w-full px-3 py-2 border rounded-lg transition-colors',
                                                'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                                                isDark
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className={twMerge(
                                            'block text-sm font-medium mb-3',
                                            isDark ? 'text-gray-300' : 'text-gray-700'
                                        )}>
                                            Selecionar PDFs para Unificar
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                                            {availablePdfs.map((pdf) => (
                                                <div
                                                    key={pdf.id}
                                                    className={twMerge(
                                                        'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                                                        selectedPdfs.includes(pdf.id)
                                                            ? isDark
                                                                ? 'border-blue-500 bg-blue-900/20'
                                                                : 'border-blue-500 bg-blue-50'
                                                            : isDark
                                                                ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                                                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                    )}
                                                    onClick={() => togglePDFSelection(pdf.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPdfs.includes(pdf.id)}
                                                            onChange={() => togglePDFSelection(pdf.id)}
                                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={twMerge(
                                                                'text-sm font-medium truncate',
                                                                isDark ? 'text-white' : 'text-gray-900'
                                                            )}>
                                                                {pdf.title}
                                                            </h4>
                                                            <p className={twMerge(
                                                                'text-xs truncate',
                                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                                            )}>
                                                                {pdf.size}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedPdfs.length > 0 && (
                                            <p className={twMerge(
                                                'text-sm mt-2',
                                                isDark ? 'text-blue-400' : 'text-blue-600'
                                            )}>
                                                {selectedPdfs.length} PDF(s) selecionado(s)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <Button
                                        onClick={() => setShowUnifyModal(false)}
                                        variant="outline"
                                        disabled={isUnifying}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleUnifyPDFs}
                                        disabled={isUnifying || selectedPdfs.length < 2 || !unifyForm.title.trim()}
                                        className={twMerge(
                                            'inline-flex items-center gap-2',
                                            isUnifying || selectedPdfs.length < 2 || !unifyForm.title.trim()
                                                ? 'cursor-not-allowed opacity-50'
                                                : isDark
                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                        )}
                                    >
                                        {isUnifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Unificando...
                                            </>
                                        ) : (
                                            <>
                                                <Layers className="w-4 h-4" />
                                                Unificar PDFs
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Preview */}
            {previewState.isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className={twMerge(
                            'fixed inset-0 transition-opacity',
                            isDark ? 'bg-black bg-opacity-90' : 'bg-gray-900 bg-opacity-90'
                        )} onClick={closePreview}></div>

                        <div className="fixed inset-0 flex flex-col">
                            {/* Header do modal */}
                            <div className={twMerge(
                                'flex items-center justify-between px-6 py-4 border-b',
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            )}>
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className={twMerge(
                                        'text-lg font-medium truncate',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        {previewState.selectedPdf?.title}
                                    </h3>
                                    <p className={twMerge(
                                        'text-sm mt-1',
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    )}>
                                        {previewState.selectedPdf?.sourceFiles.length} arquivos • {previewState.selectedPdf?.pageCount} páginas
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {previewState.pdfBase64 && (
                                        <Button
                                            onClick={() => window.open(previewState.pdfBase64!, '_blank')}
                                            size="sm"
                                            className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Nova Janela
                                        </Button>
                                    )}
                                    <button
                                        onClick={closePreview}
                                        className={twMerge(
                                            'p-2 rounded-lg transition-colors',
                                            isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                        )}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

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
                                                Carregando PDF unificado...
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

export default UnificadosPDFsPage
