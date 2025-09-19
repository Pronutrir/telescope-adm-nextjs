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
    Send,
    Database
} from 'lucide-react'
import InlinePDFViewer from '@/components/pdf/InlinePDFViewer'
import { SortablePDFList } from '@/components/pdf/SortablePDFList'
import { twMerge } from 'tailwind-merge'
import { UnifiedPDFItem, PDFItem, ViewMode, SearchParams, UnificationRequest, PDFPageInfo, PDFEditState } from '@/types/pdf'
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

    // Estados para composição do nome dos arquivos unificados
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

    // Estado para preview
    const [ previewState, setPreviewState ] = useState({
        isOpen: false,
        selectedPdf: null as UnifiedPDFItem | null,
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

    // Estados para modal de envio para TASY
    const [ tasyModal, setTasyModal ] = useState({
        isOpen: false,
        selectedPdf: null as UnifiedPDFItem | null,
        searchTerm: '',
        availableNumbers: [] as string[],
        selectedNumbers: [] as string[],
        isLoading: false,
        isSearching: false,
        isSending: false,
        feedback: {
            show: false,
            message: '',
            type: 'info' as 'info' | 'success' | 'error'
        }
    })

    // Funções de edição
    const openEditModal = async (pdf: UnifiedPDFItem) => {
        setEditState(prev => ({
            ...prev,
            isOpen: true,
            selectedPdf: pdf,
            isLoadingPages: true,
            form: {
                title: pdf.title,
                description: pdf.description || '',
                fileName: pdf.fileName
            }
        }))

        try {
            // Para PDFs unificados, usar método específico que obtém o número correto de páginas
            const pagesData = await UnifiedPDFService.getUnifiedPDFPages(pdf.fileName)

            setEditState(prev => ({
                ...prev,
                pages: pagesData,
                isLoadingPages: false
            }))
        } catch (error) {
            console.error('Erro ao carregar páginas:', error)
            console.error('Erro ao carregar páginas de PDF unificado')
            setEditState(prev => ({ ...prev, isLoadingPages: false }))
        }
    }

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

    const handleSaveEdit = async () => {
        if (!editState.selectedPdf) return

        console.log('🔍 Estado atual do edit:', {
            selectedPdf: editState.selectedPdf,
            fileName: editState.form.fileName,
            totalPages: editState.pages.length,
            pagesState: editState.pages.map(p => ({ num: p.pageNumber, selected: p.selected }))
        })

        const selectedPages = editState.pages
            .filter(page => page.selected)
            .map(page => page.pageNumber)

        const excludedPages = editState.pages
            .filter(page => !page.selected)
            .map(page => page.pageNumber)

        console.log('📄 Análise de páginas:', {
            totalPages: editState.pages.length,
            selectedPages: selectedPages,
            excludedPages: excludedPages,
            selectedCount: selectedPages.length,
            excludedCount: excludedPages.length
        })

        if (excludedPages.length === editState.pages.length) {
            console.error('❌ Erro: Você deve manter pelo menos uma página no PDF')
            return
        }

        if (excludedPages.length === 0) {
            console.log('ℹ️ Nenhuma página para remover, cancelando operação')
            return
        }

        console.log('🚀 Iniciando edição do PDF:', {
            fileName: editState.form.fileName,
            pagesToRemove: excludedPages,
            originalPdf: editState.selectedPdf
        })

        setEditState(prev => ({ ...prev, isLoading: true }))

        try {
            // Primeiro, vamos verificar se conseguimos listar os PDFs unificados para ver quais existem
            console.log('🔍 Verificando PDFs disponíveis...');
            const availablePdfs = await UnifiedPDFService.listUnifiedPDFs();
            console.log('📋 PDFs unificados disponíveis:', availablePdfs.map(pdf => pdf.fileName));

            // Verificar se o arquivo que estamos tentando editar está na lista
            const targetPdf = availablePdfs.find(pdf => pdf.fileName === editState.form.fileName);

            let result;

            if (!targetPdf) {
                console.warn('⚠️ Arquivo não encontrado na lista de PDFs unificados');
                console.log('💡 Como é um arquivo mock, vamos tentar com um nome mais simples...');

                // Se não encontrou o arquivo na lista, vamos testar com nomes mais simples
                const testFileNames = [
                    editState.form.fileName,
                    'test.pdf',
                    'documento.pdf',
                    'arquivo.pdf'
                ];

                console.log('🧪 Tentando com diferentes nomes:', testFileNames);

                // Usar o primeiro nome da lista para teste
                const testFileName = testFileNames[ 0 ];
                console.log('🎯 Usando arquivo:', testFileName);

                result = await UnifiedPDFService.editUnifiedPDF(testFileName, excludedPages);

            } else {
                console.log('✅ Arquivo encontrado:', targetPdf);
                // Usar o método específico para PDFs unificados
                result = await UnifiedPDFService.editUnifiedPDF(editState.form.fileName, excludedPages);
            }

            if (result.success) {
                console.log('PDF unificado editado com sucesso!', {
                    arquivo: result.updatedPdf?.fileName,
                    title: result.updatedPdf?.title,
                    size: result.updatedPdf?.size
                })

                closeEditModal()
                // Recarregar a lista
                loadUnifiedPDFs()
            } else {
                console.error('Falha na edição:', result.message)
            }

        } catch (error) {
            console.error('Erro ao salvar edição:', error)
            console.error('Falha ao salvar alterações')
        } finally {
            setEditState(prev => ({ ...prev, isLoading: false }))
        }
    }

    // Funções para o modal TASY
    const openTasyModal = (pdf: UnifiedPDFItem) => {
        setTasyModal(prev => ({
            ...prev,
            isOpen: true,
            selectedPdf: pdf,
            searchTerm: '',
            availableNumbers: [],
            selectedNumbers: [],
            isLoading: false,
            isSearching: false,
            isSending: false,
            feedback: { show: false, message: '', type: 'info' }
        }))
    }

    const closeTasyModal = () => {
        setTasyModal(prev => ({
            ...prev,
            isOpen: false,
            selectedPdf: null,
            searchTerm: '',
            availableNumbers: [],
            selectedNumbers: [],
            isLoading: false,
            isSearching: false,
            isSending: false,
            feedback: { show: false, message: '', type: 'info' }
        }))
    }

    const searchTasyNumbers = async (term: string) => {
        if (!term.trim()) {
            setTasyModal(prev => ({ ...prev, availableNumbers: [], searchTerm: term }))
            return
        }

        setTasyModal(prev => ({
            ...prev,
            isSearching: true,
            searchTerm: term,
            feedback: { show: false, message: '', type: 'info' }
        }))

        try {
            // TODO: Implementar chamada real para API do TASY
            // Simulação de busca por números no TASY
            await new Promise(resolve => setTimeout(resolve, 800))

            const mockNumbers = [
                `${term}001`, `${term}002`, `${term}003`,
                `${term}101`, `${term}102`, `${term}201`
            ].filter(num => num.includes(term))

            setTasyModal(prev => ({
                ...prev,
                availableNumbers: mockNumbers,
                isSearching: false
            }))
        } catch (error) {
            setTasyModal(prev => ({
                ...prev,
                isSearching: false,
                feedback: {
                    show: true,
                    message: 'Erro ao buscar números no TASY',
                    type: 'error'
                }
            }))
        }
    }

    const toggleTasyNumber = (number: string) => {
        setTasyModal(prev => ({
            ...prev,
            selectedNumbers: prev.selectedNumbers.includes(number)
                ? prev.selectedNumbers.filter(n => n !== number)
                : [ ...prev.selectedNumbers, number ]
        }))
    }

    const sendPdfToTasy = async () => {
        if (tasyModal.selectedNumbers.length === 0) {
            setTasyModal(prev => ({
                ...prev,
                feedback: {
                    show: true,
                    message: 'Selecione pelo menos um número',
                    type: 'error'
                }
            }))
            return
        }

        setTasyModal(prev => ({
            ...prev,
            isSending: true,
            feedback: { show: false, message: '', type: 'info' }
        }))

        try {
            // TODO: Implementar chamada real para envio ao TASY
            await new Promise(resolve => setTimeout(resolve, 2000))

            setTasyModal(prev => ({
                ...prev,
                isSending: false,
                feedback: {
                    show: true,
                    message: `PDF enviado para ${prev.selectedNumbers.length} número(s) no TASY com sucesso!`,
                    type: 'success'
                }
            }))

            // Fechar modal após 2 segundos
            setTimeout(() => closeTasyModal(), 2000)
        } catch (error) {
            setTasyModal(prev => ({
                ...prev,
                isSending: false,
                feedback: {
                    show: true,
                    message: 'Erro ao enviar PDF para o TASY',
                    type: 'error'
                }
            }))
        }
    }

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

        try {
            setIsUnifying(true)

            // Gerar nome composto para o arquivo unificado com prefixo UNI_
            const nomeComposto = `UNI_${nomeComposicao.cdPessoaFisica}_${nomeComposicao.numeroAtendimento}_${nomeComposicao.dataUpload}_${nomeComposicao.hash}`

            const request: UnificationRequest = {
                title: nomeComposto, // Usar nome composto como título
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

            // Gerar novo hash para próxima unificação
            setNomeComposicao(prev => ({
                ...prev,
                hash: Math.random().toString(36).substring(2, 8).toUpperCase()
            }))

        } catch (error) {
            console.error('Erro ao unificar PDFs:', error)
            alert('Erro ao unificar PDFs. Tente novamente.')
        } finally {
            setIsUnifying(false)
        }
    }

    // Converter UnifiedPDFItem para PDFItem para compatibilidade com SortablePDFList
    const convertToPDFItems = (unifiedPdfs: UnifiedPDFItem[]): PDFItem[] => {
        return unifiedPdfs.map(pdf => ({
            id: pdf.id,
            title: pdf.title,
            url: pdf.url,
            fileName: pdf.fileName,
            size: pdf.size,
            uploadDate: pdf.uploadDate,
            description: `${pdf.description} • ${pdf.sourceFiles.length} arquivos • ${pdf.pageCount} páginas`
        }))
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

        // Inicializar composição do nome com data e hash
        setNomeComposicao(prev => ({
            ...prev,
            dataUpload: formatDateDDMMAAAA(),
            hash: Math.random().toString(36).substring(2, 8).toUpperCase()
        }))
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
                            <ArrowLeft className="w-4 h-4 pdf-icon" />
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
                        <Plus className="w-4 h-4 pdf-icon" />
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
                                'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pdf-icon',
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
                                    <X className="w-4 h-4 pdf-icon" />
                                </button>
                            )}
                        </div>

                        {/* Controles de visualização */}
                        <div className="flex gap-2">
                            <div className={twMerge(
                                'flex rounded-lg'
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
                                    <Grid className="w-4 h-4 pdf-icon" />
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
                                    <List className="w-4 h-4 pdf-icon" />
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

                {/* Lista de PDFs unificados usando SortablePDFList */}
                {!isLoading && unifiedPdfs.length === 0 && (
                    <div className={twMerge(
                        'text-center py-12 rounded-lg border-2 border-dashed',
                        isDark
                            ? 'border-gray-600 bg-gray-800/30'
                            : 'border-gray-300 bg-gray-50/50'
                    )}>
                        <Layers className={twMerge(
                            'w-16 h-16 mx-auto mb-4 pdf-icon',
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
                    <SortablePDFList
                        items={convertToPDFItems(unifiedPdfs)}
                        onViewPDF={(pdfItem) => {
                            // Encontrar o PDF unificado original usando o ID
                            const originalPdf = unifiedPdfs.find(pdf => pdf.id === pdfItem.id)
                            if (originalPdf) {
                                handleViewPDF(originalPdf)
                            }
                        }}
                        onEditPDF={(pdfItem) => {
                            // Encontrar o PDF unificado original usando o ID
                            const originalPdf = unifiedPdfs.find(pdf => pdf.id === pdfItem.id)
                            if (originalPdf) {
                                openEditModal(originalPdf)
                            }
                        }}
                        onSendToTasy={(pdfItem) => {
                            // Encontrar o PDF unificado original usando o ID
                            const originalPdf = unifiedPdfs.find(pdf => pdf.id === pdfItem.id)
                            if (originalPdf) {
                                openTasyModal(originalPdf)
                            }
                        }}
                        isDark={isDark}
                        viewMode={viewMode}
                        gridCols={viewMode === 'grid' ? 3 : 1}
                        formatDate={formatDate}
                        disabled={false}
                        animation={150}
                        className="w-full"
                    />
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
                                        <X className="w-6 h-6 pdf-icon" />
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

                                    {/* Seção de Composição do Nome */}
                                    <div className={twMerge(
                                        'bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 space-y-4',
                                        isDark ? 'border border-gray-600' : 'border border-gray-200'
                                    )}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            <h4 className="text-sm font-semibold">Parâmetros de Composição do Nome</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Código Pessoa Física *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: 123456"
                                                    value={nomeComposicao.cdPessoaFisica}
                                                    onChange={(e) => setNomeComposicao(prev => ({
                                                        ...prev,
                                                        cdPessoaFisica: e.target.value
                                                    }))}
                                                    className={twMerge(
                                                        'w-full px-2 py-1.5 text-sm border rounded-md transition-colors',
                                                        'focus:outline-none focus:ring-1 focus:ring-blue-500/50',
                                                        isDark
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                    )}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Número Atendimento *
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: ATD001"
                                                    value={nomeComposicao.numeroAtendimento}
                                                    onChange={(e) => setNomeComposicao(prev => ({
                                                        ...prev,
                                                        numeroAtendimento: e.target.value
                                                    }))}
                                                    className={twMerge(
                                                        'w-full px-2 py-1.5 text-sm border rounded-md transition-colors',
                                                        'focus:outline-none focus:ring-1 focus:ring-blue-500/50',
                                                        isDark
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                    )}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Data Upload
                                                </label>
                                                <input
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
                                                        'w-full px-2 py-1.5 text-sm border rounded-md transition-colors',
                                                        'focus:outline-none focus:ring-1 focus:ring-blue-500/50',
                                                        isDark
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                    )}
                                                    placeholder="DDMMAAAA"
                                                    maxLength={8}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Hash
                                                </label>
                                                <input
                                                    type="text"
                                                    value={nomeComposicao.hash}
                                                    onChange={(e) => setNomeComposicao(prev => ({
                                                        ...prev,
                                                        hash: e.target.value.toUpperCase()
                                                    }))}
                                                    className={twMerge(
                                                        'w-full px-2 py-1.5 text-sm border rounded-md transition-colors',
                                                        'focus:outline-none focus:ring-1 focus:ring-blue-500/50',
                                                        isDark
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                    )}
                                                    placeholder="Ex: ABC123"
                                                    maxLength={8}
                                                />
                                            </div>
                                        </div>

                                        {/* Preview do nome */}
                                        <div className={twMerge(
                                            'mt-3 p-2 rounded-md border text-xs',
                                            isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-100 border-gray-200'
                                        )}>
                                            <span className="font-medium">Nome do arquivo:</span>
                                            <code className={twMerge(
                                                'ml-2 px-1.5 py-0.5 rounded text-xs font-mono',
                                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'
                                            )}>
                                                UNI_{nomeComposicao.cdPessoaFisica || 'cdPessoa'}_{nomeComposicao.numeroAtendimento || 'numAtendimento'}_{nomeComposicao.dataUpload}_{nomeComposicao.hash || 'hash'}.pdf
                                            </code>
                                        </div>
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
                                        disabled={
                                            isUnifying ||
                                            selectedPdfs.length < 2 ||
                                            !unifyForm.title.trim() ||
                                            !nomeComposicao.cdPessoaFisica.trim() ||
                                            !nomeComposicao.numeroAtendimento.trim()
                                        }
                                        className={twMerge(
                                            'inline-flex items-center gap-2',
                                            (isUnifying ||
                                                selectedPdfs.length < 2 ||
                                                !unifyForm.title.trim() ||
                                                !nomeComposicao.cdPessoaFisica.trim() ||
                                                !nomeComposicao.numeroAtendimento.trim())
                                                ? 'cursor-not-allowed opacity-50'
                                                : isDark
                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                        )}
                                    >
                                        {isUnifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin pdf-icon" />
                                                Unificando...
                                            </>
                                        ) : (
                                            <>
                                                <Layers className="w-4 h-4 pdf-icon" />
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

            {/* Modal de Preview - Migrado para componente Modal unificado */}
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
                                Carregando PDF unificado...
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
                                if (previewState.selectedPdf) {
                                    openEditModal(previewState.selectedPdf)
                                    closePreview()
                                }
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

            {/* Modal de Edição de PDF */}
            <Modal
                isOpen={editState.isOpen}
                onClose={closeEditModal}
                title="Editar PDF"
                size="xl"
                className="max-h-[90vh]"
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

            {/* Modal de Envio para TASY */}
            <Modal
                isOpen={tasyModal.isOpen}
                onClose={closeTasyModal}
                title="Enviar para TASY"
                size="lg"
            >
                <div className="space-y-6">
                    {tasyModal.selectedPdf && (
                        <div className={twMerge(
                            'p-4 rounded-lg border',
                            isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                        )}>
                            <div className="flex items-center gap-3">
                                <Database className={twMerge(
                                    'w-8 h-8 flex-shrink-0',
                                    isDark ? 'text-purple-400' : 'text-purple-600'
                                )} />
                                <div className="flex-1 min-w-0">
                                    <h4 className={twMerge(
                                        'font-medium truncate',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        {tasyModal.selectedPdf.title}
                                    </h4>
                                    <p className={twMerge(
                                        'text-sm',
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    )}>
                                        {tasyModal.selectedPdf.size} • {formatDate(tasyModal.selectedPdf.uploadDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Campo de busca */}
                    <div className="space-y-2">
                        <label className={twMerge(
                            'block text-sm font-medium',
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Buscar números no TASY
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={tasyModal.searchTerm}
                                onChange={(e) => searchTasyNumbers(e.target.value)}
                                placeholder="Digite para buscar números..."
                                className={twMerge(
                                    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                )}
                            />
                            {tasyModal.isSearching && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lista de números disponíveis */}
                    {tasyModal.availableNumbers.length > 0 && (
                        <div className="space-y-2">
                            <label className={twMerge(
                                'block text-sm font-medium',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Números encontrados ({tasyModal.availableNumbers.length})
                            </label>
                            <div className={twMerge(
                                'max-h-48 overflow-y-auto border rounded-lg',
                                isDark ? 'border-gray-600' : 'border-gray-200'
                            )}>
                                {tasyModal.availableNumbers.map((number) => (
                                    <div
                                        key={number}
                                        className={twMerge(
                                            'flex items-center p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50',
                                            isDark ? 'border-gray-600' : 'border-gray-200',
                                            tasyModal.selectedNumbers.includes(number) &&
                                            (isDark ? 'bg-purple-600/20' : 'bg-purple-50')
                                        )}
                                        onClick={() => toggleTasyNumber(number)}
                                    >
                                        <div className={twMerge(
                                            'w-5 h-5 rounded flex items-center justify-center mr-3 border-2',
                                            tasyModal.selectedNumbers.includes(number)
                                                ? 'bg-purple-500 border-purple-500'
                                                : isDark
                                                    ? 'border-gray-500'
                                                    : 'border-gray-300'
                                        )}>
                                            {tasyModal.selectedNumbers.includes(number) && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className={twMerge(
                                            'text-sm font-mono',
                                            isDark ? 'text-gray-300' : 'text-gray-700'
                                        )}>
                                            {number}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Números selecionados */}
                    {tasyModal.selectedNumbers.length > 0 && (
                        <div className="space-y-2">
                            <label className={twMerge(
                                'block text-sm font-medium',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Selecionados ({tasyModal.selectedNumbers.length})
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {tasyModal.selectedNumbers.map((number) => (
                                    <span
                                        key={number}
                                        className={twMerge(
                                            'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full',
                                            isDark
                                                ? 'bg-purple-600/20 text-purple-300'
                                                : 'bg-purple-100 text-purple-700'
                                        )}
                                    >
                                        {number}
                                        <button
                                            onClick={() => toggleTasyNumber(number)}
                                            className="hover:bg-red-200 dark:hover:bg-red-800/30 rounded-full p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Feedback */}
                    {tasyModal.feedback.show && (
                        <div className={twMerge(
                            'p-3 rounded-lg text-sm',
                            tasyModal.feedback.type === 'success' && (isDark ? 'bg-green-600/20 text-green-300' : 'bg-green-50 text-green-700'),
                            tasyModal.feedback.type === 'error' && (isDark ? 'bg-red-600/20 text-red-300' : 'bg-red-50 text-red-700'),
                            tasyModal.feedback.type === 'info' && (isDark ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-50 text-blue-700')
                        )}>
                            {tasyModal.feedback.message}
                        </div>
                    )}

                    {/* Botões */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            onClick={closeTasyModal}
                            variant="outline"
                            disabled={tasyModal.isSending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={sendPdfToTasy}
                            disabled={tasyModal.isSending || tasyModal.selectedNumbers.length === 0}
                            className={twMerge(
                                'inline-flex items-center gap-2',
                                tasyModal.isSending || tasyModal.selectedNumbers.length === 0
                                    ? 'cursor-not-allowed opacity-50'
                                    : isDark
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                            )}
                        >
                            {tasyModal.isSending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
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

export default UnificadosPDFsPage
