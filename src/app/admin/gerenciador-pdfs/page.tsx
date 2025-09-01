'use client'

import React, { useState, useEffect, startTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { SortablePDFList } from '@/components/pdf/SortablePDFList'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    Search,
    Grid,
    List,
    FileText,
    Download,
    Trash2,
    Edit3,
    Check,
    X,
    FolderOpen,
    Loader2,
    Upload,
    Layers,
    RefreshCw,
    AlertCircle
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { PDFItem, ViewMode } from '@/types/pdf'
import { usePDFManager } from '@/hooks/usePDFManager'
import PDFManagerService from '@/services/pdfManager/pdfManagerService'

const GerenciadorPDFsPage = () => {
    console.log('🏗️ [GerenciadorPDFsPage] Componente renderizado')

    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    const {
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
    } = usePDFManager()

    const [ mounted, setMounted ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ isSearching, setIsSearching ] = useState(false)
    const [ viewMode, setViewMode ] = useState<ViewMode>('grid')
    const [ editingPdf, setEditingPdf ] = useState<string | null>(null)
    const [ editValues, setEditValues ] = useState<Record<string, { title: string; description: string }>>({})

    // Novos estados para funcionalidades avançadas
    const [ selectionOrder, setSelectionOrder ] = useState<string[]>([])
    const [ isSelectionMode, setIsSelectionMode ] = useState(false)
    const [ selectedForMerge, setSelectedForMerge ] = useState<Set<string>>(new Set())
    const [ isToggling, setIsToggling ] = useState(false) // Prevent double clicks

    // Estados para modal de edição de páginas
    const [ editState, setEditState ] = useState({
        isOpen: false,
        selectedPdf: null as PDFItem | null,
        form: {
            fileName: ''
        },
        pages: [] as Array<{
            pageNumber: number
            selected: boolean
            thumbnail?: string
        }>,
        isLoading: false,
        isLoadingPages: false
    })

    // Debug console logs
    useEffect(() => {
        console.log('📊 [GerenciadorPDFsPage] Estado atual:', {
            pdfsCount: pdfs.length,
            filteredCount: filteredPdfs.length,
            totalItems,
            isLoading,
            error: error ? error.substring(0, 50) + '...' : null,
            searchTerm
        })

        // Verificar se há PDFs duplicados
        const pdfIds = filteredPdfs.map(pdf => pdf.id)
        const uniqueIds = new Set(pdfIds)
        if (pdfIds.length !== uniqueIds.size) {
            console.error('🚨 PDFs DUPLICADOS detectados!', {
                totalPdfs: pdfIds.length,
                uniquePdfs: uniqueIds.size,
                duplicados: pdfIds.filter((id, index) => pdfIds.indexOf(id) !== index)
            })
        }
    })

    useEffect(() => {
        console.log('🔄 [GerenciadorPDFsPage] Componente montado')
        setMounted(true)
    }, [])

    // Carregar PDFs na inicialização
    useEffect(() => {
        console.log('📡 [GerenciadorPDFsPage] Efeito loadPDFs disparado')
        loadPDFs()
    }, [ loadPDFs ])

    useEffect(() => {
        console.log('🔍 [GerenciadorPDFsPage] Termo de busca alterado:', searchTerm)
        const delayedSearch = setTimeout(() => {
            if (searchTerm.length >= 3 || searchTerm.length === 0) {
                handleSearch(searchTerm)
            }
        }, 500)

        return () => clearTimeout(delayedSearch)
    }, [ searchTerm ])

    const handleSearch = async (term: string) => {
        console.log('🔍 [GerenciadorPDFsPage] Executando busca:', term)
        setIsSearching(true)
        try {
            if (term.trim() === '') {
                await loadPDFs()
            } else {
                await searchPDFs(term)
            }
        } finally {
            setIsSearching(false)
        }
    }

    const handleViewModeChange = (mode: ViewMode) => {
        console.log('👁️ [GerenciadorPDFsPage] Alterando modo de visualização:', mode)
        setViewMode(mode)
    }

    const handleUpload = () => {
        console.log('📤 [GerenciadorPDFsPage] Redirecionando para upload')
        window.location.href = '/admin/gerenciador-pdfs/upload'
    }

    const handleUnifiedPDFs = () => {
        console.log('📚 [GerenciadorPDFsPage] Função PDFs unificados chamada')
        // TODO: Implementar redirecionamento
    }

    const handleEdit = (pdf: PDFItem) => {
        console.log('✏️ [GerenciadorPDFsPage] Editando PDF:', pdf.id)
        setEditingPdf(pdf.id)
        setEditValues({
            ...editValues,
            [ pdf.id ]: {
                title: pdf.title,
                description: pdf.description || ''
            }
        })
    }

    const handleCancelEdit = () => {
        console.log('❌ [GerenciadorPDFsPage] Cancelando edição')
        setEditingPdf(null)
        setEditValues({})
    }

    const handleDelete = async (pdf: PDFItem) => {
        console.log('🗑️ [GerenciadorPDFsPage] Tentando excluir PDF:', pdf.id)
        if (window.confirm(`Tem certeza que deseja excluir o PDF "${pdf.fileName}"?`)) {
            // TODO: Implementar exclusão
            console.log('✅ [GerenciadorPDFsPage] PDF seria excluído:', pdf.id)
        }
    }

    const handleDownload = async (pdf: PDFItem) => {
        try {
            console.log('Baixando PDF:', pdf.id)
            const response = await PDFManagerService.baixarPdf(pdf.id)

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = pdf.fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Erro ao baixar PDF:', error)
        }
    }

    // Toggle modo de seleção
    const toggleSelectionMode = () => {
        setIsSelectionMode(prev => !prev)
        setSelectedForMerge(new Set())
        setSelectionOrder([])
    }

    // Toggle seleção de PDF para merge
    const togglePDFSelection = (pdfId: string) => {
        if (!isSelectionMode || isToggling) return

        setIsToggling(true)
        setTimeout(() => setIsToggling(false), 300) // Debounce de 300ms

        console.log('📋 GerenciadorPDFs: Toggle seleção para PDF', pdfId)
        console.log('📋 Estado atual selectedForMerge:', Array.from(selectedForMerge))
        console.log('📋 Estado atual selectionOrder:', selectionOrder)

        startTransition(() => {
            // Atualizar ambos os estados em uma única transição
            const currentSelected = new Set(selectedForMerge)
            const currentOrder = [ ...selectionOrder ]

            if (currentSelected.has(pdfId)) {
                console.log('➖ Removendo PDF da seleção:', pdfId)
                currentSelected.delete(pdfId)
                const newOrder = currentOrder.filter(id => id !== pdfId)

                // Atualizar estados em lote
                setSelectedForMerge(currentSelected)
                setSelectionOrder(newOrder)
            } else {
                console.log('➕ Adicionando PDF à seleção:', pdfId)
                // Verificar se já existe para evitar duplicatas
                if (!currentOrder.includes(pdfId)) {
                    currentSelected.add(pdfId)
                    const newOrder = [ ...currentOrder, pdfId ]

                    // Atualizar estados em lote
                    setSelectedForMerge(currentSelected)
                    setSelectionOrder(newOrder)
                }
            }

            console.log('📋 Nova seleção:', Array.from(currentSelected))
        })
    }

    // Função para reorganizar PDFs
    const handlePDFSort = (sortedPDFs: PDFItem[]) => {
        console.log('🔄 Reordenando PDFs:', sortedPDFs.map(pdf => ({ id: pdf.id, fileName: pdf.fileName })))
        // Aqui você pode implementar a lógica para salvar a nova ordem no backend
        // Por enquanto, apenas logamos a nova ordem
    }

    // Função para visualizar PDF (abre em nova aba com URL original)
    const handleViewPDF = (pdf: PDFItem) => {
        console.log('👁️ Visualizando PDF:', pdf.fileName, 'URL:', pdf.url)

        if (!pdf.url || pdf.url === '#') {
            console.error('❌ URL do PDF não disponível:', pdf)
            alert('URL do PDF não está disponível para visualização.')
            return
        }

        try {
            // Abrir PDF em nova aba usando a URL original do SharePoint
            console.log('📡 Abrindo PDF diretamente em nova aba:', pdf.url)
            window.open(pdf.url, '_blank', 'noopener,noreferrer')
        } catch (error) {
            console.error('❌ Erro ao abrir PDF:', error)
            alert('Erro ao tentar abrir o PDF. Verifique se você tem acesso ao SharePoint.')
        }
    }

    // Função para editar PDF
    const handleEditPDF = (pdf: PDFItem) => {
        console.log('✏️ Editando PDF:', pdf.fileName)
        openEditModal(pdf)
    }

    // Limpar seleções
    const clearSelections = () => {
        setSelectedForMerge(new Set())
        setSelectionOrder([])
    }

    // Funções do modal de edição de páginas
    const openEditModal = async (pdf: PDFItem) => {
        console.log('🔧 Abrindo modal de edição para:', pdf.fileName)

        setEditState({
            isOpen: true,
            selectedPdf: pdf,
            form: {
                fileName: pdf.fileName
            },
            pages: [],
            isLoading: false,
            isLoadingPages: true
        })

        // Carregar detalhes reais do PDF via proxy Next.js
        try {
            console.log('📡 Carregando detalhes do PDF:', pdf.id)

            const response = await fetch(`/pdf-api/Pdfs/${pdf.id}/details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
            }

            const pdfDetails = await response.json()
            console.log('📄 Detalhes do PDF carregados:', {
                id: pdfDetails.id,
                name: pdfDetails.name,
                pageCount: pdfDetails.pageCount,
                size: pdfDetails.formattedSize,
                isEncrypted: pdfDetails.isEncrypted
            })

            // Gerar páginas baseado no pageCount real do PDF
            const realPages = Array.from({ length: pdfDetails.pageCount }, (_, i) => ({
                pageNumber: i + 1,
                selected: true,
                thumbnail: undefined
            }))

            setEditState(prev => ({
                ...prev,
                pages: realPages,
                isLoadingPages: false
            }))
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
            console.error('❌ Erro ao carregar detalhes do PDF:', error)

            // Fallback: usar número de páginas padrão em caso de erro
            const fallbackPages = Array.from({ length: 1 }, (_, i) => ({
                pageNumber: i + 1,
                selected: true,
                thumbnail: undefined
            }))

            setEditState(prev => ({
                ...prev,
                pages: fallbackPages,
                isLoadingPages: false
            }))

            // Mostrar erro ao usuário
            alert(`Erro ao carregar detalhes do PDF: ${errorMessage}`)
        }
    }

    const closeEditModal = () => {
        setEditState({
            isOpen: false,
            selectedPdf: null,
            form: { fileName: '' },
            pages: [],
            isLoading: false,
            isLoadingPages: false
        })
    }

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

    const toggleAllPages = () => {
        const allSelected = editState.pages.every(page => page.selected)
        setEditState(prev => ({
            ...prev,
            pages: prev.pages.map(page => ({ ...page, selected: !allSelected }))
        }))
    }

    const handleSaveEdit = async () => {
        if (!editState.selectedPdf || !editState.form.fileName.trim()) return

        console.log('💾 Salvando edições do PDF:', {
            pdfId: editState.selectedPdf.id,
            newFileName: editState.form.fileName,
            selectedPages: editState.pages.filter(p => p.selected).map(p => p.pageNumber)
        })

        setEditState(prev => ({ ...prev, isLoading: true }))

        try {
            // Páginas selecionadas para MANTER (não remover)
            const selectedPages = editState.pages.filter(p => p.selected).map(p => p.pageNumber)

            // Páginas para REMOVER (as que não estão selecionadas)  
            const pagesToRemove = editState.pages
                .filter(p => !p.selected)
                .map(p => p.pageNumber)

            console.log('📋 Páginas selecionadas (manter):', selectedPages)
            console.log('🗑️ Páginas para remover:', pagesToRemove)

            // Chamar a API de edição real
            const response = await PDFManagerService.editarPdf({
                pdfId: editState.selectedPdf.id,
                pagesToRemove: pagesToRemove,
                outputFileName: editState.form.fileName
            })

            if (response.ok) {
                alert('PDF editado com sucesso!')
                closeEditModal()
                // Recarregar lista
                refreshPDFs()
            } else {
                throw new Error('Falha na edição do PDF')
            }
        } catch (error) {
            console.error('Erro ao salvar PDF:', error)
            alert('Erro ao salvar as alterações. Tente novamente.')
        } finally {
            setEditState(prev => ({ ...prev, isLoading: false }))
        }
    }

    const formatDate = (dateStr: string) => {
        try {
            console.log('🗓️ [formatDate] Input:', dateStr, typeof dateStr)
            const result = PDFManagerService.formatDate(dateStr)
            console.log('🗓️ [formatDate] Output:', result)
            return result
        } catch (error) {
            console.error('🗓️ [formatDate] Error:', error, 'Input:', dateStr)
            return 'Data inválida'
        }
    }

    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Container principal ajustado à área disponível */}
            <div className="w-full h-full flex flex-col px-3 sm:px-4 py-4 gap-4 overflow-hidden">
                {/* Header */}
                <div className="w-full shrink-0">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h1 className={twMerge(
                                'text-xl sm:text-2xl font-bold truncate',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                📁 Gerenciador de PDFs
                            </h1>
                            <p className={twMerge(
                                'mt-1 text-sm',
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            )}>
                                Sistema avançado de gerenciamento de documentos PDF via SharePoint
                            </p>
                            {totalItems > 0 && (
                                <p className={twMerge(
                                    'mt-2 text-sm font-medium',
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                )}>
                                    📊 {totalItems} PDFs encontrados
                                    {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={handleUpload}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Upload className="w-5 h-5 pdf-icon" />
                                📤 Upload
                            </Button>
                            <Button
                                onClick={handleUnifiedPDFs}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Layers className="w-5 h-5 pdf-icon" />
                                📚 PDFs Unificados
                            </Button>
                            <Button
                                onClick={refreshPDFs}
                                className={twMerge(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-white shadow-lg hover:shadow-xl transform hover:scale-105',
                                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'
                                )}
                                disabled={isLoading}
                            >
                                <RefreshCw className={twMerge(
                                    'w-5 h-5',
                                    isLoading && 'animate-spin'
                                )} />
                                🔄 Atualizar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Status da conexão */}
                {error && !error.includes('demonstração') && !error.includes('indisponível') && (
                    <div className={twMerge(
                        'p-4 rounded-lg border-l-4 border-red-500 bg-red-50 text-red-700',
                        isDark ? 'bg-red-900/20 text-red-400 border-red-500' : ''
                    )}>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-medium">❌ Erro de Conexão</span>
                        </div>
                        <p className="mt-1 text-sm">{error}</p>
                        <Button
                            onClick={clearError}
                            className="mt-2 text-sm underline opacity-80 hover:opacity-100"
                        >
                            Tentar novamente
                        </Button>
                    </div>
                )}

                {/* Controles de busca e visualização */}
                <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="🔍 Buscar PDFs no SharePoint..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={twMerge(
                                    'pl-10 h-12',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                            />
                            {(isSearching || isLoading) && (
                                <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-blue-500" />
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleViewModeChange('grid')}
                                className={twMerge(
                                    'p-3',
                                    viewMode === 'grid'
                                        ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                )}
                            >
                                <Grid className="w-5 h-5" />
                            </Button>
                            <Button
                                onClick={() => handleViewModeChange('list')}
                                className={twMerge(
                                    'p-3',
                                    viewMode === 'list'
                                        ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                )}
                            >
                                <List className="w-5 h-5" />
                            </Button>
                            <Button
                                onClick={toggleSelectionMode}
                                className={twMerge(
                                    'p-3',
                                    isSelectionMode
                                        ? isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                )}
                                title="Modo Seleção para Unificar PDFs"
                            >
                                <Layers className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Conteúdo principal */}
                <div className="flex-1 min-h-0 overflow-hidden">

                    {/* Painel de seleção */}
                    {isSelectionMode && selectedForMerge.size > 0 && (
                        <div className={twMerge(
                            'mb-4 p-4 rounded-lg border',
                            isDark
                                ? 'bg-gray-800/50 border-gray-700'
                                : 'bg-blue-50 border-blue-200'
                        )}>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className={twMerge(
                                        'text-sm font-medium',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        📋 PDFs Selecionados para Unificação
                                    </h3>
                                    <p className={twMerge(
                                        'text-sm mt-1',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {selectedForMerge.size} documento{selectedForMerge.size > 1 ? 's' : ''} selecionado{selectedForMerge.size > 1 ? 's' : ''} • Ordem de unificação:
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={clearSelections}
                                        className="text-xs"
                                    >
                                        Limpar Seleção
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="inline-flex items-center gap-2 text-xs"
                                        disabled={selectedForMerge.size < 2}
                                    >
                                        <Layers className="w-3 h-3" />
                                        Unificar PDFs
                                    </Button>
                                </div>
                            </div>

                            {/* Lista de documentos na ordem de unificação */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {[ ...new Set(selectionOrder) ].map((pdfId, index) => {
                                    const pdf = filteredPdfs.find(p => p.id === pdfId)
                                    if (!pdf) return null

                                    return (
                                        <div
                                            key={`selection-order-${pdfId}-${index}`}
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
                                                    {pdf.fileName}
                                                </h4>
                                                <p className={twMerge(
                                                    'text-xs truncate',
                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                )}>
                                                    {pdf.size} • {formatDate(pdf.uploadDate)}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {isLoading && filteredPdfs.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                                <p className={twMerge(
                                    'text-sm',
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                )}>
                                    📡 Carregando PDFs do SharePoint...
                                </p>
                            </div>
                        </div>
                    ) : filteredPdfs.length === 0 && !isLoading ? (
                        <div className="text-center py-12">
                            <FolderOpen className={twMerge(
                                'w-16 h-16 mx-auto mb-4',
                                isDark ? 'text-gray-600' : 'text-gray-400'
                            )} />
                            <h3 className={twMerge(
                                'text-lg font-medium mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                {searchTerm ? 'Nenhum PDF encontrado' : 'Nenhum PDF disponível'}
                            </h3>
                            <p className={twMerge(
                                'text-sm mb-6',
                                isDark ? 'text-gray-500' : 'text-gray-500'
                            )}>
                                {searchTerm
                                    ? `Não encontramos PDFs que correspondam a "${searchTerm}"`
                                    : 'Não há arquivos PDF disponíveis no SharePoint'
                                }
                            </p>
                            {!searchTerm && (
                                <Button
                                    onClick={handleUpload}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                                >
                                    <Upload className="w-5 h-5" />
                                    Fazer Upload de PDF
                                </Button>
                            )}
                        </div>
                    ) : (
                        <SortablePDFList
                            items={filteredPdfs.filter((pdf, index, arr) => arr.findIndex(p => p.id === pdf.id) === index)}
                            onSortEnd={handlePDFSort}
                            onViewPDF={handleViewPDF}
                            onEditPDF={handleEditPDF}
                            onSelectPDF={togglePDFSelection}
                            isDark={isDark}
                            viewMode={viewMode}
                            isSelectionMode={isSelectionMode}
                            selectedItems={selectedForMerge}
                            selectionOrder={selectionOrder}
                            formatDate={formatDate}
                            animation={200}
                            disabled={false}
                            gridCols={4}
                            className="transition-all duration-300"
                        />
                    )}
                </div>
            </div>

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
        </div>
    )
}

export default GerenciadorPDFsPage
