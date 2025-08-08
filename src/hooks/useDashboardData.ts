import { useState, useEffect } from 'react'

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
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000))

            // TODO: Substituir por chamadas reais de API
            // const [statsData, activityData, trafficData] = await Promise.all([
            //     fetchStats(),
            //     fetchActivity(),
            //     fetchTraffic()
            // ])

            // Dados simulados por enquanto
            setStats([
                {
                    title: 'Total de Usuários',
                    value: '2,847',
                    change: '+12%',
                    changeType: 'positive',
                    icon: null,
                    color: 'from-primary-500 to-primary-600'
                }
                // ... outros dados
            ])

            setAnalyticsState(prev => ({ 
                ...prev, 
                isLoading: false, 
                lastUpdate: new Date() 
            }))

        } catch (error) {
            setAnalyticsState(prev => ({ 
                ...prev, 
                isLoading: false, 
                error: 'Erro ao carregar dados do dashboard' 
            }))
        }
    }

    const refreshData = () => {
        loadDashboardData()
    }

    const toggleGAConnection = () => {
        setAnalyticsState(prev => ({ 
            ...prev, 
            isConnected: !prev.isConnected 
        }))
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
