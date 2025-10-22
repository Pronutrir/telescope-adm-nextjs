'use client'

import React, { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { Home, Check, Loader2 } from 'lucide-react'
import { routes, filterRoutesByRoles } from '@/config/routes'
import type { Route } from '@/config/routes'

/**
 * 🏠 Componente: Seletor de Página Inicial
 * 
 * Permite que o usuário escolha sua página inicial preferida
 * dentre as rotas disponíveis para seu perfil
 */

export const HomePageSelector: React.FC = () => {
    const { isDark } = useTheme()
    const { user, setNotification } = useAuth()
    const [selectedPage, setSelectedPage] = useState<string>('/admin/dashboard')
    const [currentHomePage, setCurrentHomePage] = useState<string>('/admin/dashboard')
    const [isSaving, setIsSaving] = useState(false)

    // Obter rotas disponíveis para o usuário
    const userRoles = user?.perfis?.map((perfil) => perfil.nomePerfil) || []
    const availableRoutes = filterRoutesByRoles(routes, userRoles).filter(
        route => route.type !== 'submenu' && route.visible !== false
    )

    // Carregar preferência atual
    React.useEffect(() => {
        const loadCurrentPreference = async () => {
            try {
                const response = await fetch('/api/auth/me')
                if (response.ok) {
                    const data = await response.json()
                    const homePage = data.preferredHomePage || '/admin/dashboard'
                    setCurrentHomePage(homePage)
                    setSelectedPage(homePage)
                }
            } catch (error) {
                console.error('Erro ao carregar preferência:', error)
            }
        }
        loadCurrentPreference()
    }, [])

    const handleSave = async () => {
        if (selectedPage === currentHomePage) {
            setNotification({
                isOpen: true,
                message: 'Nenhuma alteração foi feita',
                type: 'info'
            })
            return
        }

        console.log('🏠 [HomePageSelector] Salvando preferência:', selectedPage)
        setIsSaving(true)

        try {
            const response = await fetch('/api/auth/update-home-page', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    homePage: selectedPage
                })
            })

            console.log('🏠 [HomePageSelector] Status da resposta:', response.status)
            const responseData = await response.json()
            console.log('🏠 [HomePageSelector] Dados da resposta:', responseData)

            if (!response.ok) {
                throw new Error('Erro ao salvar preferência')
            }

            setCurrentHomePage(selectedPage)
            console.log('✅ [HomePageSelector] Preferência salva com sucesso:', selectedPage)
            setNotification({
                isOpen: true,
                message: '✅ Página inicial atualizada com sucesso!',
                type: 'success'
            })

        } catch (error) {
            console.error('Erro ao salvar:', error)
            setNotification({
                isOpen: true,
                message: '❌ Erro ao atualizar página inicial',
                type: 'error'
            })
        } finally {
            setIsSaving(false)
        }
    }

    const getRouteDisplayName = (route: Route): string => {
        return route.name
    }

    const hasChanges = selectedPage !== currentHomePage

    return (
        <div className={`rounded-xl border transition-colors ${
            isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
        }`}>
            {/* Header */}
            <div className={`p-6 border-b transition-colors ${
                isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                        <Home className={`w-5 h-5 ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-semibold transition-colors ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            Página Inicial
                        </h3>
                        <p className={`text-sm transition-colors ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Escolha a página que será exibida ao fazer login
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Seletor de Página */}
                <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Selecione sua página inicial preferida
                    </label>
                    
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        disabled={isSaving}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                            isDark
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {availableRoutes.map((route) => (
                            <option
                                key={route.layout + route.path}
                                value={route.layout + route.path}
                            >
                                {getRouteDisplayName(route)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Informação sobre a escolha atual */}
                {selectedPage !== currentHomePage && (
                    <div className={`p-3 rounded-lg border transition-colors ${
                        isDark
                            ? 'bg-blue-900/20 border-blue-800 text-blue-300'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}>
                        <p className="text-sm">
                            💡 Ao salvar, esta será sua página inicial em próximos acessos
                        </p>
                    </div>
                )}

                {/* Botão Salvar */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                            !hasChanges || isSaving
                                ? isDark
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : isDark
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Salvar Preferência
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
