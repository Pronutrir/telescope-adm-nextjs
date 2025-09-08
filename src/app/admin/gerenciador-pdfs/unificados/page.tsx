'use client'

import React, { useState, useEffect, useRef } from 'react'
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
    Eye,
    Layers,
    Loader2,
    Edit3,
    FolderOpen,
    Send,
    Database,
    X
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { UnifiedPDFItem, ViewMode, PDFEditState, PDFItem } from '@/types/pdf'
import PDFManagerService, { SharePointPdfItem } from '@/services/pdfManager/pdfManagerService'
import PDFService from '@/services/pdf/pdfService'
import { toast } from 'react-hot-toast'

const UnificadosGerenciadorPDFsPage = () => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

    // Função para converter SharePointPdfItem para UnifiedPDFItem
    const mapToUnifiedPDFItem = (item: SharePointPdfItem): UnifiedPDFItem => {
        const fileName = item.name || 'PDF sem nome'

        // Função simples para formatar tamanho de arquivo
        const formatFileSize = (bytes: number): string => {
            if (bytes === 0) return '0 B'
            const k = 1024
            const sizes = [ 'B', 'KB', 'MB', 'GB' ]
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[ i ]
        }

        return {
            id: item.id || '',
            title: fileName.replace('.pdf', ''),
            url: item.downloadUrl || '',
            fileName: fileName,
            size: formatFileSize(item.size || 0),
            uploadDate: item.lastModified || new Date().toISOString(),
            description: `PDF unificado criado em ${PDFManagerService.formatDate(item.lastModified || new Date().toISOString())}`,
            sourceFiles: [], // API não retorna essa informação
            pageCount: 0 // API não retorna essa informação
        }
    }

    // Estados
    const [ mounted, setMounted ] = useState(false)
    const [ unifiedPdfs, setUnifiedPdfs ] = useState<UnifiedPDFItem[]>([])
    const [ viewMode, setViewMode ] = useState<ViewMode>('grid')
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ isLoading, setIsLoading ] = useState(true)

    // Estado para edição de páginas do PDF
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

    // Estados para modal de envio para TASY
    const [ tasyModal, setTasyModal ] = useState<{
        isOpen: boolean
        selectedPdf?: UnifiedPDFItem
        searchTerm: string
        contasPaciente: Array<{
            numeroAtendimento: string
            contaPaciente: string
            displayText: string
        }>
        selectedConta: string
        isLoading: boolean
        isSending: boolean
        isSearching: boolean
    }>({
        isOpen: false,
        searchTerm: '',
        contasPaciente: [],
        selectedConta: '',
        isLoading: false,
        isSending: false,
        isSearching: false
    })

    // Ref para debounce da busca
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    // Ref para controlar o AbortController das requisições
    const abortControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
        setMounted(true)
        loadUnifiedPdfs()
    }, [])

    const loadUnifiedPdfs = async () => {
        try {
            setIsLoading(true)

            console.log('📚 [UnificadosGerenciadorPDFsPage] Carregando PDFs unificados...')

            // Chamada real para a API
            const sharePointItems = await PDFManagerService.listarPDFsUnificados()

            console.log('✅ [UnificadosGerenciadorPDFsPage] PDFs unificados carregados:', sharePointItems.length)

            // Converter para UnifiedPDFItem
            const unifiedPdfs = sharePointItems.map(mapToUnifiedPDFItem)

            setUnifiedPdfs(unifiedPdfs)
        } catch (error) {
            console.error('❌ [UnificadosGerenciadorPDFsPage] Erro ao carregar PDFs unificados:', error)

            // Fallback para dados mock em caso de erro
            console.warn('⚠️ [UnificadosGerenciadorPDFsPage] Usando dados de demonstração')
            const mockUnifiedPdfs: UnifiedPDFItem[] = [
                {
                    id: 'demo-unified-1',
                    title: 'PDF Unificado - Demonstração',
                    url: '#',
                    fileName: 'demo-unificado.pdf',
                    size: '1.5 MB',
                    uploadDate: new Date().toISOString(),
                    description: 'Dados de demonstração - API indisponível',
                    sourceFiles: [ 'arquivo1.pdf', 'arquivo2.pdf' ],
                    pageCount: 25
                }
            ]

            setUnifiedPdfs(mockUnifiedPdfs)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredPdfs = unifiedPdfs.filter(pdf =>
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pdf.description && pdf.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const openViewer = (pdf: UnifiedPDFItem) => {
        if (pdf.url && pdf.url !== '#') {
            // Abrir PDF em nova aba
            window.open(pdf.url, '_blank')
        } else {
            console.warn('URL do PDF não disponível:', pdf)
            alert('URL do PDF não está disponível para visualização.')
        }
    }

    // Abrir modal de edição de páginas do PDF
    const handleEditPDF = async (pdf: UnifiedPDFItem) => {
        // Converter UnifiedPDFItem para PDFItem completo esperado pelo PDFEditState
        const pdfForEdit: PDFItem = {
            id: pdf.id,
            title: pdf.title,
            description: pdf.description || '',
            fileName: pdf.fileName,
            url: pdf.url,
            size: pdf.size,
            uploadDate: pdf.uploadDate
        }

        setEditState({
            isOpen: true,
            selectedPdf: pdfForEdit,
            isLoading: false,
            isLoadingPages: true,
            form: {
                title: pdf.title,
                description: pdf.description || '',
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

    // Fechar modal de edição de páginas
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
                title: editState.selectedPdf.title,
                description: editState.selectedPdf.description || '',
                fileName: editState.form.fileName,
                pagesToKeep: selectedPages.map(page => page.pageNumber)
            }

            const response = await PDFService.editPDF(editData)

            if (response.success) {
                alert(response.message || `PDF editado com sucesso! ${selectedPages.length} páginas mantidas.`)
                closeEditModal()

                // Recarregar a lista de PDFs unificados
                console.log('🔄 Recarregando lista de PDFs unificados após edição...')
                await loadUnifiedPdfs()

            } else {
                alert(response.message || 'Erro ao editar PDF')
            }
        } catch (error) {
            console.error('Erro ao editar PDF:', error)
            alert(error instanceof Error ? error.message : 'Erro ao editar PDF')

            // Mesmo em caso de erro, recarregar a lista para garantir consistência
            try {
                console.log('🔄 Recarregando lista de PDFs após erro...')
                await loadUnifiedPdfs()
            } catch (reloadError) {
                console.error('Erro ao recarregar lista após falha:', reloadError)
            }
        } finally {
            setEditState(prev => ({ ...prev, isLoading: false }))
        }
    }

    // Funções para o modal TASY
    const openTasyModal = (pdf: UnifiedPDFItem) => {
        console.log('🔓 Abrindo modal TASY para:', pdf.fileName)

        setTasyModal(prev => ({
            ...prev,
            isOpen: true,
            selectedPdf: pdf,
            searchTerm: '',
            contasPaciente: [],
            selectedConta: '',
            isLoading: false,
            isSearching: false,
            isSending: false
        }))

        // Extrair número de atendimento do nome do arquivo
        const numeroAtendimento = extractAtendimentoFromFileName(pdf.fileName)

        if (numeroAtendimento) {
            console.log('✅ Número de atendimento extraído:', numeroAtendimento)
            toast.loading('🔍 Buscando conta do paciente...')
            // Buscar automaticamente a conta do paciente
            searchContasPaciente(numeroAtendimento)
        } else {
            console.warn('⚠️ Não foi possível extrair número de atendimento do nome do arquivo:', pdf.fileName)
            toast.error('Número de atendimento não encontrado no nome do arquivo')
        }
    }

    // Função para extrair número de atendimento do nome do arquivo
    const extractAtendimentoFromFileName = (fileName: string): string | null => {
        try {
            // Remove extensão .pdf se existir
            const nameWithoutExtension = fileName.replace(/\.pdf$/i, '')

            // Divide por underscore e pega a terceira parte
            const parts = nameWithoutExtension.split('_')

            if (parts.length >= 3) {
                const numeroAtendimento = parts[ 2 ]
                console.log('📄 [TASY] Número de atendimento extraído:', numeroAtendimento, 'do arquivo:', fileName)
                return numeroAtendimento
            }

            console.warn('⚠️ [TASY] Não foi possível extrair número de atendimento do arquivo:', fileName)
            return null
        } catch (error) {
            console.error('❌ [TASY] Erro ao extrair número de atendimento:', error)
            return null
        }
    }

    const closeTasyModal = () => {
        // Limpar timeout se existir
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        // Abortar requisições pendentes
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }

        setTasyModal(prev => ({
            ...prev,
            isOpen: false,
            selectedPdf: undefined,
            searchTerm: '',
            contasPaciente: [],
            selectedConta: '',
            isLoading: false,
            isSearching: false,
            isSending: false
        }))
    }

    // Função para fazer download do PDF do SharePoint para o NAS via API proxy
    const downloadPdfFromSharePoint = async (pdfFile: UnifiedPDFItem): Promise<string> => {
        try {
            console.log('📥 Transferindo PDF do SharePoint para o NAS via proxy:', pdfFile.url)

            const response = await fetch('/api/nas-transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sharePointUrl: pdfFile.url
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(`Erro na transferência: ${errorData.mensagem || errorData.message || 'Erro desconhecido do servidor proxy'}`)
            }

            const result = await response.json()

            if (!result.sucesso) {
                throw new Error(`A transferência para o NAS falhou: ${result.mensagem || 'A API NAS não retornou uma mensagem de sucesso.'}`)
            }

            console.log('✅ Transferência para o NAS concluída. Caminho do arquivo:', result.caminhoCompleto)
            return result.caminhoCompleto

        } catch (error) {
            console.error('❌ Erro ao transferir PDF do SharePoint para o NAS:', error)
            // Re-lança o erro para que a função que a chamou (sendPdfToTasy) possa tratá-lo e exibir o toast de erro.
            throw error
        }
    }

    const searchContasPaciente = async (termo: string) => {
        if (!termo.trim()) {
            setTasyModal(prev => ({
                ...prev,
                contasPaciente: [],
                isSearching: false
            }))
            return
        }

        // Abortar requisição anterior se existir
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // Criar novo AbortController
        abortControllerRef.current = new AbortController()

        setTasyModal(prev => ({
            ...prev,
            isSearching: true,
            searchTerm: termo
        }))

        try {
            // Trabalhar com um único número de atendimento
            const numeroAtendimento = termo.trim()

            console.log('🔍 Buscando conta para atendimento:', numeroAtendimento)

            const response = await fetch(`/api/tasy/conta-paciente?numeroAtendimento=${numeroAtendimento}`, {
                signal: abortControllerRef.current.signal
            })

            if (response.ok) {
                const data = await response.json()

                // Preparar estrutura para múltiplas contas
                const contasEncontradas: Array<{
                    numeroAtendimento: string
                    contaPaciente: string
                    displayText: string
                }> = []

                // Verificar se a API retorna múltiplas contas em um array
                if (Array.isArray(data.contasPaciente)) {
                    // Caso: array de contas [2549371, 2614471]
                    data.contasPaciente.forEach((conta: string | number) => {
                        contasEncontradas.push({
                            numeroAtendimento: data.numeroAtendimento,
                            contaPaciente: String(conta),
                            displayText: `Atend: ${data.numeroAtendimento} → Conta: ${conta}`
                        })
                    })
                } else if (data.contaPaciente) {
                    // Caso: uma única conta direta
                    contasEncontradas.push({
                        numeroAtendimento: data.numeroAtendimento,
                        contaPaciente: String(data.contaPaciente),
                        displayText: `Atend: ${data.numeroAtendimento} → Conta: ${data.contaPaciente}`
                    })
                }

                setTasyModal(prev => ({
                    ...prev,
                    contasPaciente: contasEncontradas,
                    selectedConta: contasEncontradas.length === 1 ? contasEncontradas[ 0 ].contaPaciente : '', // Auto-selecionar apenas se for uma única conta
                    isSearching: false
                }))

                if (contasEncontradas.length === 1) {
                    toast.success(`✅ Conta encontrada: ${contasEncontradas[ 0 ].contaPaciente}`)
                } else {
                    toast.success(`✅ ${contasEncontradas.length} contas encontradas para seleção`)
                }
            } else {
                console.warn(`⚠️ Conta não encontrada para atendimento: ${numeroAtendimento}`)

                setTasyModal(prev => ({
                    ...prev,
                    contasPaciente: [],
                    selectedConta: '',
                    isSearching: false
                }))

                toast.error(`❌ Nenhuma conta encontrada para o atendimento: ${numeroAtendimento}`)
            }

        } catch (error) {
            // Não mostrar erro se a requisição foi cancelada
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('🔄 Busca cancelada (requisição mais nova iniciada)')
                return
            }

            console.error('❌ Erro na busca:', error)
            setTasyModal(prev => ({
                ...prev,
                contasPaciente: [],
                selectedConta: '',
                isSearching: false
            }))
            toast.error('❌ Erro ao buscar conta do paciente')
        }
    }

    const sendPdfToTasy = async () => {
        if (!tasyModal.selectedConta || !tasyModal.selectedPdf) return

        const contaSelecionada = tasyModal.contasPaciente.find(c => c.contaPaciente === tasyModal.selectedConta)
        if (!contaSelecionada) return

        setTasyModal(prev => ({ ...prev, isSending: true }))

        let downloadToastId: any
        let sendToastId: any

        try {
            // Etapa 1: Download do PDF do SharePoint
            downloadToastId = toast.loading(
                `📥 Fazendo download do PDF "${tasyModal.selectedPdf.fileName}" do SharePoint...`
            )

            const caminhoArquivo = await downloadPdfFromSharePoint(tasyModal.selectedPdf)

            // Remover toast de download e mostrar sucesso
            toast.dismiss(downloadToastId)
            toast.success('✅ Download concluído com sucesso!')

            // Etapa 2: Envio para TASY
            sendToastId = toast.loading(
                `📤 Enviando PDF para a conta médica ${contaSelecionada.contaPaciente} no TASY...`
            )

            // Chamada real para a API do TASY
            const response = await fetch('/api/tasy/enviar-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contaPaciente: contaSelecionada.contaPaciente,
                    textoAnexo: tasyModal.selectedPdf.fileName,
                    nomeArquivo: tasyModal.selectedPdf.fileName,
                    numeroAtendimento: contaSelecionada.numeroAtendimento,
                    caminhoArquivo: caminhoArquivo // Incluir o caminho do arquivo baixado
                })
            })

            // Remover toast de envio
            toast.dismiss(sendToastId)

            if (response.ok) {
                const result = await response.json()

                toast.success(
                    `🎉 PDF "${tasyModal.selectedPdf.fileName}" enviado com sucesso para a conta médica ${contaSelecionada.contaPaciente} no TASY!`,
                    { duration: 6000 }
                )

                console.log('✅ Processo completo:', {
                    download: caminhoArquivo,
                    tasyResponse: result
                })

                closeTasyModal()
            } else {
                const errorData = await response.json()
                console.error('❌ Erro da API TASY:', errorData)

                toast.error(
                    `❌ Erro ao enviar PDF para o TASY: ${errorData.error || 'Erro desconhecido'}`,
                    { duration: 5000 }
                )
            }

        } catch (error) {
            console.error('❌ Erro no processo de envio:', error)

            // Limpar toasts pendentes
            if (downloadToastId) toast.dismiss(downloadToastId)
            if (sendToastId) toast.dismiss(sendToastId)

            // Determinar se o erro foi no download ou no envio
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

            if (errorMessage.includes('download') || errorMessage.includes('SharePoint')) {
                toast.error(
                    `❌ Erro no download do SharePoint: ${errorMessage}`,
                    { duration: 6000 }
                )
            } else {
                toast.error(
                    `❌ Erro ao processar envio: ${errorMessage}`,
                    { duration: 6000 }
                )
            }
        } finally {
            setTasyModal(prev => ({ ...prev, isSending: false }))
        }
    }

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
                {/* Header centralizado */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Button
                            onClick={() => window.history.back()}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar para Biblioteca
                        </Button>
                    </div>

                    <h1 className={twMerge(
                        'text-4xl font-bold',
                        isDark ? 'text-white' : 'text-slate-800'
                    )}>
                        📚 PDFs Unificados
                    </h1>

                    <p className={twMerge(
                        'text-lg',
                        isDark ? 'text-gray-300' : 'text-muted-foreground'
                    )}>
                        {isLoading ? 'Carregando...' : `${filteredPdfs.length} documento${filteredPdfs.length > 1 ? 's' : ''} unificado${filteredPdfs.length > 1 ? 's' : ''} disponív${filteredPdfs.length > 1 ? 'eis' : 'el'}`}
                    </p>
                </div>

                {/* Barra de ferramentas */}
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
                                placeholder="🔍 Buscar PDFs unificados..."
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
                                    onClick={() => setSearchTerm('')}
                                    className={twMerge(
                                        'absolute right-3 top-1/2 transform -translate-y-1/2',
                                        isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                                    )}
                                >
                                    ×
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
                                    onClick={() => setViewMode('grid')}
                                    className={twMerge(
                                        'p-2 rounded-l-lg transition-all duration-200 mr-1',
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
                                        'p-2 rounded-r-lg transition-all duration-200 ml-1',
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

                {/* Conteúdo principal */}
                <div className="min-h-0">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className={twMerge(
                                    'p-6 rounded-2xl animate-pulse',
                                    isDark ? 'bg-gray-800/50' : 'bg-gray-100'
                                )}>
                                    <div className={twMerge(
                                        'h-4 rounded mb-4',
                                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                                    )} />
                                    <div className={twMerge(
                                        'h-3 rounded mb-2 w-2/3',
                                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                                    )} />
                                    <div className={twMerge(
                                        'h-3 rounded w-1/2',
                                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                                    )} />
                                </div>
                            ))}
                        </div>
                    ) : filteredPdfs.length === 0 ? (
                        <div className={twMerge(
                            'text-center py-20 px-6 rounded-2xl',
                            isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200',
                            'border'
                        )}>
                            <div className="max-w-md mx-auto space-y-6">
                                <div className={twMerge(
                                    'w-24 h-24 rounded-full mx-auto flex items-center justify-center text-6xl',
                                    isDark ? 'bg-gray-700/50' : 'bg-gray-200/50'
                                )}>
                                    📄
                                </div>
                                <h3 className={twMerge(
                                    'text-xl font-semibold',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    {searchTerm ? 'Nenhum PDF encontrado' : 'Nenhum PDF unificado'}
                                </h3>
                                <p className={twMerge(
                                    'text-base leading-relaxed',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    {searchTerm
                                        ? `Não foi possível encontrar PDFs que correspondam à busca "${searchTerm}".`
                                        : 'Ainda não há PDFs unificados disponíveis no sistema. Eles aparecerão aqui quando forem criados.'
                                    }
                                </p>
                                {searchTerm ? (
                                    <Button
                                        onClick={() => setSearchTerm('')}
                                        className="bg-purple-500 hover:bg-purple-600 text-white"
                                    >
                                        Limpar filtro
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => window.history.back()}
                                        className="bg-purple-500 hover:bg-purple-600 text-white"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Voltar para Biblioteca
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPdfs.map((pdf) => (
                                <div
                                    key={pdf.id}
                                    className={twMerge(
                                        'group relative rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
                                        'border-2 shadow-lg',
                                        isDark
                                            ? 'bg-gray-800/90 border-gray-700/50 hover:border-purple-400/60 hover:shadow-purple-500/20'
                                            : 'bg-white/95 border-gray-200/50 hover:border-purple-300/60 hover:shadow-purple-400/20'
                                    )}
                                >
                                    {/* Header do Card */}
                                    <div className={twMerge(
                                        'p-5 pb-3 border-b',
                                        isDark ? 'border-gray-700/50' : 'border-gray-200/50'
                                    )}>
                                        <div className="flex items-center justify-between mb-3">
                                            {/* Ícone do PDF */}
                                            <div className={twMerge(
                                                'p-2.5 rounded-xl',
                                                isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                                            )}>
                                                <FileText className="w-6 h-6 text-purple-500" />
                                            </div>

                                            {/* Indicador de status/ação */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Título e Descrição */}
                                        <h3 className={twMerge(
                                            'font-semibold text-base mb-2 line-clamp-2',
                                            isDark ? 'text-white' : 'text-gray-900'
                                        )}>
                                            {pdf.title}
                                        </h3>
                                        <p className={twMerge(
                                            'text-sm leading-relaxed line-clamp-2',
                                            isDark ? 'text-gray-300' : 'text-gray-600'
                                        )}>
                                            {pdf.description || 'PDF unificado sem descrição'}
                                        </p>
                                    </div>

                                    {/* Conteúdo do Card */}
                                    <div className="p-5 pt-3">
                                        {/* Metadados */}
                                        <div className="space-y-2 mb-4">
                                            <div className={twMerge(
                                                'text-xs flex items-center gap-2',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                <FolderOpen className="w-3 h-3" />
                                                <span className="truncate">{pdf.fileName}</span>
                                            </div>
                                            <div className={twMerge(
                                                'text-xs flex items-center justify-between',
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            )}>
                                                <span className="flex items-center gap-1">
                                                    📊 {pdf.size}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    📅 {PDFManagerService.formatDate(pdf.uploadDate)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Ações do card */}
                                        <div className={twMerge(
                                            'pt-3 border-t',
                                            isDark ? 'border-gray-700/50' : 'border-gray-200'
                                        )}>
                                            <div className="flex gap-2">
                                                <button
                                                    className={twMerge(
                                                        'flex-1 flex items-center justify-center gap-2 text-sm h-10 font-semibold rounded-xl transition-all duration-200 shadow-sm border',
                                                        isDark
                                                            ? 'bg-blue-600/90 text-white hover:bg-blue-600 border-blue-500/50 hover:shadow-blue-500/25 hover:shadow-lg'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500 hover:shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5'
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openViewer(pdf)
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>Ver</span>
                                                </button>

                                                <button
                                                    className={twMerge(
                                                        'flex-1 flex items-center justify-center gap-2 text-sm h-10 font-semibold rounded-xl transition-all duration-200 shadow-sm border',
                                                        isDark
                                                            ? 'bg-green-600/90 text-white hover:bg-green-600 border-green-500/50 hover:shadow-green-500/25 hover:shadow-lg'
                                                            : 'bg-green-600 text-white hover:bg-green-700 border-green-500 hover:shadow-green-600/25 hover:shadow-lg hover:-translate-y-0.5'
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleEditPDF(pdf)
                                                    }}
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    <span>Editar</span>
                                                </button>

                                                <button
                                                    className={twMerge(
                                                        'flex-1 flex items-center justify-center gap-2 text-sm h-10 font-semibold rounded-xl transition-all duration-200 shadow-sm border',
                                                        isDark
                                                            ? 'bg-purple-600/90 text-white hover:bg-purple-600 border-purple-500/50 hover:shadow-purple-500/25 hover:shadow-lg'
                                                            : 'bg-purple-600 text-white hover:bg-purple-700 border-purple-500 hover:shadow-purple-600/25 hover:shadow-lg hover:-translate-y-0.5'
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openTasyModal(pdf)
                                                    }}
                                                    title="Enviar para TASY"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    <span>TASY</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Visualização em lista */
                        <div className="space-y-3">
                            {filteredPdfs.map((pdf) => (
                                <div
                                    key={pdf.id}
                                    className={twMerge(
                                        'group flex items-center gap-4 p-5 rounded-2xl border-2 backdrop-blur-sm',
                                        'transition-all duration-300 hover:scale-[1.01] hover:shadow-xl',
                                        isDark
                                            ? 'bg-gray-800/90 border-gray-700/50 hover:border-purple-400/60 hover:shadow-purple-500/20'
                                            : 'bg-white/95 border-gray-200/50 hover:border-purple-300/60 hover:shadow-purple-400/20'
                                    )}
                                >
                                    {/* Ícone do PDF */}
                                    <div className={twMerge(
                                        'flex-shrink-0 p-3 rounded-xl',
                                        isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                                    )}>
                                        <FileText className="w-8 h-8 text-purple-500" />
                                    </div>

                                    {/* Informações principais */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={twMerge(
                                            'font-semibold text-lg mb-1 truncate',
                                            isDark ? 'text-white' : 'text-gray-900'
                                        )}>
                                            {pdf.title}
                                        </h3>
                                        <p className={twMerge(
                                            'text-sm mb-2 line-clamp-1',
                                            isDark ? 'text-gray-300' : 'text-gray-600'
                                        )}>
                                            {pdf.description || 'PDF unificado sem descrição'}
                                        </p>
                                        <div className={twMerge(
                                            'text-xs flex items-center gap-4 flex-wrap',
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        )}>
                                            <span className="flex items-center gap-1">
                                                <FolderOpen className="w-3 h-3" />
                                                {pdf.fileName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                📊 {pdf.size}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                📅 {PDFManagerService.formatDate(pdf.uploadDate)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            className={twMerge(
                                                'flex items-center justify-center gap-2 text-sm h-10 px-4 font-semibold rounded-xl transition-all duration-200 shadow-sm border',
                                                isDark
                                                    ? 'bg-blue-600/90 text-white hover:bg-blue-600 border-blue-500/50 hover:shadow-blue-500/25 hover:shadow-lg'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500 hover:shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5'
                                            )}
                                            onClick={() => openViewer(pdf)}
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>Ver</span>
                                        </button>
                                        <button
                                            className={twMerge(
                                                'flex items-center justify-center gap-2 text-sm h-10 px-4 font-semibold rounded-xl transition-all duration-200 shadow-sm border',
                                                isDark
                                                    ? 'bg-green-600/90 text-white hover:bg-green-600 border-green-500/50 hover:shadow-green-500/25 hover:shadow-lg'
                                                    : 'bg-green-600 text-white hover:bg-green-700 border-green-500 hover:shadow-green-600/25 hover:shadow-lg hover:-translate-y-0.5'
                                            )}
                                            onClick={() => handleEditPDF(pdf)}
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            <span>Editar</span>
                                        </button>
                                        <button
                                            className={twMerge(
                                                'flex items-center justify-center gap-2 text-sm h-10 px-4 font-semibold rounded-xl transition-all duration-200 shadow-sm border',
                                                isDark
                                                    ? 'bg-purple-600/90 text-white hover:bg-purple-600 border-purple-500/50 hover:shadow-purple-500/25 hover:shadow-lg'
                                                    : 'bg-purple-600 text-white hover:bg-purple-700 border-purple-500 hover:shadow-purple-600/25 hover:shadow-lg hover:-translate-y-0.5'
                                            )}
                                            onClick={() => openTasyModal(pdf)}
                                            title="Enviar para TASY"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>TASY</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Edição de Páginas do PDF */}
            <Modal
                isOpen={editState.isOpen}
                onClose={closeEditModal}
                title="Editar PDF"
                size="xl"
            >
                <div className="space-y-6">
                    {/* Formulário de Edição - Nome do Arquivo */}
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

                    {/* Visualização e Seleção de Páginas */}
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
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

            {/* Modal de Envio para TASY */}
            <Modal
                isOpen={tasyModal.isOpen}
                onClose={closeTasyModal}
                title="Enviar PDF para TASY"
                size="lg"
            >
                <div className="space-y-6">
                    {/* Informações do PDF Selecionado */}
                    {tasyModal.selectedPdf && (
                        <div className={twMerge(
                            'p-4 rounded-lg border',
                            isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                        )}>
                            <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-purple-500" />
                                <div className="flex-1">
                                    <h4 className={twMerge(
                                        'font-medium text-sm',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        {tasyModal.selectedPdf.title}
                                    </h4>
                                    <p className={twMerge(
                                        'text-xs mt-1',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {tasyModal.selectedPdf.fileName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Campo de busca por número de atendimento */}
                    <div className="space-y-2">
                        <label className={twMerge(
                            'block text-sm font-medium',
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Número de Atendimento
                        </label>

                        {/* Mostrar se foi extraído do arquivo */}
                        {tasyModal.selectedPdf && extractAtendimentoFromFileName(tasyModal.selectedPdf.fileName) && (
                            <div className={twMerge(
                                'text-xs p-2 rounded border',
                                isDark ? 'bg-green-900/20 border-green-700 text-green-300' : 'bg-green-50 border-green-200 text-green-700'
                            )}>
                                ✅ Número extraído automaticamente do arquivo: <strong>{extractAtendimentoFromFileName(tasyModal.selectedPdf.fileName)}</strong>
                            </div>
                        )}

                        <input
                            type="text"
                            value={tasyModal.searchTerm}
                            onChange={(e) => {
                                const value = e.target.value.trim()
                                // Permitir apenas números
                                if (value === '' || /^\d+$/.test(value)) {
                                    setTasyModal(prev => ({ ...prev, searchTerm: value }))

                                    // Debounce para evitar muitas requisições
                                    if (searchTimeoutRef.current) {
                                        clearTimeout(searchTimeoutRef.current)
                                    }
                                    searchTimeoutRef.current = setTimeout(() => {
                                        searchContasPaciente(value)
                                    }, 500)
                                }
                            }}
                            placeholder="Digite o número de atendimento (apenas números, ex: 257898)"
                            className={twMerge(
                                'w-full px-3 py-2 border rounded-md text-sm',
                                isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            )}
                            disabled={tasyModal.isSending}
                        />
                        {tasyModal.isSearching && (
                            <p className="text-sm text-blue-600 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Buscando contas...
                            </p>
                        )}
                    </div>

                    {/* Select de Conta Encontrada */}
                    {tasyModal.contasPaciente.length > 0 && (
                        <div className="space-y-2">
                            <label className={twMerge(
                                'block text-sm font-medium',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                {tasyModal.contasPaciente.length === 1 ? 'Conta Médica Encontrada' : `Contas Médicas Encontradas (${tasyModal.contasPaciente.length})`}
                            </label>
                            <select
                                value={tasyModal.selectedConta}
                                onChange={(e) => setTasyModal(prev => ({ ...prev, selectedConta: e.target.value }))}
                                className={twMerge(
                                    'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm',
                                    isDark
                                        ? 'bg-gray-800 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                )}
                                disabled={tasyModal.isSending}
                            >
                                <option value="">
                                    {tasyModal.contasPaciente.length === 1
                                        ? 'Conta médica selecionada automaticamente'
                                        : 'Selecione uma conta médica...'
                                    }
                                </option>
                                {tasyModal.contasPaciente.map((conta, index) => (
                                    <option key={`${conta.contaPaciente}-${index}`} value={conta.contaPaciente}>
                                        {conta.displayText}
                                    </option>
                                ))}
                            </select>
                            <p className={twMerge(
                                'text-xs',
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            )}>
                                {tasyModal.contasPaciente.length === 1
                                    ? `✅ Conta selecionada automaticamente: ${tasyModal.contasPaciente[ 0 ].contaPaciente}`
                                    : `${tasyModal.contasPaciente.length} contas encontradas - selecione uma para continuar`
                                }
                            </p>

                            {/* Aviso quando não há conta selecionada para múltiplas opções */}
                            {tasyModal.contasPaciente.length > 1 && !tasyModal.selectedConta && (
                                <div className={twMerge(
                                    'text-xs p-2 rounded border',
                                    isDark ? 'bg-yellow-900/20 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                )}>
                                    ⚠️ Selecione uma conta médica para habilitar o envio
                                </div>
                            )}
                        </div>
                    )}

                    {/* Conta Selecionada */}
                    {tasyModal.selectedConta && (
                        <div className={twMerge(
                            'p-4 rounded-lg border',
                            isDark ? 'bg-purple-900/20 border-purple-600/50' : 'bg-purple-50 border-purple-200'
                        )}>
                            <h4 className={twMerge(
                                'text-sm font-medium mb-2',
                                isDark ? 'text-purple-300' : 'text-purple-700'
                            )}>
                                Conta Médica Selecionada
                            </h4>
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-purple-500" />
                                <span className={twMerge(
                                    'font-mono text-sm',
                                    isDark ? 'text-purple-300' : 'text-purple-700'
                                )}>
                                    {tasyModal.contasPaciente.find(c => c.contaPaciente === tasyModal.selectedConta)?.displayText}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <Button
                            variant="outline"
                            onClick={closeTasyModal}
                            disabled={tasyModal.isSending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={sendPdfToTasy}
                            disabled={!tasyModal.selectedConta || tasyModal.isSending}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {tasyModal.isSending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Enviar para TASY
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageWrapper>
    )
}

export default UnificadosGerenciadorPDFsPage
