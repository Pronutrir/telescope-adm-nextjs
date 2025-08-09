import { useEffect, useState } from 'react'

interface GoogleAnalyticsLoaderProps {
    onLoad?: (isLoaded: boolean) => void
}

export const GoogleAnalyticsLoader = ({ onLoad }: GoogleAnalyticsLoaderProps) => {
    const [ isLoaded, setIsLoaded ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)

    useEffect(() => {
        loadGoogleAnalytics()
    }, [])

    const loadGoogleAnalytics = async () => {
        try {
            // Verificar se já está carregado
            if (window.gapi) {
                setIsLoaded(true)
                onLoad?.(true)
                return
            }

            // Carregar script do Google API
            const script = document.createElement('script')
            script.src = 'https://apis.google.com/js/api.js'
            script.async = true

            script.onload = () => {
                // Carregar Google Analytics Data API
                window.gapi.load('client:auth2', async () => {
                    try {
                        await initializeGoogleAnalytics()
                        setIsLoaded(true)
                        onLoad?.(true)
                    } catch (err) {
                        console.error('Erro ao inicializar Google Analytics:', err)
                        setError('Falha na inicialização do Google Analytics')
                        onLoad?.(false)
                    }
                })
            }

            script.onerror = () => {
                setError('Falha ao carregar Google API')
                onLoad?.(false)
            }

            document.head.appendChild(script)

        } catch (err) {
            console.error('Erro ao carregar Google Analytics:', err)
            setError('Erro inesperado ao carregar Google Analytics')
            onLoad?.(false)
        }
    }

    const initializeGoogleAnalytics = async () => {
        const apiKey = process.env.NEXT_PUBLIC_GA_API_KEY
        const clientId = process.env.NEXT_PUBLIC_GA_CLIENT_ID

        if (!apiKey || !clientId) {
            throw new Error('Chaves de API do Google Analytics não configuradas')
        }

        await window.gapi.client.init({
            apiKey,
            clientId,
            discoveryDocs: [ 'https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta' ],
            scope: 'https://www.googleapis.com/auth/analytics.readonly'
        })

        console.log('Google Analytics API inicializada com sucesso')
    }

    // Este componente não renderiza nada visualmente
    return null
}

// Hook para usar o carregador
export const useGoogleAnalytics = () => {
    const [ isReady, setIsReady ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)

    const handleLoad = (loaded: boolean) => {
        setIsReady(loaded)
        if (!loaded) {
            setError('Google Analytics não pôde ser carregado')
        }
    }

    return {
        isReady,
        error,
        GoogleAnalyticsLoader: () => <GoogleAnalyticsLoader onLoad={handleLoad} />
    }
}
