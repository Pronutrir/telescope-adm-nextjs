'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getFirstAvailableRoute } from '@/utils/routeUtils'
import Link from 'next/link'

export default function Home() {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && user) {
            // Buscar preferência de página inicial do usuário
            const fetchUserPreference = async () => {
                try {
                    const response = await fetch('/api/auth/me')
                    if (response.ok) {
                        const data = await response.json()
                        const preferredHomePage = data.preferredHomePage
                        
                        // Redireciona para a primeira rota disponível baseada nas permissões
                        // Prioriza preferredHomePage se existir
                        const targetRoute = getFirstAvailableRoute(user, preferredHomePage)
                        console.log('🔀 Redirecionando usuário para:', targetRoute)
                        router.push(targetRoute)
                    } else {
                        // Se falhar ao buscar preferência, usa rota padrão
                        const targetRoute = getFirstAvailableRoute(user)
                        console.log('🔀 Redirecionando usuário para:', targetRoute)
                        router.push(targetRoute)
                    }
                } catch (error) {
                    console.error('Erro ao buscar preferência:', error)
                    // Em caso de erro, usa rota padrão
                    const targetRoute = getFirstAvailableRoute(user)
                    console.log('🔀 Redirecionando usuário para:', targetRoute)
                    router.push(targetRoute)
                }
            }
            
            fetchUserPreference()
        }
    }, [ user, isLoading, router ])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
        )
    }

    if (user) {
        return null // Vai redirecionar
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-2xl">T</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Telescope ADM
                </h1>

                <p className="text-gray-600 mb-8">
                    Sistema de gerenciamento administrativo
                </p>

                <div className="space-y-4">
                    <Link
                        href="/auth/server-login"
                        className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Fazer Login
                    </Link>

                    <Link
                        href="/test"
                        className="block w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Página de Teste
                    </Link>
                </div>
            </div>
        </div>
    )
}
