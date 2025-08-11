'use client'

import { useState, useEffect } from 'react'
import { useGoogleAnalytics } from './useGoogleAnalytics'

export interface TrafficData {
    month: string
    visits: number
    users: number
    newUsers?: number
}

export interface PageViewData {
    url: string
    visits: number
    uniqueUsers: number
    accessIndex: number
    application: string
}

export interface OriginTrafficData {
    source: string
    medium: string
    users: number
    sessions: number
    engagedSessions: number
    avgEngagementTime: string
    trafficPercentage: number
}

export interface GeoData {
    country: string
    visitors: number
    visitPercentage: number
}

export interface TrafficStats {
    totalVisits: number
    totalUsers: number
    newUsers: number
    activeUsers: number
    bounceRate: number
    avgSessionDuration: string
}

export interface TrafficFilters {
    period: 'month' | 'week'
    timeRange: 'last_month' | 'last_week'
}

export const useTrafficData = () => {
    const {
        trafficData: gaTrafficData,
        trafficStats: gaTrafficStats,
        isLoading: gaIsLoading,
        error: gaError,
        isConnected: gaIsConnected,
        refreshData: gaRefreshData,
        handleAuth: gaHandleAuth
    } = useGoogleAnalytics()

    const [isLoading, setIsLoading] = useState(false)
    const [filters, setFilters] = useState<TrafficFilters>({
        period: 'month',
        timeRange: 'last_month'
    })

    // Estado para dados de tráfego principal
    const [trafficData, setTrafficData] = useState<TrafficData[]>([])
    const [trafficStats, setTrafficStats] = useState<TrafficStats>({
        totalVisits: 0,
        totalUsers: 0,
        newUsers: 0,
        activeUsers: 0,
        bounceRate: 0,
        avgSessionDuration: '0:00'
    })

    // Estado para dados de páginas
    const [pageViews, setPageViews] = useState<PageViewData[]>([])

    // Estado para origem do tráfego
    const [originTraffic, setOriginTraffic] = useState<OriginTrafficData[]>([])

    // Estado para dados geográficos
    const [geoData, setGeoData] = useState<GeoData[]>([])

    // Estado de conexão com Google Analytics
    const [, setIsConnected] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    // Função para gerar dados mockados (fallback)
    const generateMockData = () => {
        // Dados de tráfego mensal
        const mockTrafficData: TrafficData[] = [
            { month: 'Jan', visits: 1250, users: 980, newUsers: 120 },
            { month: 'Fev', visits: 1890, users: 1430, newUsers: 190 },
            { month: 'Mar', visits: 1520, users: 1200, newUsers: 150 },
            { month: 'Abr', visits: 2200, users: 1800, newUsers: 220 },
            { month: 'Mai', visits: 1800, users: 1400, newUsers: 180 },
            { month: 'Jun', visits: 2500, users: 2000, newUsers: 250 },
            { month: 'Jul', visits: 2900, users: 2400, newUsers: 290 },
            { month: 'Ago', visits: 3200, users: 2800, newUsers: 320 },
            { month: 'Set', visits: 2800, users: 2300, newUsers: 280 },
            { month: 'Out', visits: 3500, users: 3000, newUsers: 350 },
            { month: 'Nov', visits: 3800, users: 3200, newUsers: 380 },
            { month: 'Dez', visits: 4200, users: 3600, newUsers: 420 }
        ]

        // Estatísticas gerais
        const mockStats: TrafficStats = {
            totalVisits: 31540,
            totalUsers: 26130,
            newUsers: 2957,
            activeUsers: 1429,
            bounceRate: 32.5,
            avgSessionDuration: '4:32'
        }

        // Páginas mais visitadas
        const mockPageViews: PageViewData[] = [
            {
                url: '/app/agenda',
                visits: 5420,
                uniqueUsers: 4250,
                accessIndex: 85,
                application: 'Agendamento Web'
            },
            {
                url: '/app/dashboard',
                visits: 3890,
                uniqueUsers: 3200,
                accessIndex: 78,
                application: 'Dashboard Admin'
            },
            {
                url: '/app/patients',
                visits: 2760,
                uniqueUsers: 2100,
                accessIndex: 65,
                application: 'Gestão de Pacientes'
            },
            {
                url: '/app/reports',
                visits: 1950,
                uniqueUsers: 1500,
                accessIndex: 45,
                application: 'Relatórios'
            },
            {
                url: '/app/settings',
                visits: 1230,
                uniqueUsers: 980,
                accessIndex: 32,
                application: 'Configurações'
            }
        ]

        // Origem do tráfego
        const mockOriginTraffic: OriginTrafficData[] = [
            {
                source: 'google',
                medium: 'organic',
                users: 12450,
                sessions: 15670,
                engagedSessions: 9800,
                avgEngagementTime: '5:23',
                trafficPercentage: 47.8
            },
            {
                source: 'direct',
                medium: '(none)',
                users: 8920,
                sessions: 11250,
                engagedSessions: 7890,
                avgEngagementTime: '6:12',
                trafficPercentage: 34.2
            },
            {
                source: 'facebook',
                medium: 'social',
                users: 2340,
                sessions: 2890,
                engagedSessions: 1920,
                avgEngagementTime: '3:45',
                trafficPercentage: 9.0
            },
            {
                source: 'instagram',
                medium: 'social',
                users: 1450,
                sessions: 1780,
                engagedSessions: 1200,
                avgEngagementTime: '2:58',
                trafficPercentage: 5.6
            },
            {
                source: 'whatsapp',
                medium: 'referral',
                users: 890,
                sessions: 1120,
                engagedSessions: 780,
                avgEngagementTime: '4:15',
                trafficPercentage: 3.4
            }
        ]

        // Dados geográficos
        const mockGeoData: GeoData[] = [
            { country: 'Brasil', visitors: 23450, visitPercentage: 89.7 },
            { country: 'Estados Unidos', visitors: 1250, visitPercentage: 4.8 },
            { country: 'Portugal', visitors: 680, visitPercentage: 2.6 },
            { country: 'Canadá', visitors: 320, visitPercentage: 1.2 },
            { country: 'Reino Unido', visitors: 280, visitPercentage: 1.1 },
            { country: 'França', visitors: 150, visitPercentage: 0.6 }
        ]

        return {
            trafficData: mockTrafficData,
            trafficStats: mockStats,
            pageViews: mockPageViews,
            originTraffic: mockOriginTraffic,
            geoData: mockGeoData
        }
    }

    // Função para converter dados do GA para formato local
    const convertGADataToLocal = () => {
        if (gaTrafficData.length > 0) {
            const convertedData: TrafficData[] = gaTrafficData.map(item => ({
                month: item.date,
                visits: item.users,
                users: item.users,
                newUsers: item.newUsers
            }))

            const convertedStats: TrafficStats = {
                totalVisits: gaTrafficStats.totalUsers,
                totalUsers: gaTrafficStats.totalUsers,
                newUsers: gaTrafficStats.newUsers,
                activeUsers: gaTrafficStats.returningUsers,
                bounceRate: 32.5, // Valor padrão - seria necessário outra métrica do GA
                avgSessionDuration: '4:32' // Valor padrão - seria necessário outra métrica do GA
            }

            setTrafficData(convertedData)
            setTrafficStats(convertedStats)
        } else {
            // Usar dados mock se não há dados do GA
            const mockData = generateMockData()
            setTrafficData(mockData.trafficData)
            setTrafficStats(mockData.trafficStats)
            setPageViews(mockData.pageViews)
            setOriginTraffic(mockData.originTraffic)
            setGeoData(mockData.geoData)
        }
    }

    // Função para atualizar dados
    const refreshData = async () => {
        setIsLoading(true)
        
        try {
            // Tentar obter dados do Google Analytics
            gaRefreshData()
            
            // Simular delay para outros dados
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setLastUpdate(new Date())
            
        } catch (error) {
            console.error('Erro ao carregar dados de tráfego:', error)
            // Usar dados mock em caso de erro
            const mockData = generateMockData()
            setPageViews(mockData.pageViews)
            setOriginTraffic(mockData.originTraffic)
            setGeoData(mockData.geoData)
        } finally {
            setIsLoading(false)
        }
    }

    // Função para alterar filtros
    const updateFilters = (newFilters: Partial<TrafficFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }

    // Função para conectar/desconectar Google Analytics
    const toggleGAConnection = () => {
        if (gaIsConnected) {
            setIsConnected(prev => !prev)
        } else {
            gaHandleAuth()
        }
    }

    // Atualizar dados quando há mudanças no GA
    useEffect(() => {
        convertGADataToLocal()
        setIsConnected(gaIsConnected)
    }, [gaTrafficData, gaTrafficStats, gaIsConnected])

    // Carregar dados iniciais
    useEffect(() => {
        refreshData()
    }, [filters])

    return {
        // Estados
        isLoading: isLoading || gaIsLoading,
        isConnected: gaIsConnected,
        lastUpdate,
        filters,
        error: gaError,
        
        // Dados
        trafficData,
        trafficStats,
        pageViews,
        originTraffic,
        geoData,
        
        // Ações
        refreshData,
        updateFilters,
        toggleGAConnection,
        handleAuth: gaHandleAuth
    }
}
