
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useThemeClasses, useMainBackground } from '@/hooks/useThemeClasses'
import { ConnectionStatus } from '@/components/ui/ConnectionStatus'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { twMerge } from 'tailwind-merge'
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr'
import {
    Wifi,
    WifiOff,
    Loader2,
    Heart,
    User,
    Clock,
    Scale,
    TrendingUp,
    TrendingDown,
    Activity,
    Monitor,
    Target,
    Maximize,
    Minimize,
    Info,
    AlertTriangle,
    Search,
    X
} from 'lucide-react'

// Interfaces baseadas no novo formato de resposta
interface ISinalVital {
    nR_SEQUENCIA: number
    dT_SINAL_VITAL: string
    qT_SATURACAO_O2: number
    qT_TEMP: number
    qT_PESO: number
    qT_ALTURA_CM: number
    // Campos opcionais de Pressão Arterial (podem não vir em todos os registros)
    qT_PA_SISTOLICA?: number
    qT_PA_DIASTOLICA?: number
    diferencaPercentual: number
    alteracaoMaior10: boolean
}

interface IPatientData {
    cD_PACIENTE: string
    nM_PACIENTE: string
    dT_SINAL_VITAL: string
    comparacaoDtos: ISinalVital[]
    // Campo vindo da API para filtrar cards
    motivo_ATENDIMENTO?: string
    motivO_ATENDIMENTO?: string // variação de capitalização reportada
}

interface IConnectionStatus {
    status: 'disconnected' | 'connecting' | 'connected' | 'error'
    connectionId?: string
    error?: string
}

const WebhookMonitor = () => {
    const { isDark } = useTheme()
    const themeClasses = useThemeClasses()
    const mainBackground = useMainBackground()
    const [ , setConnection ] = useState<HubConnection | null>(null)
    const [ connectionStatus, setConnectionStatus ] = useState<IConnectionStatus>({ status: 'disconnected' })
    const [ patientDataHistory, setPatientDataHistory ] = useState<(IPatientData & { timestamp: Date })[]>([])
    const [ , setLogs ] = useState<string[]>([])
    const [ , setLastUpdate ] = useState<Date | null>(null)
    const [ isFullscreen, setIsFullscreen ] = useState<boolean>(false)
    const [ isLoadingInitialData, setIsLoadingInitialData ] = useState<boolean>(false)
    // Tooltip e Filtros
    const [ tooltipVisivel, setTooltipVisivel ] = useState<string | null>(null)
    const [ tooltipSide, setTooltipSide ] = useState<'left' | 'right'>('right')
    const [ mostrarFiltros, setMostrarFiltros ] = useState<boolean>(false)
    // Filtro por motivo do atendimento
    const [ filtroMotivos, setFiltroMotivos ] = useState<string[]>([])
    // Filtro por nome/ID do paciente
    const [ filtroPaciente, setFiltroPaciente ] = useState<string>('')

    // Adicionar log com timestamp
    const addLog = useCallback((message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [ `[${timestamp}] ${message}`, ...prev ].slice(0, 30))
    }, [])

    // Função para obter token de autenticação
    // Função para obter token via API server-side protegida (para SignalR)
    const getAuthToken = useCallback(async () => {
        try {
            const response = await fetch('/api/auth-token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`Erro na API de token: ${response.status}`)
            }

            const result = await response.json()

            if (result.success && result.token) {
                return result.token
            } else {
                throw new Error(result.error || 'Token não obtido')
            }
        } catch (error: any) {
            addLog(`❌ Erro ao obter token: ${error.message}`)
            return null
        }
    }, [ addLog ])

    const obterMotivoAtendimento = useCallback((p: IPatientData): string => {
        const anyP: any = p as any
        const valor: string | undefined = anyP?.motivo_ATENDIMENTO || anyP?.motivO_ATENDIMENTO || p.motivo_ATENDIMENTO || p.motivO_ATENDIMENTO
        return (typeof valor === 'string' && valor.trim().length > 0) ? valor.trim() : 'Sem motivo'
    }, [])

    const motivosDisponiveis = useMemo(() => {
        const set = new Set<string>()
        for (const p of patientDataHistory) {
            set.add(obterMotivoAtendimento(p))
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
    }, [ patientDataHistory, obterMotivoAtendimento ])

    // Cores determinísticas por motivo do atendimento
    const getMotivoColorClasses = useCallback((motivo: string) => {
        const light = [
            { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
            { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
            { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800' },
            { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
            { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
            { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700' },
            { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700' },
            { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700' },
            { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-700' },
            { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
        ]
        const dark = [
            { bg: 'bg-blue-900/30', border: 'border-blue-700', text: 'text-blue-300' },
            { bg: 'bg-green-900/30', border: 'border-green-700', text: 'text-green-300' },
            { bg: 'bg-amber-900/30', border: 'border-amber-700', text: 'text-amber-300' },
            { bg: 'bg-red-900/30', border: 'border-red-700', text: 'text-red-300' },
            { bg: 'bg-purple-900/30', border: 'border-purple-700', text: 'text-purple-300' },
            { bg: 'bg-indigo-900/30', border: 'border-indigo-700', text: 'text-indigo-300' },
            { bg: 'bg-teal-900/30', border: 'border-teal-700', text: 'text-teal-300' },
            { bg: 'bg-rose-900/30', border: 'border-rose-700', text: 'text-rose-300' },
            { bg: 'bg-cyan-900/30', border: 'border-cyan-700', text: 'text-cyan-300' },
            { bg: 'bg-orange-900/30', border: 'border-orange-700', text: 'text-orange-300' },
        ]
        const palette = isDark ? dark : light

        // Hash simples para index determinístico
        let h = 0
        for (let i = 0; i < motivo.length; i++) {
            h = (h * 31 + motivo.charCodeAt(i)) >>> 0
        }
        const idx = motivo ? h % palette.length : 0
        return palette[ idx ]
    }, [ isDark ])

    // Determinar lado do tooltip (direita/esquerda) conforme espaço disponível
    const handleShowTooltip = useCallback((id: string, e: React.MouseEvent<HTMLElement>) => {
        try {
            const trigger = e.currentTarget as HTMLElement
            const rect = trigger.getBoundingClientRect()
            const tooltipWidth = window.innerWidth < 640 ? 320 : 384 // w-80 para mobile, w-96 para desktop
            const margin = 8 // ml-2/mr-2 ~ 8px
            const spaceRight = window.innerWidth - rect.right
            if (spaceRight < tooltipWidth + margin) {
                setTooltipSide('left')
            } else {
                setTooltipSide('right')
            }
        } catch (_) {
            setTooltipSide('right')
        }
        setTooltipVisivel(id)
    }, [])

    const handleToggleTooltip = useCallback((id: string, e: React.MouseEvent<HTMLElement>) => {
        if (tooltipVisivel === id) {
            setTooltipVisivel(null)
            return
        }
        handleShowTooltip(id, e)
    }, [ tooltipVisivel, handleShowTooltip ])

    // Classificação de pressão arterial com classes de cor para claro/escuro
    const classificarPressaoArterial = useCallback((pas: number, pad: number) => {
        // Normal
        if ((pas >= 90 && pas <= 150) && (pad >= 60 && pad <= 100)) {
            return {
                nivel: 'normal',
                titulo: 'Paciente assintomático',
                conduta: 'Sem ação',
                cor: {
                    bg: 'bg-green-50',
                    border: 'border-green-600',
                    text: 'text-green-700',
                    bgDark: 'bg-green-900/20',
                    borderDark: 'border-green-500',
                    textDark: 'text-green-300'
                }
            }
        }
        // Hipotensão
        if (pas < 90 || pad < 60) {
            return {
                nivel: 'hipotensao',
                titulo: 'Hipotensão – Paciente assintomático',
                conduta: 'Acionar plantonista para avaliação do paciente',
                cor: {
                    bg: 'bg-blue-50',
                    border: 'border-blue-600',
                    text: 'text-blue-700',
                    bgDark: 'bg-blue-900/20',
                    borderDark: 'border-blue-500',
                    textDark: 'text-blue-300'
                }
            }
        }
        // Urgência hipertensiva
        if (pas > 180 || pad > 110) {
            return {
                nivel: 'urgencia',
                titulo: 'Urgência hipertensiva – Paciente assintomático',
                conduta: 'Acionar plantonista para avaliação do paciente',
                cor: {
                    bg: 'bg-red-100',
                    border: 'border-red-600',
                    text: 'text-red-800',
                    bgDark: 'bg-red-900/30',
                    borderDark: 'border-red-500',
                    textDark: 'text-red-300'
                }
            }
        }
        // Crise hipertensiva
        if ((pas >= 150 && pas <= 180) || (pad >= 90 && pad <= 110)) {
            return {
                nivel: 'crise',
                titulo: 'Crise hipertensiva – Paciente assintomático',
                conduta: 'Captopril 25mg • Atenolol 0,10mg',
                cor: {
                    bg: 'bg-orange-50',
                    border: 'border-orange-600',
                    text: 'text-orange-800',
                    bgDark: 'bg-orange-900/30',
                    borderDark: 'border-orange-500',
                    textDark: 'text-orange-300'
                }
            }
        }
        // Fallback
        return {
            nivel: 'indefinido',
            titulo: 'Classificação indisponível',
            conduta: 'Avaliar clinicamente',
            cor: {
                bg: 'bg-gray-50',
                border: 'border-gray-500',
                text: 'text-gray-700',
                bgDark: 'bg-gray-700/40',
                borderDark: 'border-gray-400',
                textDark: 'text-gray-200'
            }
        }
    }, [])

    // Função para buscar dados iniciais dos sinais vitais
    // Função para buscar dados iniciais via API server-side protegida
    const fetchInitialData = useCallback(async () => {
        try {
            setIsLoadingInitialData(true)
            addLog('🔄 Buscando dados iniciais via servidor protegido...')

            const response = await fetch('/api/initial-data', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const result = await response.json()

            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                // Converter para formato com timestamp
                const dataWithTimestamp = result.data.map((patient: IPatientData) => ({
                    ...patient,
                    timestamp: new Date()
                }))

                setPatientDataHistory(dataWithTimestamp)
                addLog(`✅ ${result.data.length} pacientes carregados pelo servidor`)

                // Log detalhado dos dados carregados
                result.data.forEach((patient: IPatientData) => {
                    addLog(`👤 ${patient.nM_PACIENTE}: ${patient.comparacaoDtos?.length || 0} sinais`)
                })
            } else if (result.success) {
                addLog('ℹ️ Nenhum dado inicial encontrado')
            } else {
                throw new Error(result.error || 'Erro desconhecido na API')
            }
        } catch (error: any) {
            let errorMessage = error.message || 'Erro desconhecido'

            if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                errorMessage = '🔒 Erro de autenticação no servidor'
                addLog('💡 Verifique as credenciais PRONUTRIR_USERNAME e PRONUTRIR_PASSWORD')
            } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
                errorMessage = '🚫 Acesso negado pela API externa'
            } else if (errorMessage.includes('404')) {
                errorMessage = '🔍 Endpoint não encontrado'
            } else if (errorMessage.includes('500')) {
                errorMessage = '⚠️ Erro interno do servidor'
            }

            addLog(`❌ ${errorMessage}`)
            console.error('Erro detalhado:', {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            })
        } finally {
            setIsLoadingInitialData(false)
        }
    }, [ addLog ])
    // Função para entrar/sair da tela cheia
    const toggleFullscreen = useCallback(async () => {
        try {
            if (!isFullscreen) {
                // Entrar em tela cheia
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen()
                }
                setIsFullscreen(true)
                addLog('📺 Modo tela cheia ativado')
            } else {
                // Sair da tela cheia
                if (document.exitFullscreen) {
                    await document.exitFullscreen()
                }
                setIsFullscreen(false)
                addLog('📺 Modo tela cheia desativado')
            }
        } catch (error: any) {
            addLog(`❌ Erro ao alterar tela cheia: ${error.message}`)
        }
    }, [ isFullscreen, addLog ])

    // Detectar mudanças na tela cheia (quando usuário pressiona ESC)
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!document.fullscreenElement
            setIsFullscreen(isCurrentlyFullscreen)

            if (!isCurrentlyFullscreen) {
                addLog('📺 Modo tela cheia desativado (ESC)')
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'F11') {
                event.preventDefault()
                toggleFullscreen()
            }
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [ isFullscreen, toggleFullscreen, addLog ])

    // Processar dados recebidos (sem validações - confiar na API)
    const processPatientData = useCallback((data: any) => {
        try {
            let parsedData: IPatientData

            if (typeof data === 'string') {
                parsedData = JSON.parse(data)
            } else {
                parsedData = data as IPatientData
            }

            // Adicionar dados ao histórico ao invés de substituir, removendo duplicados
            const newEntry = {
                ...parsedData,
                timestamp: new Date()
            }

            addLog(`👤 Dados recebidos: ${parsedData.nM_PACIENTE}`)
            addLog(`📊 ${parsedData.comparacaoDtos?.length || 0} sinais vitais`)

            // Atualizar ou adicionar dados do paciente
            setPatientDataHistory(prev => {
                const existingIndex = prev.findIndex(existing => existing.cD_PACIENTE === parsedData.cD_PACIENTE)

                if (existingIndex >= 0) {
                    // Paciente já existe - atualizar os dados
                    const updated = [ ...prev ]
                    updated[ existingIndex ] = newEntry
                    addLog(`🔄 Dados atualizados para: ${parsedData.nM_PACIENTE}`)
                    return updated
                } else {
                    // Novo paciente - adicionar ao histórico
                    addLog(`➕ Novo paciente adicionado: ${parsedData.nM_PACIENTE}`)
                    return [ newEntry, ...prev ].slice(0, 50)
                }
            })
            setLastUpdate(new Date())

        } catch (error: any) {
            addLog(`❌ Erro: ${error.message}`)
        }
    }, [ addLog ])

    // Buscar dados iniciais
    useEffect(() => {
        fetchInitialData()
    }, [ fetchInitialData ])

    // Configurar conexão SignalR (client-side)
    useEffect(() => {
        let hubConnection: HubConnection | null = null

        const startConnection = async () => {
            try {
                addLog('🔄 Obtendo token para SignalR...')
                setConnectionStatus({ status: 'connecting' })

                const token = await getAuthToken()
                if (!token) {
                    addLog('❌ Falha na autenticação para SignalR')
                    setConnectionStatus({ status: 'error', error: 'Token não obtido' })
                    return
                }

                addLog('🔄 Iniciando conexão SignalR...')

                hubConnection = new HubConnectionBuilder()
                    .withUrl('/signalr/notify-hub', {
                        accessTokenFactory: () => token,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    })
                    .withAutomaticReconnect()
                    .configureLogging(LogLevel.Information)
                    .build()

                // Eventos de conexão
                hubConnection.onclose((error) => {
                    const message = error ? `Conexão fechada: ${error.message}` : 'Conexão fechada'
                    addLog(`🔌 ${message}`)
                    setConnectionStatus({ status: 'disconnected', error: error?.message })
                })

                hubConnection.onreconnecting(() => {
                    addLog('🔄 Reconectando...')
                    setConnectionStatus({ status: 'connecting' })
                })

                hubConnection.onreconnected((connId) => {
                    addLog(`✅ Reconectado! ID: ${connId}`)
                    setConnectionStatus({ status: 'connected', connectionId: connId })
                })

                // Handler para mensagens
                hubConnection.on("ReceiveMessage", (message: any) => {
                    addLog(`📨 Mensagem recebida via SignalR`)
                    processPatientData(message)
                })

                // Conectar
                await hubConnection.start()

                addLog(`✅ Conexão SignalR estabelecida! ID: ${hubConnection.connectionId}`)
                setConnectionStatus({
                    status: 'connected',
                    connectionId: hubConnection.connectionId || undefined
                })

                setConnection(hubConnection)

            } catch (error: any) {
                addLog(`❌ Erro na conexão SignalR: ${error.message}`)
                setConnectionStatus({ status: 'error', error: error.message })
            }
        }

        startConnection()

        return () => {
            if (hubConnection) {
                hubConnection.stop()
                addLog('🔌 Conexão SignalR encerrada')
            }
        }
    }, [ addLog, getAuthToken, processPatientData ])

    // Status da conexão otimizado com componente memoizado
    const renderConnectionStatus = () => (
        <ConnectionStatus
            connectionStatus={connectionStatus}
            isLoadingInitialData={isLoadingInitialData}
            isDark={isDark}
        />
    )

    return (
        <div
            className={twMerge(
                "w-full flex flex-col transition-all duration-300",
                isFullscreen ? "fixed inset-0 z-50 h-screen" : "min-h-screen"
            )}
            style={{ background: mainBackground }}
        >
            {/* Container principal estendido para toda a tela */}
            <div className={twMerge(
                "flex-1 flex flex-col gap-2 sm:gap-4",
                isFullscreen
                    ? "px-2 sm:px-3 py-2 sm:py-3 h-full"
                    : "px-2 sm:px-3 md:px-4 py-3 sm:py-4 min-h-screen"
            )}>
                {/* Header */}
                <div className={twMerge(
                    "w-full shrink-0",
                    isFullscreen && "pb-2"
                )}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h1 className={twMerge(
                                'font-bold truncate',
                                isFullscreen
                                    ? 'text-xl sm:text-2xl'
                                    : 'text-2xl sm:text-3xl',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                📊 Monitor de Sinais Vitais {isFullscreen && '(Tela Cheia)'}
                            </h1>
                            {!isFullscreen && (
                                <p className={twMerge(
                                    'mt-1 text-base',
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                )}>
                                    Monitoramento de Sinais Vitais e Peso
                                </p>
                            )}
                            {patientDataHistory.length > 0 && (
                                <p className={twMerge(
                                    'mt-2 text-base font-medium',
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                )}>
                                    👥 {patientDataHistory.length} pacientes monitorados
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-end sm:justify-start">
                            {/* Status da Conexão */}
                            {renderConnectionStatus()}

                            {/* Botão Tela Cheia */}
                            <button
                                onClick={toggleFullscreen}
                                className={twMerge(
                                    'relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2 transition-all duration-300',
                                    'transform hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm',
                                    isFullscreen
                                        ? (isDark
                                            ? 'bg-gradient-to-r from-orange-900/50 to-red-800/50 border-orange-600 text-orange-200 shadow-lg shadow-orange-900/30'
                                            : 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-400 text-white shadow-lg shadow-orange-500/30')
                                        : (isDark
                                            ? 'bg-gray-700/60 border-gray-600 text-gray-300 hover:bg-gray-700/80 hover:border-gray-500'
                                            : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md')
                                )}
                                title={isFullscreen ? 'SAIR DA TELA CHEIA' : 'ATIVAR TELA CHEIA'}
                            >
                                {isFullscreen && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/20 to-red-500/20 animate-pulse"></div>
                                )}
                                {isFullscreen ? (
                                    <>
                                        <Minimize size={14} className="sm:hidden relative z-10" />
                                        <Minimize size={18} className="hidden sm:block relative z-10" />
                                        <span className="hidden sm:inline relative z-10">SAIR</span>
                                    </>
                                ) : (
                                    <>
                                        <Maximize size={14} className="sm:hidden" />
                                        <Maximize size={18} className="hidden sm:block" />
                                        <span className="hidden sm:inline">TELA CHEIA</span>
                                    </>
                                )}
                                {isFullscreen && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white dark:border-gray-800 animate-bounce"></div>
                                )}
                            </button>

                            {/* Botão Recarregar Dados */}
                            <button
                                onClick={fetchInitialData}
                                disabled={isLoadingInitialData}
                                className={twMerge(
                                    'relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2 transition-all duration-300',
                                    'transform hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0',
                                    isLoadingInitialData
                                        ? (isDark
                                            ? 'bg-gradient-to-r from-blue-900/50 to-cyan-800/50 border-blue-600 text-blue-200 shadow-lg shadow-blue-900/30'
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400 text-white shadow-lg shadow-blue-500/30')
                                        : (isDark
                                            ? 'bg-gray-700/60 border-gray-600 text-gray-300 hover:bg-gray-700/80 hover:border-gray-500'
                                            : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md')
                                )}
                                title="RECARREGAR DADOS INICIAIS"
                            >
                                {isLoadingInitialData && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-500/20 animate-pulse"></div>
                                )}
                                {isLoadingInitialData ? (
                                    <>
                                        <Loader2 size={14} className="dashboard-icon animate-spin relative z-10 sm:hidden" />
                                        <Loader2 size={18} className="dashboard-icon animate-spin relative z-10 hidden sm:block" />
                                    </>
                                ) : (
                                    <>
                                        <Activity size={14} className="dashboard-icon sm:hidden" />
                                        <Activity size={18} className="dashboard-icon hidden sm:block" />
                                    </>
                                )}
                                <span className="hidden sm:inline relative z-10">
                                    {isLoadingInitialData ? 'CARREGANDO...' : 'RECARREGAR'}
                                </span>
                                {isLoadingInitialData && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white dark:border-gray-800 animate-bounce"></div>
                                )}
                            </button>

                            {/* Filtros simples */}
                            <button
                                onClick={() => setMostrarFiltros(v => !v)}
                                className={twMerge(
                                    'relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2 transition-all duration-300',
                                    'transform hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm',
                                    mostrarFiltros
                                        ? (isDark
                                            ? 'bg-gradient-to-r from-purple-900/50 to-violet-800/50 border-purple-600 text-purple-200 shadow-lg shadow-purple-900/30'
                                            : 'bg-gradient-to-r from-purple-500 to-violet-600 border-purple-400 text-white shadow-lg shadow-purple-500/30')
                                        : (isDark
                                            ? 'bg-gray-700/60 border-gray-600 text-gray-300 hover:bg-gray-700/80 hover:border-gray-500'
                                            : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md')
                                )}
                                title="FILTRAR EXIBIÇÃO"
                            >
                                {mostrarFiltros && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-violet-500/20 animate-pulse"></div>
                                )}
                                <Target size={14} className="dashboard-icon relative z-10 sm:hidden" />
                                <Target size={18} className="dashboard-icon relative z-10 hidden sm:block" />
                                <span className="hidden sm:inline relative z-10">FILTROS</span>
                                {mostrarFiltros && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full border-2 border-white dark:border-gray-800 animate-bounce"></div>
                                )}
                            </button>

                            {/* Theme Toggle */}
                            <ThemeToggle size="sm" />
                        </div>
                    </div>

                </div>

                {/* Conteúdo principal */}
                <div className={twMerge(
                    "flex-1 flex flex-col",
                    isFullscreen ? "overflow-hidden" : "overflow-visible"
                )}>
                    {/* Painel de filtros */}
                    {mostrarFiltros && (
                        <div className={`mt-2 p-3 sm:p-4 rounded-xl border ${themeClasses.filterPanelBg} ${themeClasses.filterPanelBorder}`}>
                            {/* Filtro por Nome/ID do Paciente */}
                            <div className="mb-4 sm:mb-6">
                                <div className={twMerge('text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2', isDark ? 'text-gray-100' : 'text-gray-900')}>
                                    <Search size={14} className="dashboard-icon sm:hidden" />
                                    <Search size={16} className="dashboard-icon hidden sm:block" />
                                    <span className="hidden sm:inline">BUSCAR PACIENTE</span>
                                    <span className="sm:hidden">BUSCAR</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={filtroPaciente}
                                        onChange={(e) => setFiltroPaciente(e.target.value)}
                                        placeholder="Nome ou ID do paciente..."
                                        className={twMerge(
                                            'w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-lg sm:rounded-xl border-2 text-sm font-medium transition-all duration-300',
                                            'focus:outline-none focus:ring-0 focus:border-blue-500 focus:shadow-lg',
                                            isDark
                                                ? 'bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-700/80'
                                                : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                                        )}
                                    />
                                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                                        <Search size={14} className={twMerge('dashboard-icon sm:hidden', isDark ? 'text-gray-400' : 'text-gray-500')} />
                                        <Search size={16} className={twMerge('dashboard-icon hidden sm:block', isDark ? 'text-gray-400' : 'text-gray-500')} />
                                    </div>
                                    {filtroPaciente && (
                                        <button
                                            onClick={() => setFiltroPaciente('')}
                                            className={twMerge(
                                                'absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors',
                                                isDark
                                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/50'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                            )}
                                            title="Limpar busca"
                                        >
                                            <X size={12} className="sm:hidden" />
                                            <X size={14} className="hidden sm:block" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filtro por Motivo do Atendimento */}
                            <div>
                                <div className={twMerge('text-base font-bold mb-4 flex items-center gap-2', isDark ? 'text-gray-100' : 'text-gray-900')}>
                                    <Target size={16} className="dashboard-icon" />
                                    MOTIVO DO ATENDIMENTO
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        className={twMerge(
                                            'relative px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-300',
                                            'transform hover:scale-105 hover:-translate-y-0.5',
                                            filtroMotivos.length === 0
                                                ? (isDark
                                                    ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-600 text-blue-200 shadow-lg shadow-blue-900/30'
                                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30')
                                                : (isDark
                                                    ? 'bg-gray-700/60 border-gray-600 text-gray-300 hover:bg-gray-700/80 hover:border-gray-500'
                                                    : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md')
                                        )}
                                        onClick={() => setFiltroMotivos([])}
                                        title="Mostrar todos os motivos"
                                    >
                                        {filtroMotivos.length === 0 && (
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-blue-500/20 animate-pulse"></div>
                                        )}
                                        <span className="relative">TODOS</span>
                                    </button>
                                    {motivosDisponiveis.map(m => {
                                        const ativo = filtroMotivos.includes(m)
                                        return (
                                            <button
                                                key={m}
                                                type="button"
                                                className={twMerge(
                                                    'relative px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-300',
                                                    'transform hover:scale-105 hover:-translate-y-0.5',
                                                    ativo
                                                        ? (isDark
                                                            ? 'bg-gradient-to-r from-green-900/50 to-emerald-800/50 border-green-600 text-green-200 shadow-lg shadow-green-900/30'
                                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white shadow-lg shadow-green-500/30')
                                                        : (isDark
                                                            ? 'bg-gray-700/60 border-gray-600 text-gray-300 hover:bg-gray-700/80 hover:border-gray-500'
                                                            : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md')
                                                )}
                                                onClick={() => setFiltroMotivos(prev => ativo ? prev.filter(x => x !== m) : [ ...prev, m ])}
                                                title={`${ativo ? 'Remover' : 'Adicionar'} filtro: ${m}`}
                                            >
                                                {ativo && (
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-500/20 animate-pulse"></div>
                                                )}
                                                <span className="relative">{m.toUpperCase()}</span>
                                                {ativo && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-bounce"></div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Cards dos Pacientes - Grid Horizontal */}
                    <div className={twMerge(
                        "flex-1",
                        isFullscreen ? "overflow-hidden" : "min-h-0"
                    )}>
                        {patientDataHistory.length > 0 ? (
                            <div className={twMerge(
                                "overflow-y-auto",
                                isFullscreen
                                    ? "h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-3"
                                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-2"
                            )}>
                                {patientDataHistory
                                    .filter(p => {
                                        // Filtro por motivo
                                        const motivoMatch = filtroMotivos.length === 0 || filtroMotivos.includes(obterMotivoAtendimento(p))
                                        // Filtro por nome/ID do paciente
                                        const pacienteMatch = !filtroPaciente ||
                                            p.nM_PACIENTE.toLowerCase().includes(filtroPaciente.toLowerCase()) ||
                                            p.cD_PACIENTE.toLowerCase().includes(filtroPaciente.toLowerCase())
                                        return motivoMatch && pacienteMatch
                                    })
                                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                                    .map((patientData, patientIndex) => {
                                        const cardHasOpenTooltip = patientData.comparacaoDtos?.some(s => `pa-${s.nR_SEQUENCIA}` === tooltipVisivel) || false
                                        return (
                                            <div
                                                key={patientIndex}
                                                className={twMerge(
                                                    'group cursor-default rounded-xl border transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm relative overflow-visible',
                                                    cardHasOpenTooltip ? 'z-[100]' : '',
                                                    isDark
                                                        ? 'bg-gray-800/95 border-gray-700/50 hover:border-gray-600/60'
                                                        : 'bg-white/95 border-gray-200/50 hover:border-gray-300/60'
                                                )}
                                                style={{
                                                    boxShadow: isDark
                                                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                                                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(59, 130, 246, 0.05)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.boxShadow = isDark
                                                        ? '0 8px 12px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.2)'
                                                        : '0 8px 12px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(59, 130, 246, 0.15)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow = isDark
                                                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                                                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(59, 130, 246, 0.05)'
                                                }}
                                            >
                                                <div className="h-full">
                                                    {/* Header do Paciente */}
                                                    <div className={twMerge(
                                                        'rounded-t-xl p-3 sm:p-4 border-b transition-colors duration-300',
                                                        isDark
                                                            ? 'bg-gray-800/50 border-gray-700/50'
                                                            : 'bg-gray-50/50 border-gray-200/50'
                                                    )}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                                                <div className={twMerge(
                                                                    'p-1.5 sm:p-2 rounded-lg',
                                                                    isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                                                                )}>
                                                                    <User size={18} className={twMerge(
                                                                        'dashboard-icon sm:hidden',
                                                                        isDark ? 'text-blue-400' : 'text-blue-600'
                                                                    )} />
                                                                    <User size={22} className={twMerge(
                                                                        'dashboard-icon hidden sm:block',
                                                                        isDark ? 'text-blue-400' : 'text-blue-600'
                                                                    )} />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <h3 className={twMerge(
                                                                        'text-base font-semibold break-words leading-tight',
                                                                        isDark ? 'text-white' : 'text-gray-900'
                                                                    )}>{patientData.nM_PACIENTE}</h3>
                                                                    <p className={twMerge(
                                                                        'text-sm break-all',
                                                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                                                    )}>ID: {patientData.cD_PACIENTE}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right min-w-0">
                                                                <div className={twMerge(
                                                                    'flex items-center gap-1 text-sm',
                                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                                )}>
                                                                    <Clock size={14} className="dashboard-icon" />
                                                                    <span>Recebido</span>
                                                                </div>
                                                                <p className={twMerge(
                                                                    'text-sm font-mono',
                                                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                                                )}>
                                                                    {new Date(patientData.dT_SINAL_VITAL).toLocaleTimeString()}
                                                                </p>
                                                                {/* Badge Motivo do Atendimento */}
                                                                <div className="mt-2 flex justify-end">
                                                                    {(() => {
                                                                        const motivo = obterMotivoAtendimento(patientData)
                                                                        const isDefault = motivo === 'Sem motivo'
                                                                        const color = getMotivoColorClasses(motivo)
                                                                        return (
                                                                            <span
                                                                                title={`Motivo do atendimento: ${motivo}`}
                                                                                className={twMerge(
                                                                                    'inline-flex items-center max-w-[16rem] truncate px-2 py-1 rounded text-xs font-semibold border',
                                                                                    isDefault
                                                                                        ? (isDark ? 'bg-gray-700/40 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700')
                                                                                        : `${color.bg} ${color.border} ${color.text}`
                                                                                )}
                                                                            >
                                                                                {motivo}
                                                                            </span>
                                                                        )
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Sinais Vitais */}
                                                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                                                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                            <Activity size={16} className={twMerge(
                                                                'dashboard-icon sm:hidden',
                                                                isDark ? 'text-blue-400' : 'text-blue-600'
                                                            )} />
                                                            <Activity size={20} className={twMerge(
                                                                'dashboard-icon hidden sm:block',
                                                                isDark ? 'text-blue-400' : 'text-blue-600'
                                                            )} />
                                                            <span className={twMerge(
                                                                'text-base font-medium',
                                                                isDark ? 'text-white' : 'text-gray-900'
                                                            )}>Sinais Vitais ({patientData.comparacaoDtos.length})</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 min-h-fit">
                                                            {(() => {
                                                                // Determina quais tipos de sinais mostrar conforme motivo do atendimento
                                                                const motivoCard = obterMotivoAtendimento(patientData).toLowerCase()
                                                                // Novo requisito: invertido em relação à implementação anterior
                                                                // consultas => Peso + Altura (sem Pressão)
                                                                // quimioterapia => Peso + Pressão Arterial (sem Altura)
                                                                // demais => Peso + Pressão Arterial
                                                                const isConsulta = motivoCard.includes('consulta')
                                                                const isQuimio = motivoCard.includes('quimioterapia')
                                                                const mostrarAltura = isConsulta
                                                                const mostrarPressao = isQuimio || !isConsulta

                                                                return patientData.comparacaoDtos
                                                                    .sort((a, b) => new Date(b.dT_SINAL_VITAL).getTime() - new Date(a.dT_SINAL_VITAL).getTime())
                                                                    .map((sinal: ISinalVital, index: number) => (
                                                                        <div
                                                                            key={sinal.nR_SEQUENCIA}
                                                                            className={twMerge(
                                                                                'relative overflow-visible p-3 rounded-lg border transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm',
                                                                                tooltipVisivel === `pa-${sinal.nR_SEQUENCIA}` ? 'z-[1000]' : '',
                                                                                // Se for o último item ímpar e há mais de 2 itens, ocupar toda a largura
                                                                                patientData.comparacaoDtos.length > 2 &&
                                                                                    index === patientData.comparacaoDtos.length - 1 &&
                                                                                    patientData.comparacaoDtos.length % 2 === 1
                                                                                    ? 'col-span-2' : '',
                                                                                // Estilo diferente para o primeiro item (referência, só se peso válido)
                                                                                index === 0
                                                                                    ? (typeof sinal.qT_PESO === 'number' && Number.isFinite(sinal.qT_PESO) && sinal.qT_PESO > 0
                                                                                        ? (isDark
                                                                                            ? 'bg-green-900/10 border-green-600/40 hover:bg-green-900/20 hover:border-green-500/60'
                                                                                            : 'bg-green-50/60 border-green-200/50 hover:bg-green-50/90 hover:border-green-300/70')
                                                                                        : (isDark
                                                                                            ? 'bg-gray-700/40 border-gray-600/40 hover:bg-gray-700/60 hover:border-gray-500/60'
                                                                                            : 'bg-gray-50/60 border-gray-200/50 hover:bg-gray-100/90 hover:border-gray-300/70'))
                                                                                    // Cores de alerta para sinais com alteração >= 10%
                                                                                    : sinal.alteracaoMaior10
                                                                                        ? isDark
                                                                                            ? 'bg-red-900/10 border-red-600/40 hover:bg-red-900/20 hover:border-red-500/60'
                                                                                            : 'bg-red-50/60 border-red-200/50 hover:bg-red-50/90 hover:border-red-300/70'
                                                                                        : isDark
                                                                                            ? 'bg-gray-700/80 border-gray-600/60 hover:bg-gray-650/90 hover:border-gray-500/70'
                                                                                            : 'bg-gray-50/80 border-gray-200/60 hover:bg-white/90 hover:border-gray-300/70'
                                                                            )}
                                                                            style={{
                                                                                boxShadow: sinal.alteracaoMaior10
                                                                                    ? isDark
                                                                                        ? '0 2px 4px -1px rgba(239, 68, 68, 0.2), 0 1px 2px -1px rgba(239, 68, 68, 0.15), 0 0 10px rgba(239, 68, 68, 0.1)'
                                                                                        : '0 2px 4px -1px rgba(239, 68, 68, 0.15), 0 1px 2px -1px rgba(239, 68, 68, 0.1), 0 0 10px rgba(239, 68, 68, 0.08)'
                                                                                    : index === 0
                                                                                        ? isDark
                                                                                            ? '0 2px 4px -1px rgba(34, 197, 94, 0.15), 0 1px 2px -1px rgba(34, 197, 94, 0.1)'
                                                                                            : '0 2px 4px -1px rgba(34, 197, 94, 0.1), 0 1px 2px -1px rgba(34, 197, 94, 0.06)'
                                                                                        : isDark
                                                                                            ? '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)'
                                                                                            : '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)'
                                                                            }}
                                                                            // title removido para não exibir tooltip genérico no card
                                                                            onMouseEnter={(e) => {
                                                                                e.currentTarget.style.boxShadow = sinal.alteracaoMaior10
                                                                                    ? isDark
                                                                                        ? '0 4px 6px -1px rgba(239, 68, 68, 0.3), 0 2px 4px -1px rgba(239, 68, 68, 0.2), 0 0 15px rgba(239, 68, 68, 0.15)'
                                                                                        : '0 4px 6px -1px rgba(239, 68, 68, 0.25), 0 2px 4px -1px rgba(239, 68, 68, 0.15), 0 0 15px rgba(239, 68, 68, 0.12)'
                                                                                    : index === 0
                                                                                        ? isDark
                                                                                            ? '0 4px 6px -1px rgba(34, 197, 94, 0.25), 0 2px 4px -1px rgba(34, 197, 94, 0.15)'
                                                                                            : '0 4px 6px -1px rgba(34, 197, 94, 0.2), 0 2px 4px -1px rgba(34, 197, 94, 0.1)'
                                                                                        : isDark
                                                                                            ? '0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.08)'
                                                                                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                                            }}
                                                                            onMouseLeave={(e) => {
                                                                                e.currentTarget.style.boxShadow = sinal.alteracaoMaior10
                                                                                    ? isDark
                                                                                        ? '0 2px 4px -1px rgba(239, 68, 68, 0.2), 0 1px 2px -1px rgba(239, 68, 68, 0.15), 0 0 10px rgba(239, 68, 68, 0.1)'
                                                                                        : '0 2px 4px -1px rgba(239, 68, 68, 0.15), 0 1px 2px -1px rgba(239, 68, 68, 0.1), 0 0 10px rgba(239, 68, 68, 0.08)'
                                                                                    : index === 0
                                                                                        ? isDark
                                                                                            ? '0 2px 4px -1px rgba(34, 197, 94, 0.15), 0 1px 2px -1px rgba(34, 197, 94, 0.1)'
                                                                                            : '0 2px 4px -1px rgba(34, 197, 94, 0.1), 0 1px 2px -1px rgba(34, 197, 94, 0.06)'
                                                                                        : isDark
                                                                                            ? '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)'
                                                                                            : '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)'
                                                                            }}
                                                                        >
                                                                            {/* Header com data e horário */}
                                                                            <div className="mb-3">
                                                                                <div className="flex justify-between items-start mb-1">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className={twMerge(
                                                                                            'text-sm font-mono font-semibold truncate',
                                                                                            isDark ? 'text-white' : 'text-gray-900'
                                                                                        )}>#{sinal.nR_SEQUENCIA}</span>
                                                                                        {index === 0 && (
                                                                                            <div className={twMerge(
                                                                                                'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold',
                                                                                                isDark
                                                                                                    ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                                                                                                    : 'bg-green-100 text-green-700 border border-green-300/50'
                                                                                            )}>
                                                                                                <Target size={10} className="dashboard-icon" />
                                                                                                <span>REF</span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className={twMerge(
                                                                                    'flex items-center gap-1 p-1.5 rounded-md border-l-2 transition-colors',
                                                                                    index === 0
                                                                                        ? isDark
                                                                                            ? 'bg-green-900/20 border-green-500'
                                                                                            : 'bg-green-50 border-green-500'
                                                                                        : isDark
                                                                                            ? 'bg-gray-600/30 border-blue-500'
                                                                                            : 'bg-blue-50 border-blue-500'
                                                                                )}>
                                                                                    <Clock size={14} className={twMerge(
                                                                                        'dashboard-icon',
                                                                                        index === 0
                                                                                            ? isDark ? 'text-green-400' : 'text-green-600'
                                                                                            : isDark ? 'text-blue-400' : 'text-blue-600'
                                                                                    )} />
                                                                                    <div className="flex flex-col">
                                                                                        <span className={twMerge(
                                                                                            'text-sm font-mono font-medium',
                                                                                            index === 0
                                                                                                ? isDark ? 'text-green-400' : 'text-green-700'
                                                                                                : isDark ? 'text-blue-400' : 'text-blue-700'
                                                                                        )}>
                                                                                            {new Date(sinal.dT_SINAL_VITAL).toLocaleDateString('pt-BR')}
                                                                                        </span>
                                                                                        <span className={twMerge(
                                                                                            'text-sm font-mono',
                                                                                            index === 0
                                                                                                ? isDark ? 'text-green-300' : 'text-green-600'
                                                                                                : isDark ? 'text-blue-300' : 'text-blue-600'
                                                                                        )}>
                                                                                            {new Date(sinal.dT_SINAL_VITAL).toLocaleTimeString('pt-BR')}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Informações dos sinais vitais */}
                                                                            <div className="space-y-2 mb-2">
                                                                                {/* Peso sempre exibido */}
                                                                                <div className={twMerge(
                                                                                    'flex items-center justify-between p-1 rounded border-l-2 transition-colors',
                                                                                    isDark
                                                                                        ? 'bg-blue-900/20 border-blue-500'
                                                                                        : 'bg-blue-50 border-blue-500'
                                                                                )}>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <Scale size={14} className={twMerge('dashboard-icon', isDark ? 'text-blue-400' : 'text-blue-600')} />
                                                                                        <span className={twMerge(
                                                                                            'text-sm font-medium',
                                                                                            isDark ? 'text-blue-400' : 'text-blue-600'
                                                                                        )}>PESO</span>
                                                                                    </div>
                                                                                    <span className={twMerge(
                                                                                        'font-bold text-lg',
                                                                                        isDark ? 'text-blue-400' : 'text-blue-700'
                                                                                    )}>{sinal.qT_PESO}kg</span>
                                                                                </div>

                                                                                {/* Altura somente para quimioterapia */}
                                                                                {mostrarAltura && (
                                                                                    <div className={twMerge(
                                                                                        'flex items-center justify-between p-1 rounded border-l-2 transition-colors',
                                                                                        isDark
                                                                                            ? 'bg-purple-900/20 border-purple-500'
                                                                                            : 'bg-purple-50 border-purple-500'
                                                                                    )}>
                                                                                        <div className="flex items-center gap-1">
                                                                                            <Activity size={14} className={twMerge('dashboard-icon', isDark ? 'text-purple-400' : 'text-purple-600')} />
                                                                                            <span className={twMerge(
                                                                                                'text-sm font-medium',
                                                                                                isDark ? 'text-purple-300' : 'text-purple-700'
                                                                                            )}>ALTURA</span>
                                                                                        </div>
                                                                                        <span className={twMerge(
                                                                                            'font-bold text-lg',
                                                                                            isDark ? 'text-purple-300' : 'text-purple-700'
                                                                                        )}>{sinal.qT_ALTURA_CM}cm</span>
                                                                                    </div>
                                                                                )}

                                                                                {/* Pressão Arterial somente para consultas (ou motivos que não sejam quimioterapia) */}
                                                                                {mostrarPressao && (sinal.qT_PA_SISTOLICA && sinal.qT_PA_DIASTOLICA) ? (() => {
                                                                                    const pas = sinal.qT_PA_SISTOLICA!
                                                                                    const pad = sinal.qT_PA_DIASTOLICA!
                                                                                    const c = classificarPressaoArterial(pas, pad)
                                                                                    const tooltipId = `pa-${sinal.nR_SEQUENCIA}`
                                                                                    return (
                                                                                        <div className="relative">
                                                                                            <div
                                                                                                className={twMerge(
                                                                                                    'flex items-center justify-between p-1 rounded border-l-2 transition-colors cursor-help',
                                                                                                    isDark
                                                                                                        ? `${c.cor.bgDark} ${c.cor.borderDark}`
                                                                                                        : `${c.cor.bg} ${c.cor.border}`
                                                                                                )}
                                                                                                onMouseEnter={(e) => handleShowTooltip(tooltipId, e)}
                                                                                                onMouseLeave={() => setTooltipVisivel(null)}
                                                                                                onClick={(e) => handleToggleTooltip(tooltipId, e)}
                                                                                            >
                                                                                                <div className="flex items-center gap-1">
                                                                                                    <Heart size={14} className={twMerge('dashboard-icon', isDark ? c.cor.textDark : c.cor.text)} />
                                                                                                    <span className={twMerge('text-sm font-medium', isDark ? c.cor.textDark : c.cor.text)}>PRESSÃO ARTERIAL</span>
                                                                                                    {c.nivel !== 'normal' && (
                                                                                                        <AlertTriangle size={12} className={twMerge('dashboard-icon', isDark ? c.cor.textDark : c.cor.text)} />
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex items-center gap-1">
                                                                                                    <span className={twMerge('text-xs font-semibold px-1 py-0.5 rounded whitespace-nowrap', isDark ? c.cor.textDark : c.cor.text)}>
                                                                                                        {pas}/{pad}
                                                                                                    </span>
                                                                                                    <Info size={12} className={twMerge('dashboard-icon opacity-60', isDark ? c.cor.textDark : c.cor.text)} />
                                                                                                </div>
                                                                                            </div>

                                                                                            {tooltipVisivel === tooltipId && (
                                                                                                <div className={twMerge(
                                                                                                    'absolute z-[9999] p-3 sm:p-4 rounded-lg shadow-lg border backdrop-blur-sm w-80 sm:w-96 max-h-80 sm:max-h-96 overflow-y-auto',
                                                                                                    tooltipSide === 'right' ? '-top-2 left-full ml-1 sm:ml-2' : '-top-2 right-full mr-1 sm:mr-2',
                                                                                                    isDark ? 'bg-gray-800/95 border-gray-700/50 text-white' : 'bg-white/95 border-gray-200/50 text-gray-900'
                                                                                                )}>
                                                                                                    <div className="flex items-center gap-2 mb-3">
                                                                                                        <AlertTriangle size={16} className={twMerge('dashboard-icon', isDark ? c.cor.textDark : c.cor.text)} />
                                                                                                        <span className="font-semibold text-sm">{c.titulo}</span>
                                                                                                    </div>
                                                                                                    <div className="text-sm mb-2"><strong>Valores registrados:</strong> PAS: {pas} | PAD: {pad}</div>
                                                                                                    <div className={twMerge('text-sm font-medium p-2 rounded border-l-4 mb-3', isDark ? `${c.cor.bgDark} ${c.cor.borderDark} ${c.cor.textDark}` : `${c.cor.bg} ${c.cor.border} ${c.cor.text}`)}>
                                                                                                        <strong>Conduta atual:</strong> {c.conduta}
                                                                                                    </div>
                                                                                                    <button
                                                                                                        onClick={() => setTooltipVisivel(null)}
                                                                                                        className={twMerge('absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors', isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900')}
                                                                                                    >
                                                                                                        ×
                                                                                                    </button>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )
                                                                                })() : null}
                                                                            </div>

                                                                            {/* Diferença percentual com destaque (apenas no primeiro item e quando PESO válido > 0) */}
                                                                            {index === 0 && typeof sinal.qT_PESO === 'number' && Number.isFinite(sinal.qT_PESO) && sinal.qT_PESO > 0 && sinal.diferencaPercentual !== 0 && (
                                                                                <div className={twMerge(
                                                                                    "flex items-center justify-center mt-1 p-1 rounded",
                                                                                    Math.abs(sinal.diferencaPercentual) >= 10
                                                                                        ? isDark
                                                                                            ? 'bg-red-900/30 border border-red-700/50'
                                                                                            : 'bg-red-100 border border-red-300/50'
                                                                                        : ''
                                                                                )}>
                                                                                    {sinal.diferencaPercentual > 0 ? (
                                                                                        <TrendingUp size={14} className={twMerge(
                                                                                            'dashboard-icon',
                                                                                            isDark ? 'text-red-400' : 'text-red-600'
                                                                                        )} />
                                                                                    ) : (
                                                                                        <TrendingDown size={14} className={twMerge(
                                                                                            'dashboard-icon',
                                                                                            isDark ? 'text-green-400' : 'text-green-600'
                                                                                        )} />
                                                                                    )}
                                                                                    <span className={twMerge(
                                                                                        'font-bold text-sm ml-1',
                                                                                        Math.abs(sinal.diferencaPercentual) >= 10
                                                                                            ? isDark ? 'text-red-300' : 'text-red-700'
                                                                                            : sinal.diferencaPercentual > 5
                                                                                                ? isDark ? 'text-red-400' : 'text-red-600'
                                                                                                : isDark ? 'text-white' : 'text-gray-700'
                                                                                    )}>
                                                                                        {sinal.diferencaPercentual.toFixed(1)}%
                                                                                    </span>
                                                                                    {Math.abs(sinal.diferencaPercentual) >= 10 && (
                                                                                        <span className={twMerge(
                                                                                            'ml-1 text-base',
                                                                                            isDark ? 'text-red-400' : 'text-red-600'
                                                                                        )}>⚠️</span>
                                                                                    )}
                                                                                </div>
                                                                            )}

                                                                            {/* Alerta de alteração maior que 10% (apenas no primeiro item e quando PESO válido > 0) */}
                                                                            {index === 0 && sinal.alteracaoMaior10 && typeof sinal.qT_PESO === 'number' && Number.isFinite(sinal.qT_PESO) && sinal.qT_PESO > 0 && (
                                                                                <div
                                                                                    className={twMerge(
                                                                                        'mt-1 px-3 py-2 border-2 rounded-lg text-center',
                                                                                        'animate-pulse hover:animate-none hover:scale-105 transition-all duration-300',
                                                                                        'relative overflow-hidden shadow-lg',
                                                                                        isDark
                                                                                            ? 'bg-red-900/30 border-red-500/70 hover:bg-red-900/50 hover:border-red-400'
                                                                                            : 'bg-red-100/90 border-red-400/90 hover:bg-red-200 hover:border-red-500'
                                                                                    )}
                                                                                    style={{
                                                                                        boxShadow: isDark
                                                                                            ? '0 0 20px rgba(239, 68, 68, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                                                            : '0 0 20px rgba(239, 68, 68, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                                                    }}
                                                                                >
                                                                                    <div className={twMerge(
                                                                                        'text-sm font-bold flex items-center justify-center gap-2',
                                                                                        isDark ? 'text-red-200' : 'text-red-800'
                                                                                    )}>
                                                                                        <span className="animate-ping inline-block text-lg">🚨</span>
                                                                                        <span className="animate-bounce">Alerta de alteração maior que 10%</span>
                                                                                        <span className="animate-ping inline-block text-lg">🚨</span>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )

                                    })}
                            </div>
                        ) : (
                            /* Estado vazio */
                            <div className={twMerge(
                                'rounded-lg border p-12 text-center transition-colors',
                                isDark
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-white border-gray-200'
                            )}>
                                <div className={twMerge(
                                    'p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center',
                                    isDark
                                        ? 'bg-gray-700'
                                        : 'bg-gray-100'
                                )}>
                                    <Heart size={40} className={twMerge(
                                        'dashboard-icon',
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    )} />
                                </div>
                                <h3 className={twMerge(
                                    'text-3xl font-semibold mb-2',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    Aguardando dados do paciente...
                                </h3>
                                <p className={twMerge(
                                    'mb-6 text-lg',
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                )}>
                                    Os sinais vitais aparecerão aqui assim que forem recebidos via WebSocket
                                </p>
                                <div className={twMerge(
                                    'flex items-center justify-center gap-2 text-base',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                    <div className={`w-3 h-3 rounded-full ${connectionStatus.status === 'connected' ? 'bg-green-500 animate-pulse' : isDark ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                                    <span>
                                        {isLoadingInitialData
                                            ? 'Carregando dados iniciais...'
                                            : connectionStatus.status === 'connected'
                                                ? 'Conectado - Aguardando dados'
                                                : 'Desconectado'
                                        }
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WebhookMonitor
