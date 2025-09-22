'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
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
    Thermometer,
    Scale,
    Wind,
    TrendingUp,
    TrendingDown,
    Activity,
    Monitor,
    Target,
    Maximize,
    Minimize
} from 'lucide-react'

// Interfaces baseadas no novo formato de resposta
interface ISinalVital {
    nR_SEQUENCIA: number
    dT_SINAL_VITAL: string
    qT_SATURACAO_O2: number
    qT_TEMP: number
    qT_PESO: number
    qT_ALTURA_CM: number
    diferencaPercentual: number
    alteracaoMaior10: boolean
}

interface IPatientData {
    cD_PACIENTE: string
    nM_PACIENTE: string
    comparacaoDtos: ISinalVital[]
}

interface IConnectionStatus {
    status: 'disconnected' | 'connecting' | 'connected' | 'error'
    connectionId?: string
    error?: string
}

const WebhookMonitor = () => {
    const { isDark } = useTheme()
    const [ , setConnection ] = useState<HubConnection | null>(null)
    const [ connectionStatus, setConnectionStatus ] = useState<IConnectionStatus>({ status: 'disconnected' })
    const [ patientDataHistory, setPatientDataHistory ] = useState<(IPatientData & { timestamp: Date })[]>([])
    const [ , setLogs ] = useState<string[]>([])
    const [ , setLastUpdate ] = useState<Date | null>(null)
    const [ isFullscreen, setIsFullscreen ] = useState<boolean>(false)
    const [ isLoadingInitialData, setIsLoadingInitialData ] = useState<boolean>(false)

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

    // Função para obter background baseado nos temas
    const getMainBackground = () => {
        if (isDark) {
            return 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        } else {
            return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
        }
    }

    // Renderizar status da conexão
    const renderConnectionStatus = () => {
        // Priorizar indicador de carregamento inicial
        if (isLoadingInitialData) {
            return (
                <div className={twMerge(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                    isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                )}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Carregando dados iniciais...</span>
                </div>
            )
        }

        const statusConfig = (() => {
            switch (connectionStatus.status) {
                case 'connected':
                    return {
                        icon: <Wifi className="w-4 h-4" />,
                        text: 'Conectado',
                        className: twMerge(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                            isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700'
                        )
                    }
                case 'connecting':
                    return {
                        icon: <Loader2 className="w-4 h-4 animate-spin" />,
                        text: 'Conectando...',
                        className: twMerge(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                            isDark ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        )
                    }
                case 'error':
                    return {
                        icon: <WifiOff className="w-4 h-4" />,
                        text: 'Erro de Conexão',
                        className: twMerge(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                            isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'
                        )
                    }
                default:
                    return {
                        icon: <WifiOff className="w-4 h-4" />,
                        text: 'Desconectado',
                        className: twMerge(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                            isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        )
                    }
            }
        })()

        return (
            <div className={statusConfig.className}>
                {statusConfig.icon}
                <span>{statusConfig.text}</span>
            </div>
        )
    }

    return (
        <div
            className={twMerge(
                "w-full flex flex-col transition-all duration-300",
                isFullscreen ? "fixed inset-0 z-50 h-screen" : "min-h-screen"
            )}
            style={{ background: getMainBackground() }}
        >
            {/* Container principal estendido para toda a tela */}
            <div className={twMerge(
                "flex-1 flex flex-col gap-4",
                isFullscreen
                    ? "px-3 py-3 h-full"
                    : "px-3 sm:px-4 py-4 min-h-screen"
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
                                    Monitoramento em tempo real de dados de pacientes via WebSocket
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

                        <div className="flex flex-wrap gap-3">
                            {/* Status da Conexão */}
                            {renderConnectionStatus()}

                            {/* Botão Tela Cheia */}
                            <button
                                onClick={toggleFullscreen}
                                className={twMerge(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200',
                                    'border backdrop-blur-sm hover:-translate-y-0.5',
                                    isDark
                                        ? 'bg-gray-800/80 border-gray-700/60 text-gray-300 hover:bg-gray-700/90 hover:border-gray-600/70 hover:text-white'
                                        : 'bg-white/80 border-gray-200/60 text-gray-700 hover:bg-white/90 hover:border-gray-300/70 hover:text-gray-900'
                                )}
                                title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
                            >
                                {isFullscreen ? (
                                    <>
                                        <Minimize size={18} />
                                        <span className="hidden sm:inline">Sair</span>
                                    </>
                                ) : (
                                    <>
                                        <Maximize size={18} />
                                        <span className="hidden sm:inline">Tela Cheia</span>
                                    </>
                                )}
                            </button>

                            {/* Botão Recarregar Dados */}
                            <button
                                onClick={fetchInitialData}
                                disabled={isLoadingInitialData}
                                className={twMerge(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200',
                                    'border backdrop-blur-sm hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed',
                                    isDark
                                        ? 'bg-gray-800/80 border-gray-700/60 text-gray-300 hover:bg-gray-700/90 hover:border-gray-600/70 hover:text-white'
                                        : 'bg-white/80 border-gray-200/60 text-gray-700 hover:bg-white/90 hover:border-gray-300/70 hover:text-gray-900'
                                )}
                                title="Recarregar dados iniciais"
                            >
                                {isLoadingInitialData ? (
                                    <Loader2 size={18} className="dashboard-icon animate-spin" />
                                ) : (
                                    <Activity size={18} className="dashboard-icon" />
                                )}
                                <span className="hidden sm:inline">
                                    {isLoadingInitialData ? 'Carregando...' : 'Recarregar'}
                                </span>
                            </button>

                            {/* Theme Toggle */}
                            <ThemeToggle size="sm" />
                        </div>
                    </div>

                    {/* Indicador de tela cheia */}
                    {isFullscreen && (
                        <div className={twMerge(
                            'mt-2 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2',
                            isDark
                                ? 'bg-blue-900/30 text-blue-400 border border-blue-700/50'
                                : 'bg-blue-100 text-blue-700 border border-blue-300/50'
                        )}>
                            <Monitor size={14} />
                            <span>Modo tela cheia ativo • F11 ou ESC para sair</span>
                        </div>
                    )}
                </div>

                {/* Conteúdo principal */}
                <div className="flex-1 overflow-hidden">
                    {/* Cards dos Pacientes - Grid Horizontal */}
                    <div className="h-full">
                        {patientDataHistory.length > 0 ? (
                            <div className={twMerge(
                                "h-full overflow-y-auto",
                                isFullscreen
                                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 p-3"
                                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2"
                            )}>
                                {patientDataHistory
                                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                                    .map((patientData, patientIndex) => (
                                        <div
                                            key={patientIndex}
                                            className={twMerge(
                                                'group cursor-default rounded-xl border transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm',
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
                                                    'rounded-t-xl p-4 border-b transition-colors duration-300',
                                                    isDark
                                                        ? 'bg-gray-800/50 border-gray-700/50'
                                                        : 'bg-gray-50/50 border-gray-200/50'
                                                )}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                                            <div className={twMerge(
                                                                'p-2 rounded-lg',
                                                                isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                                                            )}>
                                                                <User size={22} className={twMerge(
                                                                    'dashboard-icon',
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
                                                                {patientData.timestamp.toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Sinais Vitais */}
                                                <div className="p-4 space-y-3">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Activity size={20} className={twMerge(
                                                            'dashboard-icon',
                                                            isDark ? 'text-blue-400' : 'text-blue-600'
                                                        )} />
                                                        <span className={twMerge(
                                                            'text-base font-medium',
                                                            isDark ? 'text-white' : 'text-gray-900'
                                                        )}>Sinais Vitais ({patientData.comparacaoDtos.length})</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 min-h-fit">
                                                        {patientData.comparacaoDtos
                                                            .sort((a, b) => new Date(b.dT_SINAL_VITAL).getTime() - new Date(a.dT_SINAL_VITAL).getTime())
                                                            .map((sinal: ISinalVital, index: number) => (
                                                                <div
                                                                    key={sinal.nR_SEQUENCIA}
                                                                    className={twMerge(
                                                                        'p-3 rounded-lg border transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm',
                                                                        // Se for o último item ímpar e há mais de 2 itens, ocupar toda a largura
                                                                        patientData.comparacaoDtos.length > 2 &&
                                                                            index === patientData.comparacaoDtos.length - 1 &&
                                                                            patientData.comparacaoDtos.length % 2 === 1
                                                                            ? 'col-span-2' : '',
                                                                        // Estilo diferente para o primeiro item (referência)
                                                                        index === 0
                                                                            ? isDark
                                                                                ? 'bg-green-900/10 border-green-600/40 hover:bg-green-900/20 hover:border-green-500/60'
                                                                                : 'bg-green-50/60 border-green-200/50 hover:bg-green-50/90 hover:border-green-300/70'
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
                                                                    title={index === 0 ? 'Sinal vital de referência - usado para calcular diferenças dos demais sinais' : undefined}
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
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-1">
                                                                                <Wind size={14} className={twMerge('dashboard-icon', isDark ? 'text-blue-400' : 'text-blue-600')} />
                                                                                <span className={twMerge(
                                                                                    'text-sm font-medium',
                                                                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                                                                )}>O₂</span>
                                                                            </div>
                                                                            <span className={twMerge(
                                                                                'font-bold text-base',
                                                                                isDark ? 'text-white' : 'text-gray-900'
                                                                            )}>{sinal.qT_SATURACAO_O2}%</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-1">
                                                                                <Thermometer size={14} className={twMerge('dashboard-icon', isDark ? 'text-red-400' : 'text-red-600')} />
                                                                                <span className={twMerge(
                                                                                    'text-sm font-medium',
                                                                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                                                                )}>Temp</span>
                                                                            </div>
                                                                            <span className={twMerge(
                                                                                'font-bold text-base',
                                                                                isDark ? 'text-white' : 'text-gray-900'
                                                                            )}>{sinal.qT_TEMP}°C</span>
                                                                        </div>
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
                                                                    </div>

                                                                    {/* Diferença percentual com destaque */}
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

                                                                    {/* Alerta de alteração maior que 10% */}
                                                                    {sinal.alteracaoMaior10 && (
                                                                        <div
                                                                            className={twMerge(
                                                                                'mt-1 px-1 py-0.5 border rounded text-center transition-colors animate-pulse',
                                                                                isDark
                                                                                    ? 'bg-red-900/30 border-red-700'
                                                                                    : 'bg-red-100 border-red-400'
                                                                            )}
                                                                            style={{
                                                                                animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite, glow 2s ease-in-out infinite alternate',
                                                                                boxShadow: isDark
                                                                                    ? '0 0 10px rgba(239, 68, 68, 0.3)'
                                                                                    : '0 0 10px rgba(239, 68, 68, 0.2)'
                                                                            }}
                                                                        >
                                                                            <span className={twMerge(
                                                                                'text-sm font-bold animate-bounce',
                                                                                isDark ? 'text-red-300' : 'text-red-700'
                                                                            )}>
                                                                                🚨 ALERTA &gt;10%
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
