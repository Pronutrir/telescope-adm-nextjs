import { useEffect, useState, useCallback } from 'react'

interface GoogleAnalyticsLoaderProps {
    onLoad?: (isLoaded: boolean) => void
}

export const GoogleAnalyticsLoader = ({ onLoad }: GoogleAnalyticsLoaderProps) => {
    const loadGoogleAnalytics = useCallback(async () => {
        try {
            // Verificar chaves ANTES de tentar carregar qualquer script
            const apiKey = process.env.NEXT_PUBLIC_GA_API_KEY
            const clientId = process.env.NEXT_PUBLIC_GA_CLIENT_ID

            if (!apiKey || !clientId) {
                // 🔇 Silenciosamente falha - não há GA configurado
                onLoad?.(false)
                return
            }

            // Verificar se já está carregado
            if (window.gapi) {
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
                        await window.gapi.client.init({
                            apiKey,
                            discoveryDocs: [ 'https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta' ],
                            scope: 'https://www.googleapis.com/auth/analytics.readonly'
                        })

                        await window.gapi.auth2.init({
                            client_id: clientId,
                            scope: 'https://www.googleapis.com/auth/analytics.readonly'
                        })

                        console.log('✅ Google Analytics API inicializada com sucesso')
                        onLoad?.(true)
                    } catch (err) {
                        // Erro silencioso - GA não configurado corretamente
                        onLoad?.(false)
                    }
                })
            }

            script.onerror = () => {
                onLoad?.(false)
            }

            document.head.appendChild(script)

        } catch (err) {
            // Erro silencioso - GA não configurado
            onLoad?.(false)
        }
    }, [ onLoad ])

    useEffect(() => {
        loadGoogleAnalytics()
    }, [ loadGoogleAnalytics ])

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
