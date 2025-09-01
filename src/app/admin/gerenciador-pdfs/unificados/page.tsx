'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
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
    Loader2,
    Check,
    Edit3,
    FolderOpen,
    FileStack
} from 'lucide-react'
import InlinePDFViewer from '@/components/pdf/InlinePDFViewer'
import { SortablePDFList } from '@/components/pdf/SortablePDFList'
import { twMerge } from 'tailwind-merge'
import { UnifiedPDFItem, PDFItem, ViewMode, SearchParams, UnificationRequest, PDFPageInfo, PDFEditState } from '@/types/pdf'
// TODO: Criar PDFManagerService para API diferente
// import { PDFManagerService, mapPdfInfoToUnifiedPDFItem } from '@/services/pdfManager/pdfManagerService'

const UnificadosGerenciadorPDFsPage = () => {
    // 🎯 STEP 1: ANÁLISE - Contextos obrigatórios conforme AGENT-CONTEXT
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    // 🎯 STEP 2: PRESERVAÇÃO - Estados migrados da biblioteca com tipos corretos
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

    // Estados para visualização
    const [ selectedPdf, setSelectedPdf ] = useState<UnifiedPDFItem | null>(null)
    const [ showViewer, setShowViewer ] = useState(false)

    // Estados para edição inline
    const [ editingPdf, setEditingPdf ] = useState<string | null>(null)
    const [ editValues, setEditValues ] = useState<Record<string, { title: string; description: string }>>({})

    useEffect(() => {
        setMounted(true)
        loadUnifiedPdfs()
        loadAvailablePdfs()
    }, [])

    const loadUnifiedPdfs = async () => {
        try {
            setIsLoading(true)

            // TODO: Implementar busca via PDFManagerService
            console.log('Carregando PDFs unificados do gerenciador...')

            // Dados mock para demonstração (substituir por chamada real da API)
            const mockUnifiedPdfs: UnifiedPDFItem[] = [
                {
                    id: 'unified-1',
                    title: 'Relatório Mensal - Janeiro 2024',
                    url: '/api/gerenciador/unified/unified-1.pdf',
                    fileName: 'relatorio-mensal-jan-2024.pdf',
                    size: '2.0 MB',
                    uploadDate: new Date().toISOString(),
                    description: 'Compilação dos relatórios mensais',
                    sourceFiles: [ 'relatorio-vendas.pdf', 'relatorio-financeiro.pdf' ],
                    pageCount: 45
                }
            ]

            setUnifiedPdfs(mockUnifiedPdfs)
        } catch (error) {
            console.error('Erro ao carregar PDFs unificados do gerenciador:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadAvailablePdfs = async () => {
        try {
            // TODO: Implementar busca via PDFManagerService
            console.log('Carregando PDFs disponíveis para unificação...')

            // Dados mock para demonstração
            const mockPdfs: PDFItem[] = [
                {
                    id: 'available-1',
                    title: 'Documento A',
                    url: '/api/gerenciador/files/doc-a.pdf',
                    fileName: 'documento-a.pdf',
                    size: '1.0 MB',
                    uploadDate: new Date().toISOString(),
                    description: 'Documento de exemplo A'
                },
                {
                    id: 'available-2',
                    title: 'Documento B',
                    url: '/api/gerenciador/files/doc-b.pdf',
                    fileName: 'documento-b.pdf',
                    size: '2.0 MB',
                    uploadDate: new Date().toISOString(),
                    description: 'Documento de exemplo B'
                }
            ]

            setAvailablePdfs(mockPdfs)
        } catch (error) {
            console.error('Erro ao carregar PDFs disponíveis:', error)
        }
    }

    const handleSearch = useCallback(async (term: string) => {
        setSearchTerm(term)
        // TODO: Implementar busca filtrada via API do gerenciador
        console.log(`Buscando por: ${term} no gerenciador`)
    }, [])

    const handleUnifyPdfs = async () => {
        if (selectedPdfs.length < 2) return

        try {
            setIsUnifying(true)

            // TODO: Implementar unificação via PDFManagerService
            const request: UnificationRequest = {
                title: unifyForm.title,
                description: unifyForm.description,
                sourceFileIds: selectedPdfs,
                mergeOrder: selectedPdfs // Usa a mesma ordem dos arquivos selecionados
            }

            console.log('Unificando PDFs no gerenciador:', request)

            // Simular processo de unificação
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Atualizar lista após unificação
            await loadUnifiedPdfs()

            // Reset form
            setShowUnifyModal(false)
            setSelectedPdfs([])
            setUnifyForm({ title: '', description: '' })

        } catch (error) {
            console.error('Erro na unificação:', error)
        } finally {
            setIsUnifying(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este PDF unificado?')) return

        try {
            // TODO: Implementar exclusão via PDFManagerService
            console.log(`Excluindo PDF unificado ${id} do gerenciador...`)

            setUnifiedPdfs(prev => prev.filter(pdf => pdf.id !== id))
        } catch (error) {
            console.error('Erro ao excluir PDF:', error)
        }
    }

    const handleEditStart = (pdf: UnifiedPDFItem) => {
        setEditingPdf(pdf.id)
        setEditValues({
            [ pdf.id ]: {
                title: pdf.title,
                description: pdf.description || ''
            }
        })
    }

    const handleEditSave = async (id: string) => {
        try {
            const values = editValues[ id ]
            if (!values) return

            // TODO: Implementar atualização via PDFManagerService
            console.log(`Atualizando PDF ${id}:`, values)

            setUnifiedPdfs(prev => prev.map(pdf =>
                pdf.id === id
                    ? { ...pdf, title: values.title, description: values.description }
                    : pdf
            ))

            setEditingPdf(null)
            setEditValues({})
        } catch (error) {
            console.error('Erro ao salvar edição:', error)
        }
    }

    const handleEditCancel = () => {
        setEditingPdf(null)
        setEditValues({})
    }

    const openViewer = (pdf: UnifiedPDFItem) => {
        setSelectedPdf(pdf)
        setShowViewer(true)
    }

    const filteredPdfs = unifiedPdfs.filter(pdf =>
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pdf.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (!mounted) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center min-h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div className={twMerge(
                'space-y-6 transition-colors duration-200',
                isDark ? 'text-gray-100' : 'text-gray-900'
            )}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Button>

                        <div className={twMerge(
                            'p-2 rounded-lg',
                            isDark ? 'bg-gray-700' : 'bg-purple-50'
                        )}>
                            <FileStack className={twMerge(
                                'h-6 w-6',
                                isDark ? 'text-purple-400' : 'text-purple-600'
                            )} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">PDFs Unificados - Gerenciador</h1>
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                Gerenciar documentos unificados
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            onClick={() => setShowUnifyModal(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Unificar PDFs
                        </Button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative flex-1">
                        <Search className={twMerge(
                            'absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )} />
                        <Input
                            type="text"
                            placeholder="Buscar PDFs unificados..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                Carregando PDFs unificados...
                            </p>
                        </div>
                    </div>
                ) : filteredPdfs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className={twMerge(
                            'p-3 rounded-full mb-4',
                            isDark ? 'bg-gray-700' : 'bg-gray-100'
                        )}>
                            <FolderOpen className={twMerge(
                                'h-8 w-8',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )} />
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                            {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum PDF unificado'}
                        </h3>
                        <p className={twMerge(
                            'text-sm mb-4',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            {searchTerm
                                ? `Não encontramos PDFs que correspondam a "${searchTerm}"`
                                : 'Comece criando seu primeiro PDF unificado'
                            }
                        </p>
                        {!searchTerm && (
                            <Button
                                variant="primary"
                                onClick={() => setShowUnifyModal(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Unificar PDFs
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPdfs.map((pdf) => (
                                    <div
                                        key={pdf.id}
                                        className={twMerge(
                                            'group relative rounded-lg border transition-all duration-200 hover:shadow-lg',
                                            isDark
                                                ? 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                                                : 'border-gray-200 bg-white hover:shadow-md'
                                        )}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={twMerge(
                                                    'p-2 rounded-lg',
                                                    isDark ? 'bg-gray-700' : 'bg-purple-50'
                                                )}>
                                                    <Layers className={twMerge(
                                                        'h-5 w-5',
                                                        isDark ? 'text-purple-400' : 'text-purple-600'
                                                    )} />
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openViewer(pdf)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditStart(pdf)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(pdf.id)}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {editingPdf === pdf.id ? (
                                                <div className="space-y-3">
                                                    <Input
                                                        value={editValues[ pdf.id ]?.title || ''}
                                                        onChange={(e) => setEditValues(prev => ({
                                                            ...prev,
                                                            [ pdf.id ]: { ...prev[ pdf.id ], title: e.target.value }
                                                        }))}
                                                        placeholder="Título do PDF"
                                                    />
                                                    <Input
                                                        value={editValues[ pdf.id ]?.description || ''}
                                                        onChange={(e) => setEditValues(prev => ({
                                                            ...prev,
                                                            [ pdf.id ]: { ...prev[ pdf.id ], description: e.target.value }
                                                        }))}
                                                        placeholder="Descrição"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => handleEditSave(pdf.id)}
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleEditCancel}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="font-medium text-base mb-2 line-clamp-2">
                                                        {pdf.title}
                                                    </h3>

                                                    {pdf.description && (
                                                        <p className={twMerge(
                                                            'text-sm mb-3 line-clamp-2',
                                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                                        )}>
                                                            {pdf.description}
                                                        </p>
                                                    )}

                                                    <div className="space-y-2">
                                                        <div className={twMerge(
                                                            'text-xs',
                                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                                        )}>
                                                            {pdf.pageCount} páginas • {pdf.size}
                                                        </div>

                                                        <div className={twMerge(
                                                            'text-xs',
                                                            isDark ? 'text-gray-500' : 'text-gray-500'
                                                        )}>
                                                            {pdf.sourceFiles.length} arquivos combinados
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className={twMerge(
                                'border rounded-lg overflow-hidden',
                                isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-200 bg-white'
                            )}>
                                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {filteredPdfs.map((pdf) => (
                                        <div
                                            key={pdf.id}
                                            className={twMerge(
                                                'p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
                                                editingPdf === pdf.id && 'bg-blue-50 dark:bg-blue-900/20'
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className={twMerge(
                                                        'p-2 rounded-lg flex-shrink-0',
                                                        isDark ? 'bg-gray-700' : 'bg-purple-50'
                                                    )}>
                                                        <Layers className={twMerge(
                                                            'h-5 w-5',
                                                            isDark ? 'text-purple-400' : 'text-purple-600'
                                                        )} />
                                                    </div>

                                                    {editingPdf === pdf.id ? (
                                                        <div className="flex-1 space-y-2">
                                                            <Input
                                                                value={editValues[ pdf.id ]?.title || ''}
                                                                onChange={(e) => setEditValues(prev => ({
                                                                    ...prev,
                                                                    [ pdf.id ]: { ...prev[ pdf.id ], title: e.target.value }
                                                                }))}
                                                                placeholder="Título do PDF"
                                                            />
                                                            <Input
                                                                value={editValues[ pdf.id ]?.description || ''}
                                                                onChange={(e) => setEditValues(prev => ({
                                                                    ...prev,
                                                                    [ pdf.id ]: { ...prev[ pdf.id ], description: e.target.value }
                                                                }))}
                                                                placeholder="Descrição"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-base mb-1">
                                                                {pdf.title}
                                                            </h3>
                                                            {pdf.description && (
                                                                <p className={twMerge(
                                                                    'text-sm mb-2',
                                                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                                                )}>
                                                                    {pdf.description}
                                                                </p>
                                                            )}
                                                            <div className={twMerge(
                                                                'text-xs flex items-center gap-4',
                                                                isDark ? 'text-gray-400' : 'text-gray-600'
                                                            )}>
                                                                <span>{pdf.pageCount} páginas</span>
                                                                <span>{pdf.size}</span>
                                                                <span>{pdf.sourceFiles.length} arquivos</span>
                                                                <span>Criado em {new Date(pdf.uploadDate).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {editingPdf === pdf.id ? (
                                                        <>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => handleEditSave(pdf.id)}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={handleEditCancel}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openViewer(pdf)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditStart(pdf)}
                                                            >
                                                                <Edit3 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(pdf.id)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Modal para Unificar PDFs */}
                <Modal
                    isOpen={showUnifyModal}
                    onClose={() => setShowUnifyModal(false)}
                    title="Unificar PDFs"
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Título do PDF Unificado
                                </label>
                                <Input
                                    value={unifyForm.title}
                                    onChange={(e) => setUnifyForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Ex: Relatório Consolidado Janeiro 2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Descrição (opcional)
                                </label>
                                <Input
                                    value={unifyForm.description}
                                    onChange={(e) => setUnifyForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Descrição do documento unificado"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">
                                Selecionar PDFs para Unificar ({selectedPdfs.length} selecionados)
                            </label>
                            <div className={twMerge(
                                'border rounded-lg max-h-60 overflow-y-auto',
                                isDark ? 'border-gray-600' : 'border-gray-200'
                            )}>
                                {availablePdfs.length === 0 ? (
                                    <div className="p-4 text-center">
                                        <p className={twMerge(
                                            'text-sm',
                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                        )}>
                                            Nenhum PDF disponível para unificação
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {availablePdfs.map((pdf) => (
                                            <label
                                                key={pdf.id}
                                                className={twMerge(
                                                    'flex items-center gap-3 p-3 cursor-pointer transition-colors',
                                                    isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50',
                                                    selectedPdfs.includes(pdf.id) && (
                                                        isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                                                    )
                                                )}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPdfs.includes(pdf.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedPdfs(prev => [ ...prev, pdf.id ])
                                                        } else {
                                                            setSelectedPdfs(prev => prev.filter(id => id !== pdf.id))
                                                        }
                                                    }}
                                                    className="rounded border-gray-300"
                                                />
                                                <FileText className={twMerge(
                                                    'h-5 w-5',
                                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                                )} />
                                                <div className="flex-1">
                                                    <p className="font-medium">{pdf.title}</p>
                                                    <p className={twMerge(
                                                        'text-sm',
                                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                                    )}>
                                                        {pdf.size}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                {selectedPdfs.length < 2 && (
                                    <span className="text-amber-500">
                                        Selecione pelo menos 2 PDFs para unificar
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowUnifyModal(false)}
                                    disabled={isUnifying}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleUnifyPdfs}
                                    disabled={selectedPdfs.length < 2 || !unifyForm.title.trim() || isUnifying}
                                    className="flex items-center gap-2"
                                >
                                    {isUnifying ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Unificando...
                                        </>
                                    ) : (
                                        <>
                                            <Layers className="h-4 w-4" />
                                            Unificar PDFs
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* Viewer Modal */}
                {showViewer && selectedPdf && (
                    <Modal
                        isOpen={showViewer}
                        onClose={() => setShowViewer(false)}
                        title={selectedPdf.title}
                        size="full"
                    >
                        <div className="h-full">
                            {/* TODO: Implementar conversão de URL para base64 ou usar componente diferente */}
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center space-y-4">
                                    <FileText className="h-16 w-16 mx-auto text-gray-400" />
                                    <h3 className="text-lg font-medium">Visualizar PDF</h3>
                                    <p className="text-sm text-gray-600">
                                        Viewer em desenvolvimento para o gerenciador
                                    </p>
                                    <div className="space-y-2">
                                        <p><strong>Arquivo:</strong> {selectedPdf.title}</p>
                                        <p><strong>Tamanho:</strong> {selectedPdf.size}</p>
                                        <p><strong>Páginas:</strong> {selectedPdf.pageCount}</p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => window.open(selectedPdf.url, '_blank')}
                                    >
                                        Abrir em Nova Aba
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </PageWrapper>
    )
}

export default UnificadosGerenciadorPDFsPage
