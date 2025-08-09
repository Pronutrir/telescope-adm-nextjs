import { useState, useEffect } from 'react'
import telescopeAPI from '../services/telescopeAPI'

// Types para os dados do dashboard
export interface DashboardStats {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative'
    icon: any
    color: string
}

export interface ActivityItem {
    id: number
    type: string
    message: string
    time: string
    icon: any
    color: string
}

export interface TrafficItem {
    url: string
    views: number
    users: number
    rate: number
    app: string
}

export interface GeoDataItem {
    country: string
    sessions: number
    percentage: number
}

export interface TrafficOriginItem {
    source: string
    users: number
    sessions: number
    engagement: number
    avgTime: string
    percentage: number
}

export interface AnalyticsState {
    isConnected: boolean
    lastUpdate: Date
    isLoading: boolean
    error: string | null
}

export const useDashboardData = () => {
    const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({
        isConnected: true,
        lastUpdate: new Date(),
        isLoading: false,
        error: null
    })

    const [stats, setStats] = useState<DashboardStats[]>([])
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [trafficData, setTrafficData] = useState<TrafficItem[]>([])
    const [geoData, setGeoData] = useState<GeoDataItem[]>([])
    const [trafficOrigin, setTrafficOrigin] = useState<TrafficOriginItem[]>([])

    // Simular dados iniciais (será substituído por API calls)
    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        setAnalyticsState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            // Tentar buscar dados do Google Analytics 4
            const analyticsData = await fetchGA4Data()
            
            // Buscar dados internos da API
            const internalData = await fetchInternalData()

            // Combinar dados do GA4 e dados internos
            const combinedStats = [
                {
                    title: 'TRÁFEGO',
                    value: analyticsData.traffic?.toString() || '0',
                    change: '+0%',
                    changeType: 'positive' as const,
                    icon: null,
                    color: 'from-blue-500 to-blue-600'
                },
                {
                    title: 'USUÁRIOS',
                    value: analyticsData.users?.toString() || '59',
                    change: '+12%',
                    changeType: 'positive' as const,
                    icon: null,
                    color: 'from-green-500 to-green-600'
                },
                {
                    title: 'PACIENTES',
                    value: internalData.pacientes?.toString() || '0',
                    change: '+0%',
                    changeType: 'positive' as const,
                    icon: null,
                    color: 'from-purple-500 to-purple-600'
                },
                {
                    title: 'AGENDAS',
                    value: internalData.agendas?.toString() || '2201',
                    change: '+5%',
                    changeType: 'positive' as const,
                    icon: null,
                    color: 'from-orange-500 to-orange-600'
                }
            ]

            setStats(combinedStats)

            setAnalyticsState(prev => ({ 
                ...prev, 
                isLoading: false, 
                lastUpdate: new Date(),
                isConnected: analyticsData.isConnected
            }))

        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error)
            setAnalyticsState(prev => ({ 
                ...prev, 
                isLoading: false, 
                error: 'Erro ao carregar dados do dashboard',
                isConnected: false
            }))
            
            // Fallback para dados estáticos
            setStats([
                {
                    title: 'TRÁFEGO',
                    value: '0',
                    change: '+0%',
                    changeType: 'positive' as const,
                    icon: null,
                    color: 'from-blue-500 to-blue-600'
                },
                {
                    title: 'USUÁRIOS',
                    value: '59',
                    change: '+12%',
                    changeType: 'positive' as const,
                    icon: null,
                    color: 'from-green-500 to-green-600'
                },
                {
                    title: 'PACIENTES',
                    value: '0',
                    change: '+0%',
                    changeType: 'positive' as const,
                    icon: null,
                    color: 'from-purple-500 to-purple-600'
                },
                {
                    title: 'AGENDAS',
                    value: '2201',
                    change: '+5%',
                    changeType: 'positive' as const,
                    icon: null,
                    color: 'from-orange-500 to-orange-600'
                }
            ])
        }
    }

    // Função para buscar dados do Google Analytics 4
    const fetchGA4Data = async () => {
        try {
            // Verificar se Google Analytics está carregado
            if (typeof window !== 'undefined' && window.gapi && window.gapi.client && window.gapi.client.analyticsdata) {
                const response = await window.gapi.client.analyticsdata.properties.batchRunReports({
                    property: "properties/275938136", // ID da propriedade GA4 do sistema original
                    resource: {
                        requests: [
                            // Requisição para usuários ativos
                            {
                                dimensions: [{ name: "hostName" }],
                                metrics: [{ name: "activeUsers" }],
                                dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
                                metricAggregations: ["TOTAL"]
                            },
                            // Requisição para visualizações de página (tráfego)
                            {
                                dimensions: [{ name: "pagePath" }],
                                metrics: [{ name: "screenPageViews" }],
                                dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
                                metricAggregations: ["TOTAL"]
                            }
                        ]
                    }
                })

                if (response.status === 200) {
                    const { result } = response
                    const users = parseInt(result.reports[0]?.totals?.[0]?.metricValues?.[0]?.value || '59')
                    const traffic = parseInt(result.reports[1]?.totals?.[0]?.metricValues?.[0]?.value || '0')
                    
                    return {
                        users,
                        traffic,
                        isConnected: true
                    }
                }
            }
            
            // Se GA4 não estiver disponível, retornar dados padrão
            return {
                users: 59,
                traffic: 0,
                isConnected: false
            }
        } catch (error) {
            console.error('Erro ao buscar dados do GA4:', error)
            return {
                users: 59,
                traffic: 0,
                isConnected: false
            }
        }
    }

    // Função para buscar dados internos do sistema
    const fetchInternalData = async () => {
        try {
            // Usar o serviço da API Telescope
            const data = await telescopeAPI.getDashboardStats()
            return {
                pacientes: data.pacientes || 0,
                agendas: data.agendas || 2201
            }
        } catch (error) {
            console.error('Erro ao buscar dados internos:', error)
            return {
                pacientes: 0,
                agendas: 2201
            }
        }
    }

    const refreshData = () => {
        loadDashboardData()
    }

    const toggleGAConnection = async () => {
        try {
            if (typeof window !== 'undefined') {
                // Carregar Google API se não estiver carregado
                if (!window.gapi) {
                    await loadGoogleAPI()
                }

                // Inicializar cliente do Analytics
                await window.gapi.load('client:auth2', initializeGAClient)
            }
        } catch (error) {
            console.error('Erro ao conectar com Google Analytics:', error)
            setAnalyticsState(prev => ({ 
                ...prev, 
                error: 'Erro ao conectar com Google Analytics',
                isConnected: false
            }))
        }
    }

    // Função para carregar Google API
    const loadGoogleAPI = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://apis.google.com/js/api.js'
            script.onload = () => resolve()
            script.onerror = () => reject(new Error('Falha ao carregar Google API'))
            document.head.appendChild(script)
        })
    }

    // Função para inicializar cliente GA4
    const initializeGAClient = async () => {
        try {
            await window.gapi.client.init({
                apiKey: process.env.NEXT_PUBLIC_GA_API_KEY || '', // Configurar no .env
                clientId: process.env.NEXT_PUBLIC_GA_CLIENT_ID || '', // Configurar no .env
                discoveryDocs: ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta'],
                scope: 'https://www.googleapis.com/auth/analytics.readonly'
            })

            // Verificar se usuário está autenticado
            const authInstance = window.gapi.auth2.getAuthInstance()
            const isSignedIn = authInstance.isSignedIn.get()
            
            if (!isSignedIn) {
                await authInstance.signIn()
            }

            setAnalyticsState(prev => ({ 
                ...prev, 
                isConnected: true,
                error: null
            }))

            // Recarregar dados após conexão
            loadDashboardData()
            
        } catch (error) {
            console.error('Erro na inicialização do GA4:', error)
            setAnalyticsState(prev => ({ 
                ...prev, 
                isConnected: false,
                error: 'Falha na autenticação do Google Analytics'
            }))
        }
    }

    return {
        analyticsState,
        stats,
        activities,
        trafficData,
        geoData,
        trafficOrigin,
        refreshData,
        toggleGAConnection,
        isLoading: analyticsState.isLoading
    }
}

// Hook para dados de chart
export const useChartData = (period: 'month' | 'week' = 'month') => {
    const [chartData, setChartData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadChartData(period)
    }, [period])

    const loadChartData = async (selectedPeriod: 'month' | 'week') => {
        setIsLoading(true)
        
        try {
            // TODO: Implementar chamada para API do Google Analytics
            // const data = await fetchAnalyticsChart(selectedPeriod)
            
            // Dados simulados para Chart.js
            const mockData = {
                labels: selectedPeriod === 'month' 
                    ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                    : ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Visitas',
                    data: selectedPeriod === 'month'
                        ? [320, 450, 680, 890, 1200, 1450, 1680, 1890, 2100, 2300, 2150, 2400]
                        : [120, 190, 300, 500, 200, 300, 450],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            }

            setChartData(mockData)
        } catch (error) {
            console.error('Erro ao carregar dados do gráfico:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return { chartData, isLoading, refreshChart: () => loadChartData(period) }
}
