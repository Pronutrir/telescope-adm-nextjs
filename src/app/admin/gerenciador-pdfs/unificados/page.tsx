'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import {
    FileText,
    Grid,
    List,
    ArrowLeft,
    Eye,
    Loader2,
    Edit3,
    FolderOpen,
    Send,
    Database,
    RefreshCw,
    AlertCircle
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { UnifiedPDFItem, ViewMode, PDFEditState, PDFItem } from '@/types/pdf'
import PDFManagerService, { SharePointPdfItem } from '@/services/pdfManager/pdfManagerService'
import PDFService from '@/services/pdf/pdfService'
import { useNotify } from '@/contexts/NotificationContext'
import { TelescopePDFCard } from '@/components/pdf/TelescopePDFCard'
import { getNasStatus } from '@/app/actions/pdfs'

const UnificadosGerenciadorPDFsPage = () => {
    const { isDark } = useTheme()
    useLayout() // mantido para reatividade de layout; sem destructuring para evitar unused var
    const notify = useNotify()

    // Estado para status do NAS
    const [ nasStatus, setNasStatus ] = useState<{
        status: 'online' | 'offline' | 'error' | 'loading'
        message?: string
        details?: any
    }>({
        status: 'loading'
    })

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

        // Extrair status de envio do customFields
        const sentToTasy = item.customFields?.Tasy === true || item.customFields?.Tasy === 'true'

        return {
            id: item.id || '',
            title: fileName.replace('.pdf', ''),
            url: item.downloadUrl || '',
            fileName: fileName,
            size: formatFileSize(item.size || 0),
            uploadDate: item.lastModified || new Date().toISOString(),
            description: `PDF unificado criado em ${PDFManagerService.formatDate(item.lastModified || new Date().toISOString())}`,
            sourceFiles: [], // API não retorna essa informação
            pageCount: 0, // API não retorna essa informação
            sentToTasy
        }
    }

    // Função para converter UnifiedPDFItem para PDFItem (compatibilidade com TelescopePDFCard)
    const convertToPDFItem = (unifiedPdf: UnifiedPDFItem): PDFItem => ({
        id: unifiedPdf.id,
        title: unifiedPdf.title,
        fileName: unifiedPdf.fileName,
        description: unifiedPdf.description,
        size: unifiedPdf.size,
        uploadDate: unifiedPdf.uploadDate,
        url: unifiedPdf.url
    })

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
        isManualEntry: boolean
    }>({
        isOpen: false,
        searchTerm: '',
        contasPaciente: [],
        selectedConta: '',
        isLoading: false,
        isSending: false,
        isSearching: false,
        isManualEntry: false
    })

    // Ref para debounce da busca
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    // Ref para controlar o AbortController das requisições
    const abortControllerRef = useRef<AbortController | null>(null)

    const loadUnifiedPdfs = useCallback(async () => {
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
    }, [])

    useEffect(() => {
        setMounted(true)
        loadUnifiedPdfs()
    }, [ loadUnifiedPdfs ])

    // Buscar status do NAS
    useEffect(() => {
        const checkNasStatus = async () => {
            const status = await getNasStatus()
            setNasStatus(status)
        }

        checkNasStatus()

        // Atualizar a cada 30 segundos
        const interval = setInterval(checkNasStatus, 30000)

        return () => clearInterval(interval)
    }, [])

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
            notify.warning('URL do PDF não está disponível para visualização.', {
                title: 'PDF Indisponível',
                duration: 5000,
                actions: [ {
                    label: 'Entendi',
                    onClick: () => { },
                    variant: 'ghost'
                } ]
            })
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

        // Carregar detalhes reais do PDF via API route local (mesma implementação da página principal)
        try {
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
            notify.warning('Selecione pelo menos uma página para manter no PDF', {
                title: 'Seleção Obrigatória',
                duration: 5000,
                actions: [ {
                    label: 'OK',
                    onClick: () => { },
                    variant: 'primary'
                } ]
            })
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
                notify.success(response.message || `PDF editado com sucesso! ${selectedPages.length} páginas mantidas.`, {
                    title: 'Edição Concluída',
                    duration: 6000,
                    actions: [ {
                        label: 'Ver Lista',
                        onClick: () => { },
                        variant: 'ghost'
                    } ]
                })
                closeEditModal()

                // Recarregar a lista de PDFs unificados
                console.log('🔄 Recarregando lista de PDFs unificados após edição...')
                await loadUnifiedPdfs()

            } else {
                notify.error(response.message || 'Erro ao editar PDF', {
                    title: 'Falha na Edição',
                    duration: 6000,
                    actions: [ {
                        label: 'Tentar novamente',
                        onClick: () => handleSaveEdit(),
                        variant: 'primary'
                    } ]
                })
            }
        } catch (error) {
            console.error('Erro ao editar PDF:', error)
            notify.error(error instanceof Error ? error.message : 'Erro ao editar PDF', {
                title: 'Erro Inesperado',
                duration: 6000,
                actions: [ {
                    label: 'Tentar novamente',
                    onClick: () => handleSaveEdit(),
                    variant: 'primary'
                } ]
            })

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

        setTasyModal(prev => ({
            ...prev,
            isOpen: true,
            selectedPdf: pdf,
            searchTerm: '',
            contasPaciente: [],
            selectedConta: '',
            isLoading: false,
            isSearching: false,
            isSending: false,
            isManualEntry: false
        }))

        // Extrair número de atendimento do nome do arquivo
        const numeroAtendimento = extractAtendimentoFromFileName(pdf.fileName)

        if (numeroAtendimento) {
            notify.info('🔍 Buscando conta do paciente...', {
                title: 'Processando',
                duration: 3000
            })
            // Buscar automaticamente a conta do paciente
            searchContasPaciente(numeroAtendimento)
        } else {
            notify.error('Número de atendimento não encontrado no nome do arquivo', {
                title: 'Erro de Processamento',
                duration: 5000,
                actions: [ {
                    label: 'Entendi',
                    onClick: () => { },
                    variant: 'ghost'
                } ]
            })
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
            isSending: false,
            isManualEntry: false
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

    // Função auxiliar para verificar se há contas válidas no array
    const hasValidAccounts = (contas: Array<{numeroAtendimento: string, contaPaciente: string, displayText: string}>) => {
        return contas.length > 0 && contas.some(conta => 
            conta.contaPaciente && 
            String(conta.contaPaciente).trim() !== '' &&
            conta.contaPaciente !== 'undefined' &&
            conta.contaPaciente !== 'null' &&
            conta.contaPaciente !== '[]' &&
            conta.contaPaciente !== 'null' &&
            conta.contaPaciente !== '{}'
        )
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

            const response = await fetch(`/api/tasy/conta-paciente?numeroAtendimento=${numeroAtendimento}`, {
                signal: abortControllerRef.current.signal
            })

            if (response.ok) {
                const data = await response.json()
                
                // Log para debug da resposta da API
                console.log('🔍 [TASY DEBUG] Resposta completa da API:', data)
                console.log('🔍 [TASY DEBUG] Tipo de contasPaciente:', typeof data.contasPaciente)
                console.log('🔍 [TASY DEBUG] É array?:', Array.isArray(data.contasPaciente))
                console.log('🔍 [TASY DEBUG] Valor de contasPaciente:', data.contasPaciente)

                // Preparar estrutura para múltiplas contas
                const contasEncontradas: Array<{
                    numeroAtendimento: string
                    contaPaciente: string
                    displayText: string
                }> = []

                // Verificar se a API retorna múltiplas contas em um array de objetos
                if (Array.isArray(data.contasPaciente)) {
                    console.log('🔍 [TASY DEBUG] Array detectado, tamanho:', data.contasPaciente.length)
                    console.log('🔍 [TASY DEBUG] Conteúdo do array:', data.contasPaciente)
                    
                    if (data.contasPaciente.length === 0) {
                        console.log('⚠️ [TASY DEBUG] Array está vazio - nenhuma conta para processar')
                    } else {
                        // Processar cada conta do array
                        data.contasPaciente.forEach((conta: any) => {
                            if (conta.contaPaciente) {
                                contasEncontradas.push({
                                    numeroAtendimento: data.numeroAtendimento,
                                    contaPaciente: conta.contaPaciente,
                                    displayText: `Atend: ${data.numeroAtendimento} → Conta: ${conta.contaPaciente}`
                                })
                            }
                        })
                    }
                }

                // Log do resultado do processamento
                console.log('🔍 [TASY DEBUG] Contas válidas encontradas:', contasEncontradas.length)
                console.log('🔍 [TASY DEBUG] Lista de contas processadas:', contasEncontradas)
                console.log('🔍 [TASY DEBUG] Há contas realmente válidas?:', hasValidAccounts(contasEncontradas))
                
                // Log de divergência entre array length e validação
                if (contasEncontradas.length > 0 && !hasValidAccounts(contasEncontradas)) {
                    console.warn('⚠️ [TASY DEBUG] DIVERGÊNCIA: Array tem elementos mas nenhuma conta válida!')
                    console.warn('⚠️ [TASY DEBUG] Contas inválidas:', contasEncontradas.map(c => c.contaPaciente))
                }

                // Verificar se nenhuma conta válida foi encontrada (usar a função de validação)
                if (!hasValidAccounts(contasEncontradas)) {
                    console.log('⚠️ [TASY DEBUG] Ativando modo manual - nenhuma conta válida encontrada')
                    setTasyModal(prev => ({
                        ...prev,
                        contasPaciente: [],
                        selectedConta: '',
                        isSearching: false,
                        isManualEntry: true
                    }))

                    notify.warning(
                        `Nenhuma conta encontrada para o atendimento ${numeroAtendimento}. Por favor, informe manualmente o número da conta do paciente.`,
                        {
                            title: 'Conta Não Encontrada',
                            duration: 8000,
                            actions: [
                                {
                                    label: 'Entendi',
                                    onClick: () => { },
                                    variant: 'primary'
                                },
                                {
                                    label: 'Tentar novamente',
                                    onClick: () => searchContasPaciente(numeroAtendimento),
                                    variant: 'ghost'
                                }
                            ]
                        }
                    )
                    return
                }

                setTasyModal(prev => ({
                    ...prev,
                    contasPaciente: contasEncontradas,
                    selectedConta: contasEncontradas.length === 1 ? contasEncontradas[ 0 ].contaPaciente : '', // Auto-selecionar apenas se for uma única conta
                    isSearching: false,
                    isManualEntry: false
                }))

                // Só mostrar notificação de sucesso se realmente há contas válidas
                if (hasValidAccounts(contasEncontradas)) {
                    if (contasEncontradas.length === 1) {
                        notify.success(`Conta encontrada: ${contasEncontradas[ 0 ].contaPaciente}`, {
                            title: 'Busca Concluída',
                            duration: 4000
                        })
                    } else {
                        notify.success(`${contasEncontradas.length} contas encontradas para seleção`, {
                            title: 'Múltiplas Contas',
                            duration: 4000
                        })
                    }
                } else {
                    console.warn('⚠️ [TASY DEBUG] Não mostrando notificação de sucesso - nenhuma conta válida')
                }
            } else {
                console.warn(`⚠️ Resposta não OK da API para atendimento: ${numeroAtendimento}, status: ${response.status}`)

                setTasyModal(prev => ({
                    ...prev,
                    contasPaciente: [],
                    selectedConta: '',
                    isSearching: false,
                    isManualEntry: true  // Ativar modo manual quando API retorna erro
                }))

                notify.warning(
                    `Nenhuma conta encontrada para o atendimento ${numeroAtendimento}. Por favor, informe manualmente o número da conta do paciente.`,
                    {
                        title: 'Conta Não Encontrada',
                        duration: 8000,
                        actions: [
                            {
                                label: 'Entendi',
                                onClick: () => { },
                                variant: 'primary'
                            },
                            {
                                label: 'Tentar novamente',
                                onClick: () => searchContasPaciente(numeroAtendimento),
                                variant: 'ghost'
                            }
                        ]
                    }
                )
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
                isSearching: false,
                isManualEntry: true  // Ativar modo manual em caso de erro
            }))
            notify.warning(
                'Erro ao buscar conta do paciente. Por favor, informe manualmente o número da conta.',
                {
                    title: 'Erro de Conexão',
                    duration: 8000,
                    actions: [
                        {
                            label: 'Inserir manualmente',
                            onClick: () => { },
                            variant: 'primary'
                        },
                        {
                            label: 'Tentar novamente',
                            onClick: () => tasyModal.selectedPdf && openTasyModal(tasyModal.selectedPdf),
                            variant: 'ghost'
                        }
                    ]
                }
            )
        }
    }

    const sendPdfToTasy = async () => {
        if (!tasyModal.selectedConta || !tasyModal.selectedPdf) return

        // Verificar se a conta foi selecionada da lista ou inserida manualmente
        let contaSelecionada = tasyModal.contasPaciente.find(c => c.contaPaciente === tasyModal.selectedConta)
        
        // Se não foi encontrada na lista (conta manual), criar estrutura artificial
        if (!contaSelecionada) {
            // Usar o número de atendimento extraído do arquivo ou do campo de busca
            const numeroAtendimento = extractAtendimentoFromFileName(tasyModal.selectedPdf.fileName) || tasyModal.searchTerm
            
            contaSelecionada = {
                numeroAtendimento: numeroAtendimento || '',
                contaPaciente: tasyModal.selectedConta,
                displayText: `Atend: ${numeroAtendimento || 'Manual'} → Conta: ${tasyModal.selectedConta} (Manual)`
            }
            
            console.log('💡 Usando conta inserida manualmente:', contaSelecionada)
        }

        setTasyModal(prev => ({ ...prev, isSending: true }))

        // IDs de toast removidos (não utilizados)

        try {
            // Etapa 1: Download do PDF do SharePoint
            notify.info(
                `Fazendo download do PDF "${tasyModal.selectedPdf.fileName}" do SharePoint...`,
                {
                    title: 'Download em Andamento',
                    duration: 0 // Não auto-hide durante o processo
                }
            )

            const caminhoArquivo = await downloadPdfFromSharePoint(tasyModal.selectedPdf)

            // Mostrar sucesso do download
            notify.success('Download concluído com sucesso!', {
                title: 'Download Completo',
                duration: 3000
            })

            // Etapa 2: Envio para TASY
            notify.info(
                `Enviando PDF para a conta médica ${contaSelecionada.contaPaciente} no TASY...`,
                {
                    title: 'Enviando para TASY',
                    duration: 0 // Não auto-hide durante o processo
                }
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

            if (response.ok) {
                const result = await response.json()

                notify.success(
                    `PDF "${tasyModal.selectedPdf.fileName}" enviado com sucesso para a conta médica ${contaSelecionada.contaPaciente} no TASY!`,
                    {
                        title: 'Envio Concluído',
                        duration: 8000,
                        actions: [ {
                            label: 'Ver Detalhes',
                            onClick: () => console.log('Detalhes:', result),
                            variant: 'ghost'
                        } ]
                    }
                )

                console.log('✅ Processo completo:', {
                    download: caminhoArquivo,
                    tasyResponse: result
                })

                closeTasyModal()
            } else {
                const errorData = await response.json()
                console.error('❌ Erro da API TASY:', errorData)

                notify.error(
                    `Erro ao enviar PDF para o TASY: ${errorData.error || 'Erro desconhecido'}`,
                    {
                        title: 'Falha no Envio',
                        duration: 8000,
                        actions: [ {
                            label: 'Tentar novamente',
                            onClick: () => sendPdfToTasy(),
                            variant: 'primary'
                        } ]
                    }
                )
            }

        } catch (error) {
            console.error('❌ Erro no processo de envio:', error)

            // Determinar se o erro foi no download ou no envio
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'

            if (errorMessage.includes('download') || errorMessage.includes('SharePoint')) {
                notify.error(
                    `Erro no download do SharePoint: ${errorMessage}`,
                    {
                        title: 'Falha no Download',
                        duration: 8000,
                        actions: [ {
                            label: 'Tentar novamente',
                            onClick: () => sendPdfToTasy(),
                            variant: 'primary'
                        } ]
                    }
                )
            } else {
                notify.error(
                    `Erro ao processar envio: ${errorMessage}`,
                    {
                        title: 'Erro no Processamento',
                        duration: 8000,
                        actions: [ {
                            label: 'Tentar novamente',
                            onClick: () => sendPdfToTasy(),
                            variant: 'primary'
                        } ]
                    }
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
                {/* Header com botão à esquerda e status NAS à direita */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={() => window.history.back()}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 pdf-icon" />
                            Voltar para Biblioteca
                        </Button>

                        <div className="flex items-center gap-3">
                            {/* Botão de Atualizar */}
                            <Button
                                onClick={() => {
                                    loadUnifiedPdfs()
                                    getNasStatus().then(setNasStatus)
                                }}
                                disabled={isLoading}
                                className={twMerge(
                                    'flex items-center gap-2',
                                    isDark 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                )}
                            >
                                <RefreshCw className={twMerge(
                                    'w-4 h-4 pdf-icon',
                                    isLoading && 'animate-spin'
                                )} />
                                {isLoading ? 'Atualizando...' : 'Atualizar'}
                            </Button>

                            {/* Status do NAS - Canto Superior Direito */}
                            {nasStatus.status !== 'loading' && (
                                <div className={twMerge(
                                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                                    nasStatus.status === 'online' && (isDark ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-green-50 text-green-700 border border-green-200'),
                                    nasStatus.status === 'offline' && (isDark ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'),
                                    nasStatus.status === 'error' && (isDark ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 'bg-red-50 text-red-700 border border-red-200')
                                )}>
                                    <Database className="w-3 h-3" />
                                    <span>
                                        NAS: {nasStatus.status === 'online' ? '🟢 Online' : nasStatus.status === 'offline' ? '🟡 Offline' : '🔴 Erro'}
                                    </span>
                                    {nasStatus.message && (
                                        <span className="opacity-70">• {nasStatus.message}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className={twMerge(
                            'text-4xl font-bold',
                            isDark ? 'text-white' : 'text-slate-800'
                        )}>
                            📚 PDFs Unificados
                        </h1>
                    </div>

                    <p className={twMerge(
                        'text-lg text-center',
                        isDark ? 'text-gray-300' : 'text-muted-foreground'
                    )}>
                        {isLoading ? 'Carregando...' : `${filteredPdfs.length} documento${filteredPdfs.length > 1 ? 's' : ''} unificado${filteredPdfs.length > 1 ? 's' : ''} disponív${filteredPdfs.length > 1 ? 'eis' : 'el'}`}
                    </p>

                    {/* Estatísticas de Envio */}
                    {!isLoading && filteredPdfs.length > 0 && (
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <span className={twMerge(
                                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border',
                                    isDark 
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                                        : 'bg-purple-50 text-purple-700 border-purple-200'
                                )}>
                                    <Database className="w-4 h-4" />
                                    {filteredPdfs.filter(pdf => pdf.sentToTasy).length} enviado{filteredPdfs.filter(pdf => pdf.sentToTasy).length !== 1 ? 's' : ''} ao TASY
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Barra de ferramentas */}
            <div className={twMerge(
                'p-6 rounded-lg border',
                isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
            )}>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Busca */}
                    <div className="relative flex-1 max-w-md">
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
                                    <ArrowLeft className="w-4 h-4 mr-2 pdf-icon" />
                                    Voltar para Biblioteca
                                </Button>
                            )}
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3" style={{ padding: '0 6px' }}>
                        {filteredPdfs.map((pdf) => (
                            <div key={pdf.id} className="relative">
                                {/* Badge de Status - Posicionado acima do card */}
                                {pdf.sentToTasy && (
                                    <div className="absolute -top-2 left-2 right-2 z-10 flex gap-2 justify-center">
                                        <span className={twMerge(
                                            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-lg border',
                                            isDark
                                                ? 'bg-purple-500/90 text-white border-purple-400/50 shadow-purple-900/50'
                                                : 'bg-purple-500 text-white border-purple-400/30 shadow-purple-500/30'
                                        )}>
                                            <Database className="w-3 h-3" />
                                            TASY
                                        </span>
                                    </div>
                                )}
                                <TelescopePDFCard
                                    pdf={convertToPDFItem(pdf)}
                                    viewMode="grid"
                                    onView={() => openViewer(pdf)}
                                    onEdit={() => handleEditPDF(pdf)}
                                    onSendToTasy={() => openTasyModal(pdf)}
                                    formatDate={PDFManagerService.formatDate}
                                    priority="medium"
                                    showStats={true}
                                    actionButtonStyle="full"
                                    className="transition-all duration-300"
                                />
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
                                    'group flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-sm',
                                    'transition-all duration-300 hover:scale-[1.005]',
                                    isDark
                                        ? 'bg-gray-800/90 border-gray-700/30 hover:border-purple-400/40 shadow-sm hover:shadow-md'
                                        : 'bg-white/95 border-gray-200/30 hover:border-purple-300/40 shadow-sm hover:shadow-md'
                                )}
                            >
                                {/* Ícone do PDF */}
                                <div className={twMerge(
                                    'flex-shrink-0 p-3 rounded-xl',
                                    isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                                )}>
                                    <FileText className="w-8 h-8 text-purple-500 pdf-icon" />
                                </div>                                    {/* Informações principais */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-2 mb-1">
                                        <h3 className={twMerge(
                                            'font-semibold text-lg truncate flex-1',
                                            isDark ? 'text-white' : 'text-gray-900'
                                        )}>
                                            {pdf.title}
                                        </h3>
                                        {/* Badge de Status inline */}
                                        {pdf.sentToTasy && (
                                            <span className={twMerge(
                                                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm',
                                                isDark
                                                    ? 'bg-purple-500/80 text-white border border-purple-400/50'
                                                    : 'bg-purple-500 text-white border border-purple-400/30'
                                            )}>
                                                <Database className="w-3 h-3" />
                                                TASY
                                            </span>
                                        )}
                                    </div>
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
                                            <FolderOpen className="w-3 h-3 pdf-icon" />
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
                                        className="flex items-center justify-center gap-2 text-sm h-10 px-4 font-semibold rounded-xl transition-all duration-200 shadow-sm border cursor-pointer"
                                        style={{
                                            background: isDark
                                                ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.8), rgba(100, 116, 139, 0.9))'
                                                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(226, 232, 240, 0.9))',
                                            color: isDark ? 'rgba(248, 250, 252, 0.9)' : 'rgba(51, 65, 85, 0.9)',
                                            border: isDark
                                                ? '1px solid rgba(148, 163, 184, 0.3)'
                                                : '1px solid rgba(226, 232, 240, 0.6)',
                                            boxShadow: isDark
                                                ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                                                : '0 2px 8px rgba(0, 0, 0, 0.1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-1px)'
                                            e.currentTarget.style.background = isDark
                                                ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.9), rgba(100, 116, 139, 1))'
                                                : 'linear-gradient(135deg, rgba(241, 245, 249, 0.95), rgba(203, 213, 225, 0.9))'
                                            e.currentTarget.style.boxShadow = isDark
                                                ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                                : '0 4px 12px rgba(0, 0, 0, 0.15)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.background = isDark
                                                ? 'linear-gradient(135deg, rgba(148, 163, 184, 0.8), rgba(100, 116, 139, 0.9))'
                                                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(226, 232, 240, 0.9))'
                                            e.currentTarget.style.boxShadow = isDark
                                                ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                                                : '0 2px 8px rgba(0, 0, 0, 0.1)'
                                        }}
                                        onClick={() => openViewer(pdf)}
                                    >
                                        <Eye className="w-4 h-4 pdf-icon" />
                                        <span>Ver</span>
                                    </button>
                                    <button
                                        className="flex items-center justify-center gap-2 text-sm h-10 px-4 font-semibold rounded-xl transition-all duration-200 shadow-sm border cursor-pointer"
                                        style={{
                                            background: isDark
                                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9))'
                                                : 'linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.9))',
                                            color: isDark ? 'rgba(147, 197, 253, 0.95)' : 'rgba(37, 99, 235, 0.9)',
                                            border: isDark
                                                ? '1px solid rgba(59, 130, 246, 0.3)'
                                                : '1px solid rgba(219, 234, 254, 0.6)',
                                            boxShadow: isDark
                                                ? '0 2px 8px rgba(59, 130, 246, 0.15)'
                                                : '0 2px 8px rgba(59, 130, 246, 0.1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-1px)'
                                            e.currentTarget.style.background = isDark
                                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 1))'
                                                : 'linear-gradient(135deg, rgba(233, 243, 255, 0.95), rgba(191, 219, 254, 0.9))'
                                            e.currentTarget.style.boxShadow = isDark
                                                ? '0 4px 12px rgba(59, 130, 246, 0.25)'
                                                : '0 4px 12px rgba(59, 130, 246, 0.15)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.background = isDark
                                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9))'
                                                : 'linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.9))'
                                            e.currentTarget.style.boxShadow = isDark
                                                ? '0 2px 8px rgba(59, 130, 246, 0.15)'
                                                : '0 2px 8px rgba(59, 130, 246, 0.1)'
                                        }}
                                        onClick={() => handleEditPDF(pdf)}
                                    >
                                        <Edit3 className="w-4 h-4 pdf-icon" />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        className="flex items-center justify-center gap-2 text-sm h-10 px-4 font-semibold rounded-xl transition-all duration-200 shadow-sm border cursor-pointer"
                                        style={{
                                            background: isDark
                                                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(147, 51, 234, 0.9))'
                                                : 'linear-gradient(135deg, rgba(250, 245, 255, 0.95), rgba(233, 213, 255, 0.9))',
                                            color: isDark ? 'rgba(196, 181, 253, 0.95)' : 'rgba(147, 51, 234, 0.9)',
                                            border: isDark
                                                ? '1px solid rgba(168, 85, 247, 0.3)'
                                                : '1px solid rgba(233, 213, 255, 0.6)',
                                            boxShadow: isDark
                                                ? '0 2px 8px rgba(168, 85, 247, 0.15)'
                                                : '0 2px 8px rgba(168, 85, 247, 0.1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-1px)'
                                            e.currentTarget.style.background = isDark
                                                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(147, 51, 234, 1))'
                                                : 'linear-gradient(135deg, rgba(245, 243, 255, 0.95), rgba(221, 214, 254, 0.9))'
                                            e.currentTarget.style.boxShadow = isDark
                                                ? '0 4px 12px rgba(168, 85, 247, 0.25)'
                                                : '0 4px 12px rgba(168, 85, 247, 0.15)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.background = isDark
                                                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(147, 51, 234, 0.9))'
                                                : 'linear-gradient(135deg, rgba(250, 245, 255, 0.95), rgba(233, 213, 255, 0.9))'
                                            e.currentTarget.style.boxShadow = isDark
                                                ? '0 2px 8px rgba(168, 85, 247, 0.15)'
                                                : '0 2px 8px rgba(168, 85, 247, 0.1)'
                                        }}
                                        onClick={() => openTasyModal(pdf)}
                                        title="Enviar para TASY"
                                    >
                                        <Send className="w-4 h-4 pdf-icon" />
                                        <span>TASY</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                                                                    <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1 pdf-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                    <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-1 pdf-icon" />
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
                                    <Edit3 className="w-4 h-4 pdf-icon" />
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
                                <Database className="w-5 h-5 text-purple-500 pdf-icon" />
                                <div className="flex-1">
                                    <h4 className={twMerge(
                                        'font-medium text-sm',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        {tasyModal.selectedPdf?.title}
                                    </h4>
                                    <p className={twMerge(
                                        'text-xs mt-1',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        {tasyModal.selectedPdf?.fileName}
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
                                <Loader2 className="w-4 h-4 animate-spin pdf-icon" />
                                Buscando contas...
                            </p>
                        )}
                    </div>

                    {/* Select de Conta Encontrada */}
                    {hasValidAccounts(tasyModal.contasPaciente) && (
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

                    {/* Campo de entrada manual para número da conta - quando não há resultados */}
                    {tasyModal.isManualEntry && (
                        <div className="space-y-2">
                            <label className={twMerge(
                                'block text-sm font-medium',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Número da Conta Médica (Entrada Manual)
                            </label>
                            
                            <div className={twMerge(
                                'text-xs p-3 rounded border mb-3',
                                isDark ? 'bg-orange-900/20 border-orange-700 text-orange-300' : 'bg-orange-50 border-orange-200 text-orange-700'
                            )}>
                                ℹ️ Nenhuma conta foi encontrada automaticamente. Digite o número da conta médica manualmente.
                            </div>

                            <input
                                type="text"
                                value={tasyModal.selectedConta}
                                onChange={(e) => {
                                    const value = e.target.value.trim()
                                    // Permitir apenas números
                                    if (value === '' || /^\d+$/.test(value)) {
                                        setTasyModal(prev => ({ ...prev, selectedConta: value }))
                                    }
                                }}
                                placeholder="Digite o número da conta (apenas números, ex: 2692870)"
                                className={twMerge(
                                    'w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                                    isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                )}
                                disabled={tasyModal.isSending}
                            />
                            <p className={twMerge(
                                'text-xs',
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            )}>
                                Informe o número da conta médica conforme disponível no sistema TASY
                            </p>
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
                                Conta Médica {tasyModal.isManualEntry ? 'Inserida Manualmente' : 'Selecionada'}
                            </h4>
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-purple-500 pdf-icon" />
                                <span className={twMerge(
                                    'font-mono text-sm',
                                    isDark ? 'text-purple-300' : 'text-purple-700'
                                )}>
                                    {tasyModal.isManualEntry 
                                        ? `Conta: ${tasyModal.selectedConta} (Manual)` 
                                        : tasyModal.contasPaciente.find(c => c.contaPaciente === tasyModal.selectedConta)?.displayText
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Aviso sobre status do NAS */}
                    {nasStatus.status !== 'online' && (
                        <div className={twMerge(
                            'p-3 rounded-lg border text-sm',
                            isDark 
                                ? 'bg-red-900/20 border-red-700 text-red-300' 
                                : 'bg-red-50 border-red-200 text-red-700'
                        )}>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <div>
                                    <strong>NAS Offline:</strong> O servidor NAS está {nasStatus.status === 'offline' ? 'offline' : 'com erro'}. 
                                    O envio para TASY está desabilitado até que a conexão seja restabelecida.
                                    {nasStatus.message && (
                                        <div className="text-xs mt-1 opacity-80">
                                            Motivo: {nasStatus.message}
                                        </div>
                                    )}
                                </div>
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
                            disabled={!tasyModal.selectedConta || tasyModal.isSending || nasStatus.status !== 'online'}
                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            title={nasStatus.status !== 'online' ? 'NAS offline - Envio desabilitado' : ''}
                        >
                            {tasyModal.isSending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2 pdf-icon" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2 pdf-icon" />
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
