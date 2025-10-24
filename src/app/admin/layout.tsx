'use client'

import { MainLayout } from '@/components/layout'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth()
    const { isDark } = useTheme()
    const router = useRouter()

    useEffect(() => {
        // Redireciona para login se não autenticado OU se perdeu o usuário
        if (!authLoading && (!isAuthenticated || !user)) {
            console.warn('⚠️ [AdminLayout] Sessão perdida - redirecionando para login')
            router.push('/auth/login')
        }
    }, [authLoading, isAuthenticated, user, router])

    // Loading state durante verificação de autenticação
    if (authLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className={`flex flex-col items-center gap-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="text-lg font-medium">Verificando autenticação...</p>
                    </div>
                </div>
            </MainLayout>
        )
    }

    // Mostra loading durante redirect se não autenticado
    if (!isAuthenticated || !user) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className={`flex flex-col items-center gap-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="text-lg font-medium">Redirecionando...</p>
                    </div>
                </div>
            </MainLayout>
        )
    }

    // ✅ Usuário autenticado - renderiza conteúdo
    return <MainLayout>{children}</MainLayout>
}
