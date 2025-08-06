'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestPage() {
    const { user, isAuthenticated, logout, isLoading } = useAuth()
    const router = useRouter()
    const [ debugInfo, setDebugInfo ] = useState<any>({})

    useEffect(() => {
        // Debug: verificar localStorage, cookies e estado
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null

        // Verificar cookies também
        const getCookie = (name: string) => {
            if (typeof window === 'undefined') return null
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift() || null
            return null
        }

        const tokenCookie = getCookie('token')
        const refreshTokenCookie = getCookie('refreshToken')

        setDebugInfo({
            token: token ? `${token.substring(0, 20)}...` : 'null',
            refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
            tokenCookie: tokenCookie ? `${tokenCookie.substring(0, 20)}...` : 'null',
            refreshTokenCookie: refreshTokenCookie ? `${refreshTokenCookie.substring(0, 20)}...` : 'null',
            isAuthenticated,
            isLoading,
            user: user ? 'Presente' : 'null'
        })

        console.log('🐛 DEBUG - TestPage:', {
            token: token ? `${token.substring(0, 20)}...` : 'null',
            refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
            tokenCookie: tokenCookie ? `${tokenCookie.substring(0, 20)}...` : 'null',
            refreshTokenCookie: refreshTokenCookie ? `${refreshTokenCookie.substring(0, 20)}...` : 'null',
            isAuthenticated,
            isLoading,
            user
        })
    }, [ user, isAuthenticated, isLoading ])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            console.log('🔄 Redirecionando para login - não autenticado')
            router.push('/auth/login')
        }
    }, [ isAuthenticated, isLoading, router ])

    const handleLogout = async () => {
        await logout()
        router.push('/auth/login')
    }

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
                <div className="text-white text-xl">🔄 Verificando autenticação...</div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
                <div className="text-white text-xl">❌ Não autenticado, redirecionando...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">🧪 Tela de Teste - Autenticação</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/80 hover:bg-red-600/80 text-white px-6 py-2 rounded-xl transition-all duration-300"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status de Autenticação */}
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">📊 Status da Autenticação</h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <span className="text-green-400 mr-2">✅</span>
                                    <span className="text-white">Usuário autenticado: {isAuthenticated ? 'Sim' : 'Não'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-blue-400 mr-2">🔑</span>
                                    <span className="text-white">Token presente: {user?.jwtToken ? 'Sim' : 'Não'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-purple-400 mr-2">👤</span>
                                    <span className="text-white">Usuário carregado: {user ? 'Sim' : 'Não'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dados do Usuário */}
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4">👤 Dados do Usuário</h2>
                            {user ? (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-300 text-sm">ID:</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1">
                                            {user.id || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">Nome:</span>
                                        <p className="text-white font-semibold">{user.nomeCompleto || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">Email:</span>
                                        <p className="text-white">{user.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">Usuário:</span>
                                        <p className="text-white">{user.username || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">Tipo:</span>
                                        <p className="text-white">{user.tipoUsuario || 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">Nenhum dado de usuário encontrado</p>
                            )}
                        </div>

                        {/* Token Info */}
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10 md:col-span-2">
                            <h2 className="text-xl font-semibold text-white mb-4">🔐 Informações do Token</h2>
                            {user?.jwtToken ? (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-300 text-sm">Token (primeiros 50 caracteres):</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-3 rounded mt-1 break-all">
                                            {user.jwtToken.substring(0, 50)}...
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">Refresh Token (primeiros 30 caracteres):</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-3 rounded mt-1 break-all">
                                            {user.refreshToken ? `${user.refreshToken.substring(0, 30)}...` : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">Nenhum token encontrado</p>
                            )}
                        </div>

                        {/* Debug Info */}
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10 md:col-span-2">
                            <h2 className="text-xl font-semibold text-white mb-4">🐛 Debug - LocalStorage, Cookies & Estado</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-blue-400">📦 LocalStorage</h3>
                                    <div>
                                        <span className="text-gray-300 text-sm">Token localStorage:</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1 break-all">
                                            {debugInfo.token}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">Refresh Token localStorage:</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1 break-all">
                                            {debugInfo.refreshToken}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-green-400">🍪 Cookies</h3>
                                    <div>
                                        <span className="text-gray-300 text-sm">Token Cookie:</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1 break-all">
                                            {debugInfo.tokenCookie}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">Refresh Token Cookie:</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1 break-all">
                                            {debugInfo.refreshTokenCookie}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-3">
                                <h3 className="text-lg font-semibold text-purple-400">⚙️ Estado da Aplicação</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-gray-300 text-sm">isAuthenticated:</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1">
                                            {debugInfo.isAuthenticated ? 'true' : 'false'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">isLoading:</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1">
                                            {debugInfo.isLoading ? 'true' : 'false'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-300 text-sm">user:</span>
                                        <p className="text-white font-mono text-sm bg-black/20 p-2 rounded mt-1">
                                            {debugInfo.user}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teste de API */}
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-6 border border-white/10 md:col-span-2">
                            <h2 className="text-xl font-semibold text-white mb-4">🔗 Teste de Conectividade API</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-blue-400 text-2xl mb-2">🛡️</div>
                                    <p className="text-white font-semibold">UserShield API</p>
                                    <p className="text-gray-300 text-sm">/usershield/api/v1/</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-green-400 text-2xl mb-2">⚡</div>
                                    <p className="text-white font-semibold">Apitasy API</p>
                                    <p className="text-gray-300 text-sm">/apitasy/</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-purple-400 text-2xl mb-2">🔔</div>
                                    <p className="text-white font-semibold">Notify API</p>
                                    <p className="text-gray-300 text-sm">/api/</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navegação */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-6 py-2 rounded-xl transition-all duration-300"
                            >
                                Ir para Login
                            </button>
                            <button
                                onClick={() => router.push('/admin')}
                                className="bg-purple-500/80 hover:bg-purple-600/80 text-white px-6 py-2 rounded-xl transition-all duration-300"
                            >
                                Ir para Admin (em desenvolvimento)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
