'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, startTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { SortableTelescopePDFList } from '@/components/pdf/SortableTelescopePDFList'
import { useTheme } from '@/contexts/ThemeContext'
// import { useLayout } from '@/contexts/LayoutContext'
import {
    Search,
    Grid,
    List,
    FileText,
    Edit3,
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

    const router = useRouter()
    const { isDark } = useTheme()
    // const { isMobile } = useLayout()

    const {
        pdfs,
        filteredPdfs,
        isLoading,
        error,
        totalItems,
        currentPage,
        totalPages,
        // hasNextPage,
        // hasPreviousPage,
        loadPDFs,
        searchPDFs,
        refreshPDFs,
        clearError
    } = usePDFManager()

    const [ mounted, setMounted ] = useState(false)
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ isSearching, setIsSearching ] = useState(false)
    const [ viewMode, setViewMode ] = useState<ViewMode>('grid')

    // Novos estados para funcionalidades avançadas
    const [ selectionOrder, setSelectionOrder ] = useState<string[]>([])
    const [ isSelectionMode, setIsSelectionMode ] = useState(false)
    const [ selectedForMerge, setSelectedForMerge ] = useState<Set<string>>(new Set())
    const [ isToggling, setIsToggling ] = useState(false) // Prevent double clicks
    const [ customPDFOrder, setCustomPDFOrder ] = useState<string[]>([]) // Nova ordem personalizada

    // Estados para processo de unificação
    const [ isMerging, setIsMerging ] = useState(false)
    const [ mergeProgress, setMergeProgress ] = useState<{
        show: boolean
        message: string
        type: 'info' | 'success' | 'error'
    }>({
        show: false,
        message: '',
        type: 'info'
    })

    // Estados para modal de composição do nome
    const [ showCompositionModal, setShowCompositionModal ] = useState(false)
    const [ nomeComposicao, setNomeComposicao ] = useState({
        cdPessoaFisica: '',
        numeroAtendimento: '',
        dataUpload: '',
        hash: ''
    })

    // Função para formatar data no formato DDMMAAAA
    const formatDateDDMMAAAA = (date: Date = new Date()): string => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear().toString()
        return `${day}${month}${year}`
    }

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

        // Inicializar composição do nome com data e hash
        setNomeComposicao(prev => ({
            ...prev,
            dataUpload: formatDateDDMMAAAA(),
            hash: Math.random().toString(36).substring(2, 8).toUpperCase()
        }))
    }, [])

    // Carregar PDFs na inicialização
    useEffect(() => {
        console.log('📡 [GerenciadorPDFsPage] Efeito loadPDFs disparado')
        loadPDFs()
    }, [ loadPDFs ])

    const handleSearch = useCallback(async (term: string) => {
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
    }, [ loadPDFs, searchPDFs ])

    useEffect(() => {
        console.log('🔍 [GerenciadorPDFsPage] Termo de busca alterado:', searchTerm)
        const delayedSearch = setTimeout(() => {
            if (searchTerm.length >= 3 || searchTerm.length === 0) {
                handleSearch(searchTerm)
            }
        }, 500)

        return () => clearTimeout(delayedSearch)
    }, [ searchTerm, handleSearch ])

    // Effect para resetar ordem personalizada quando PDFs mudam significativamente
    useEffect(() => {
        // Se a quantidade de PDFs mudou muito ou se é uma nova busca, resetar ordem
        if (filteredPdfs.length > 0 && customPDFOrder.length > 0) {
            const currentIds = new Set(filteredPdfs.map(pdf => pdf.id))

            // Se menos de 70% dos IDs personalizados ainda existem, resetar
            const intersection = customPDFOrder.filter(id => currentIds.has(id))
            if (intersection.length < customPDFOrder.length * 0.7) {
                console.log('🔄 Resetando ordem personalizada devido a mudança significativa nos PDFs')
                setCustomPDFOrder([])
            }
        }
    }, [ filteredPdfs, customPDFOrder ])



    const handleViewModeChange = (mode: ViewMode) => {
        console.log('👁️ [GerenciadorPDFsPage] Alterando modo de visualização:', mode)
        setViewMode(mode)
    }

    const handleUpload = () => {
        console.log('📤 [GerenciadorPDFsPage] Redirecionando para upload')
        window.location.href = '/admin/gerenciador-pdfs/upload'
    }

    const handleUnifiedPDFs = () => {
        console.log('📚 [GerenciadorPDFsPage] Redirecionando para PDFs unificados')
        router.push('/admin/gerenciador-pdfs/unificados')
    }

    /**
     * Função para abrir modal de composição de nome antes da unificação
     */
    const handleMergePDFs = async () => {
        if (selectedForMerge.size < 2) {
            setMergeProgress({
                show: true,
                message: '⚠️ É necessário selecionar pelo menos 2 PDFs para unificação',
                type: 'error'
            })
            setTimeout(() => {
                setMergeProgress(prev => ({ ...prev, show: false }))
            }, 3000)
            return
        }

        // Abrir modal de composição do nome
        setShowCompositionModal(true)
    }

    /**
     * Função para confirmar a unificação com composição do nome
     */
    const handleConfirmMerge = async () => {
        // Validar composição do nome
        if (!nomeComposicao.cdPessoaFisica.trim()) {
            alert('Código da Pessoa Física é obrigatório')
            return
        }

        if (!nomeComposicao.numeroAtendimento.trim()) {
            alert('Número do Atendimento é obrigatório')
            return
        }

        if (!nomeComposicao.dataUpload.trim() || nomeComposicao.dataUpload.length !== 8) {
            alert('Data deve estar no formato DDMMAAAA (8 dígitos)')
            return
        }

        // Validar se a data é válida
        const day = parseInt(nomeComposicao.dataUpload.substring(0, 2))
        const month = parseInt(nomeComposicao.dataUpload.substring(2, 4))
        const year = parseInt(nomeComposicao.dataUpload.substring(4, 8))

        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
            alert('Data inválida. Use o formato DDMMAAAA com uma data válida.')
            return
        }

        setShowCompositionModal(false)

        try {
            setIsMerging(true)
            setMergeProgress({
                show: true,
                message: '🔄 Iniciando processo de unificação...',
                type: 'info'
            })

            // Obter IDs na ordem correta
            const orderedPdfIds = selectionOrder.filter(id => selectedForMerge.has(id))

            console.log('🔗 [GerenciadorPDFsPage] Unificando PDFs:', {
                selectedCount: selectedForMerge.size,
                orderedIds: orderedPdfIds,
                composicaoNome: nomeComposicao
            })

            // Gerar nome composto para o arquivo unificado com prefixo UNI_
            const nomeComposto = `UNI_${nomeComposicao.cdPessoaFisica}_${nomeComposicao.numeroAtendimento}_${nomeComposicao.dataUpload}_${nomeComposicao.hash}`

            setMergeProgress({
                show: true,
                message: `📄 Unificando ${orderedPdfIds.length} PDFs: "${nomeComposto}.pdf"...`,
                type: 'info'
            })

            // Chamada para API de unificação
            const result = await PDFManagerService.mergePDFs(
                orderedPdfIds,
                nomeComposto, // Usar nome composto
                true, // maintainOrder
                true  // overwrite
            )

            if (result.success) {
                setMergeProgress({
                    show: true,
                    message: `✅ PDFs unificados com sucesso! Arquivo: "${result.mergedFileName}"`,
                    type: 'success'
                })

                // Limpar seleções
                setSelectedForMerge(new Set())
                setSelectionOrder([])
                setIsSelectionMode(false)

                // Gerar novo hash para próxima unificação
                setNomeComposicao(prev => ({
                    ...prev,
                    hash: Math.random().toString(36).substring(2, 8).toUpperCase()
                }))

                // Aguardar um pouco para mostrar o feedback e então redirecionar
                setTimeout(() => {
                    console.log('🎯 [GerenciadorPDFsPage] Redirecionando para PDFs unificados')
                    router.push('/admin/gerenciador-pdfs/unificados')
                }, 2000)

            } else {
                throw new Error(result.errorMessage || 'Erro desconhecido na unificação')
            }

        } catch (error) {
            console.error('❌ [GerenciadorPDFsPage] Erro ao unificar PDFs:', error)

            const errorMessage = error instanceof Error
                ? error.message
                : 'Erro inesperado ao unificar PDFs'

            setMergeProgress({
                show: true,
                message: `❌ Erro na unificação: ${errorMessage}`,
                type: 'error'
            })

            // Remover mensagem de erro após 5 segundos
            setTimeout(() => {
                setMergeProgress(prev => ({ ...prev, show: false }))
            }, 5000)

        } finally {
            setIsMerging(false)
        }
    }

    // Funções antigas de edição/download removidas por não serem utilizadas

    // Toggle modo de seleção
    const toggleSelectionMode = () => {
        setIsSelectionMode(prev => !prev)
        setSelectedForMerge(new Set())
        setSelectionOrder([])
    }

    // Função para resetar ordem personalizada
    const resetCustomOrder = () => {
        console.log('🔄 Resetando ordem personalizada manualmente')
        setCustomPDFOrder([])
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

    // Função para aplicar ordem personalizada aos PDFs
    const getOrderedPDFs = (pdfs: PDFItem[]): PDFItem[] => {
        if (customPDFOrder.length === 0) return pdfs

        // Criar mapa para acesso rápido
        const pdfMap = new Map(pdfs.map(pdf => [ pdf.id, pdf ]))
        const orderedPDFs: PDFItem[] = []
        const usedIds = new Set<string>()

        // Primeiro, adicionar PDFs na ordem personalizada
        customPDFOrder.forEach(id => {
            const pdf = pdfMap.get(id)
            if (pdf) {
                orderedPDFs.push(pdf)
                usedIds.add(id)
            }
        })

        // Depois, adicionar PDFs que não estão na ordem personalizada (novos PDFs)
        pdfs.forEach(pdf => {
            if (!usedIds.has(pdf.id)) {
                orderedPDFs.push(pdf)
            }
        })

        return orderedPDFs
    }

    // Função para reorganizar PDFs
    const handlePDFSort = (sortedPDFs: PDFItem[]) => {
        console.log('🔄 Reordenando PDFs:', sortedPDFs.map(pdf => ({ id: pdf.id, fileName: pdf.fileName })))

        // Salvar a nova ordem personalizada
        const newCustomOrder = sortedPDFs.map(pdf => pdf.id)
        setCustomPDFOrder(newCustomOrder)
        console.log('💾 Nova ordem personalizada salva:', newCustomOrder)

        // Atualizar a ordem de seleção com base na nova ordem dos PDFs
        const newSelectionOrder = sortedPDFs
            .filter(pdf => selectedForMerge.has(pdf.id))
            .map(pdf => pdf.id)

        console.log('🔄 Nova ordem de seleção:', newSelectionOrder)
        setSelectionOrder(newSelectionOrder)

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

        // Carregar detalhes reais do PDF via API route local
        try {
            console.log('📡 Carregando detalhes do PDF:', pdf.id)

            const response = await fetch(`/api/pdfs/details/${pdf.id}`, {
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
                                <Upload className="w-5 h-5 navbar-settings-icon" />
                                📤 Upload
                            </Button>
                            <Button
                                onClick={handleUnifiedPDFs}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Layers className="w-5 h-5 navbar-message-icon" />
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
                                    'w-5 h-5 navbar-settings-icon',
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
                            <AlertCircle className="w-5 h-5 navbar-bell-icon" />
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

                {/* Feedback do processo de unificação */}
                {mergeProgress.show && (
                    <div className={twMerge(
                        'p-4 rounded-lg border-l-4',
                        mergeProgress.type === 'success'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : mergeProgress.type === 'error'
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-blue-500 bg-blue-50 text-blue-700',
                        isDark && mergeProgress.type === 'success'
                            ? 'bg-green-900/20 text-green-400 border-green-500'
                            : isDark && mergeProgress.type === 'error'
                                ? 'bg-red-900/20 text-red-400 border-red-500'
                                : isDark && mergeProgress.type === 'info'
                                    ? 'bg-blue-900/20 text-blue-400 border-blue-500' : ''
                    )}>
                        <div className="flex items-center gap-2">
                            {isMerging && (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            )}
                            <span className="font-medium">
                                {mergeProgress.type === 'success' && '✅ Sucesso'}
                                {mergeProgress.type === 'error' && '❌ Erro'}
                                {mergeProgress.type === 'info' && '🔄 Processando'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm">{mergeProgress.message}</p>
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
                                <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-blue-500 navbar-bell-icon" />
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
                                <Grid className="w-5 h-5 navbar-settings-icon" />
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
                                <List className="w-5 h-5 navbar-message-icon" />
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
                                <Layers className="w-5 h-5 navbar-settings-icon" />
                            </Button>
                            {customPDFOrder.length > 0 && (
                                <Button
                                    onClick={resetCustomOrder}
                                    className={twMerge(
                                        'p-3',
                                        isDark ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'
                                    )}
                                    title="Resetar Ordem Personalizada"
                                >
                                    <RefreshCw className="w-5 h-5 navbar-settings-icon" />
                                </Button>
                            )}
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
                                        onClick={handleMergePDFs}
                                        disabled={selectedForMerge.size < 2 || isMerging}
                                        className={twMerge(
                                            'inline-flex items-center gap-2 text-xs transition-all',
                                            selectedForMerge.size >= 2 && !isMerging
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                                                : 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        {isMerging ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Layers className="w-3 h-3" />
                                        )}
                                        {isMerging ? 'Unificando...' : 'Unificar PDFs'}
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
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4 navbar-bell-icon" />
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
                        <SortableTelescopePDFList
                            items={getOrderedPDFs(filteredPdfs.filter((pdf, index, arr) => arr.findIndex(p => p.id === pdf.id) === index))}
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

            {/* Modal de Composição do Nome */}
            <Modal
                isOpen={showCompositionModal}
                onClose={() => setShowCompositionModal(false)}
                title="Composição do Nome do Arquivo Unificado"
                size="lg"
            >
                <div className="space-y-6">
                    <p className={twMerge(
                        'text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    )}>
                        Os arquivos serão nomeados no formato: <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">UNI_cdPessoa_numAtendimento_DDMMAAAA_hash.pdf</code>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Código Pessoa Física *</label>
                            <Input
                                type="text"
                                placeholder="Ex: 123456"
                                value={nomeComposicao.cdPessoaFisica}
                                onChange={(e) => setNomeComposicao(prev => ({
                                    ...prev,
                                    cdPessoaFisica: e.target.value
                                }))}
                                className={twMerge(
                                    'w-full',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Número Atendimento *</label>
                            <Input
                                type="text"
                                placeholder="Ex: ATD001"
                                value={nomeComposicao.numeroAtendimento}
                                onChange={(e) => setNomeComposicao(prev => ({
                                    ...prev,
                                    numeroAtendimento: e.target.value
                                }))}
                                className={twMerge(
                                    'w-full',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data Upload</label>
                            <Input
                                type="text"
                                value={nomeComposicao.dataUpload}
                                onChange={(e) => {
                                    // Permitir apenas números e máximo 8 dígitos
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 8)
                                    setNomeComposicao(prev => ({
                                        ...prev,
                                        dataUpload: value
                                    }))
                                }}
                                className={twMerge(
                                    'w-full',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                                placeholder="DDMMAAAA"
                                maxLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hash</label>
                            <Input
                                type="text"
                                value={nomeComposicao.hash}
                                onChange={(e) => setNomeComposicao(prev => ({
                                    ...prev,
                                    hash: e.target.value.toUpperCase()
                                }))}
                                className={twMerge(
                                    'w-full',
                                    isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                )}
                                placeholder="Ex: ABC123"
                                maxLength={8}
                            />
                        </div>
                    </div>

                    {/* Preview do nome */}
                    <div className={twMerge(
                        'mt-4 p-3 rounded-md border',
                        isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-100 border-gray-200'
                    )}>
                        <div className="text-sm">
                            <span className="font-medium">Nome do arquivo:</span>
                            <code className={twMerge(
                                'ml-2 px-2 py-1 rounded text-xs',
                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'
                            )}>
                                UNI_{nomeComposicao.cdPessoaFisica || 'cdPessoa'}_{nomeComposicao.numeroAtendimento || 'numAtendimento'}_{nomeComposicao.dataUpload}_{nomeComposicao.hash || 'hash'}.pdf
                            </code>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={() => setShowCompositionModal(false)}
                            variant="outline"
                            disabled={isMerging}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmMerge}
                            disabled={
                                isMerging ||
                                !nomeComposicao.cdPessoaFisica.trim() ||
                                !nomeComposicao.numeroAtendimento.trim()
                            }
                            className={twMerge(
                                'inline-flex items-center gap-2',
                                (isMerging ||
                                    !nomeComposicao.cdPessoaFisica.trim() ||
                                    !nomeComposicao.numeroAtendimento.trim())
                                    ? 'cursor-not-allowed opacity-50'
                                    : isDark
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                            )}
                        >
                            {isMerging ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Unificando...
                                </>
                            ) : (
                                <>
                                    <Layers className="w-4 h-4" />
                                    Confirmar Unificação
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
