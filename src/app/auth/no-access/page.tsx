'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ShieldAlert, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NoAccessPage() {
    const { user, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Se não há usuário, redireciona para login
        if (!user) {
            router.push('/auth/login')
        }
    }, [user, router])

    const handleLogout = () => {
        logout()
        router.push('/auth/login')
    }

    const handleGoHome = () => {
        router.push('/')
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Acesso Negado
                </h1>

                <p className="text-gray-600 mb-2">
                    Olá, <span className="font-semibold">{user.nomeCompleto || user.username}</span>
                </p>

                <p className="text-gray-600 mb-8">
                    Sua conta não possui permissões para acessar nenhuma área do sistema. 
                    Entre em contato com o administrador para solicitar as permissões necessárias.
                </p>

                <div className="space-y-3">
                    <Button
                        variant="primary"
                        icon={Home}
                        onClick={handleGoHome}
                        className="w-full"
                    >
                        Voltar ao Início
                    </Button>

                    <Button
                        variant="error"
                        icon={LogOut}
                        onClick={handleLogout}
                        className="w-full"
                    >
                        Sair do Sistema
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Suas permissões atuais:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                        {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                >
                                    {role.perfis.nomePerfil}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400 italic">
                                Nenhuma permissão atribuída
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
