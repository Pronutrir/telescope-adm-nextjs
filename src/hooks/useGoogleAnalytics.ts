import { useState, useEffect } from 'react'
import ACCESS_TRAFFIC from '@/config/ga4/accessTraffic.json'

interface GoogleAnalyticsResponse {
    reports: Array<{
        rows?: Array<{
            dimensionValues: Array<{ value: string }>
            metricValues: Array<{ value: string }>
        }>
        totals?: Array<{
            metricValues: Array<{ value: string }>
        }>
    }>
}

export interface TrafficData {
    date: string
    users: number
    newUsers: number
}

export interface TrafficStats {
    totalUsers: number
    newUsers: number
    returningUsers: number
    growthRate: number
}

interface UseGoogleAnalyticsReturn {
    trafficData: TrafficData[]
    trafficStats: TrafficStats
    isLoading: boolean
    error: string | null
    isConnected: boolean
    refreshData: () => void
    handleAuth: () => void
}

declare global {
    interface Window {
        gapi: any
    }
}

export const useGoogleAnalytics = (): UseGoogleAnalyticsReturn => {
    const [trafficData, setTrafficData] = useState<TrafficData[]>([])
    const [trafficStats, setTrafficStats] = useState<TrafficStats>({
        totalUsers: 0,
        newUsers: 0,
        returningUsers: 0,
        growthRate: 0
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    // Verificar se o GAPI está carregado
    useEffect(() => {
        checkGapiReady()
    }, [])

    const checkGapiReady = () => {
        if (typeof window !== 'undefined' && window.gapi) {
            setIsConnected(true)
        } else {
            // Carregar GAPI se não estiver disponível
            loadGapi()
        }
    }

    const loadGapi = () => {
        const script = document.createElement('script')
        script.src = 'https://apis.google.com/js/api.js'
        script.onload = () => {
            window.gapi.load('client:auth2', initializeGapi)
        }
        document.head.appendChild(script)
    }

    const initializeGapi = () => {
        window.gapi.client.init({
            apiKey: 'AIzaSyBw83ATVekwG9SeB-wBmld3GyYDxBxAtxw',
            discoveryDocs: ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta'],
            scope: 'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly'
        }).then(() => {
            setIsConnected(true)
        }).catch((err: any) => {
            setError('Erro ao inicializar Google API: ' + err.message)
        })
    }

    const authenticate = (): Promise<any> => {
        return window.gapi.auth2.getAuthInstance()
            .signIn({ scope: "https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly" })
            .then(
                () => console.log("Autenticação bem-sucedida"),
                (err: any) => {
                    console.error("Erro na autenticação", err)
                    throw err
                }
            )
    }

    const loadClient = (): Promise<any> => {
        window.gapi.client.setApiKey("AIzaSyBw83ATVekwG9SeB-wBmld3GyYDxBxAtxw")
        return window.gapi.client.load("https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta")
            .then(
                () => {
                    console.log("Cliente GAPI carregado para API")
                    requestTrafficData()
                },
                (err: any) => {
                    console.error("Erro ao carregar cliente GAPI para API", err)
                    throw err
                }
            )
    }

    const handleAuth = () => {
        authenticate().then(loadClient).catch((err) => {
            setError('Erro na autenticação: ' + err.message)
        })
    }

    const requestTrafficData = () => {
        setIsLoading(true)
        setError(null)

        if (!window.gapi?.client?.analyticsdata) {
            setError('Cliente do Google Analytics não está carregado')
            setIsLoading(false)
            return
        }

        return window.gapi.client.analyticsdata.properties.batchRunReports({
            "property": "properties/275938136",
            "resource": {
                "requests": [ACCESS_TRAFFIC]
            }
        }).then((response: { status: number; result: GoogleAnalyticsResponse }) => {
            if (response.status === 200) {
                const { result } = response
                const accessTrafficData = result.reports[0]
                
                // Processar dados de tráfego
                const processedData = processTrafficData(accessTrafficData)
                setTrafficData(processedData.data)
                setTrafficStats(processedData.stats)
                
                setIsLoading(false)
            }
        }).catch((err: any) => {
            console.error("Erro na execução", err)
            setIsLoading(false)
            
            if (err.result?.error) {
                switch (err.result.error.code) {
                    case 401:
                        setError('Autenticação não autorizada')
                        break
                    case 400:
                        setError('Não foi possível autenticar devido a algum procedimento incorreto')
                        break
                    case 403:
                        setError('Acesso negado')
                        break
                    default:
                        setError('Ocorreu um erro inesperado: ' + err.result.error.message)
                        break
                }
            } else {
                setError('Erro de conexão com Google Analytics')
            }
        })
    }

    const processTrafficData = (data: any) => {
        const rows = data?.rows || []
        const totals = data?.totals?.[0]?.metricValues || []
        
        // Processar dados mensais
        const monthlyData: TrafficData[] = rows.map((row: any) => ({
            date: row.dimensionValues[0].value,
            users: parseInt(row.metricValues[0].value) || 0,
            newUsers: parseInt(row.metricValues[1].value) || 0
        }))

        // Calcular estatísticas totais
        const totalUsers = parseInt(totals[0]?.value) || 0
        const newUsers = parseInt(totals[1]?.value) || 0
        const returningUsers = totalUsers - newUsers
        const growthRate = monthlyData.length > 1 
            ? ((monthlyData[monthlyData.length - 1].users - monthlyData[0].users) / monthlyData[0].users) * 100
            : 0

        return {
            data: monthlyData,
            stats: {
                totalUsers,
                newUsers,
                returningUsers,
                growthRate: Math.round(growthRate * 100) / 100
            }
        }
    }

    const refreshData = () => {
        if (!window.gapi?.client?.analyticsdata) {
            handleAuth()
        } else {
            requestTrafficData()
        }
    }

    return {
        trafficData,
        trafficStats,
        isLoading,
        error,
        isConnected,
        refreshData,
        handleAuth
    }
}
