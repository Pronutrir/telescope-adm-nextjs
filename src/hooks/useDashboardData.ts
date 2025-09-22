import { useState, useEffect, useCallback } from 'react'

// Tipos expostos para possíveis consumidores externos deste hook
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

export interface AnalyticsState {
    isConnected: boolean
    lastUpdate: Date
    isLoading: boolean
    error: string | null
}

// Helpers isolados
const fetchGA4Data = async (): Promise<{ users: number; traffic: number; isConnected: boolean }> => {
    try {
        if (
            typeof window !== 'undefined' &&
            window.gapi &&
            window.gapi.client &&
            window.gapi.client.analyticsdata
        ) {
            const response = await window.gapi.client.analyticsdata.properties.batchRunReports({
                property: 'properties/275938136',
                resource: {
                    requests: [
                        {
                            dimensions: [{ name: 'hostName' }],
                            metrics: [{ name: 'activeUsers' }],
                            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                            metricAggregations: ['TOTAL']
                        },
                        {
                            dimensions: [{ name: 'pagePath' }],
                            metrics: [{ name: 'screenPageViews' }],
                            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                            metricAggregations: ['TOTAL']
                        }
                    ]
                }
            })

            if (response.status === 200) {
                const { result } = response
                const users = parseInt(result.reports?.[0]?.totals?.[0]?.metricValues?.[0]?.value || '59')
                const traffic = parseInt(result.reports?.[1]?.totals?.[0]?.metricValues?.[0]?.value || '0')
                return { users, traffic, isConnected: true }
            }
        }
        return { users: 59, traffic: 0, isConnected: false }
    } catch (err) {
        console.error('Erro ao buscar dados do GA4:', err)
        return { users: 59, traffic: 0, isConnected: false }
    }
}

const fetchInternalData = async (): Promise<{ pacientes: number; agendas: number }> => {
    try {
        // Usar rota relativa que passa pelo rewrite do Next
        const response = await fetch(`/api/dashboard/stats`, {
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
            const data = await response.json()
            return { pacientes: data.pacientes || 0, agendas: data.agendas || 2201 }
        }
        return { pacientes: 0, agendas: 2201 }
    } catch (err) {
        console.error('Erro ao buscar dados internos:', err)
        return { pacientes: 0, agendas: 2201 }
    }
}

export type DashboardDataHookReturn = {
    stats: DashboardStats[]
    analyticsState: AnalyticsState
    isLoading: boolean
    refreshData: () => Promise<void>
    toggleGAConnection: () => void
}

export const useDashboardData = (): DashboardDataHookReturn => {
    const [stats, setStats] = useState<DashboardStats[]>([])
    const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({
        isConnected: true,
        lastUpdate: new Date(),
        isLoading: false,
        error: null
    })

    const loadDashboardData = useCallback(async () => {
        setAnalyticsState((prev: AnalyticsState) => ({ ...prev, isLoading: true, error: null }))
        try {
            const analyticsData = await fetchGA4Data()
            const internalData = await fetchInternalData()

            const nextStats: DashboardStats[] = [
                {
                    title: 'USUÁRIOS',
                    value: analyticsData.users.toString(),
                    change: '3.2%',
                    changeType: 'positive',
                    icon: null,
                    color: 'primary'
                },
                {
                    title: 'PACIENTES',
                    value: internalData.pacientes.toString(),
                    change: '1.1%',
                    changeType: 'positive',
                    icon: null,
                    color: 'success'
                },
                {
                    title: 'AGENDAS',
                    value: internalData.agendas.toString(),
                    change: '0.5%',
                    changeType: 'positive',
                    icon: null,
                    color: 'warning'
                }
            ]
            setStats(nextStats)
            setAnalyticsState((prev: AnalyticsState) => ({
                ...prev,
                isLoading: false,
                lastUpdate: new Date(),
                isConnected: analyticsData.isConnected
            }))
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error)
            setAnalyticsState((prev: AnalyticsState) => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            }))
        }
    }, [])

    useEffect(() => {
        loadDashboardData()
    }, [loadDashboardData])

    const toggleGAConnection = useCallback(() => {
        setAnalyticsState((prev: AnalyticsState) => ({ ...prev, isConnected: !prev.isConnected }))
    }, [])

    return { stats, analyticsState, isLoading: analyticsState.isLoading, refreshData: loadDashboardData, toggleGAConnection }
}

// Hook para dados de chart (simulado)
export const useChartData = (period: 'month' | 'week' = 'month') => {
    const [chartData, setChartData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const loadChartData = useCallback(async (selectedPeriod: 'month' | 'week') => {
        setIsLoading(true)
        try {
            const mockData = {
                labels:
                    selectedPeriod === 'month'
                        ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                        : ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [
                    {
                        label: 'Visitas',
                        data:
                            selectedPeriod === 'month'
                                ? [320, 450, 680, 890, 1200, 1450, 1680, 1890, 2100, 2300, 2150, 2400]
                                : [120, 190, 300, 500, 200, 300, 450],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    }
                ]
            }
            setChartData(mockData)
        } catch (err) {
            console.error('Erro ao carregar dados do gráfico:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadChartData(period)
    }, [period, loadChartData])

    const refreshChart = useCallback(() => loadChartData(period), [loadChartData, period])

    return { chartData, isLoading, refreshChart }
}
