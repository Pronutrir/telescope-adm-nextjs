'use client'

import React, { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout'
import { 
    UserProfileHeader,
    UserProfileForm,
    UserPermissionsCard,
    UserSecuritySettings,
    UserActivityLog,
    UserInfoCard,
    UserAvatarUpload
} from '@/components/profile'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import UserProfileService from '@/services/userProfileService'
import { 
    User, 
    Shield, 
    Lock, 
    Clock, 
    Info,
    Camera
} from 'lucide-react'

interface Activity {
    id: string
    type: 'login' | 'logout' | 'update' | 'security' | 'document' | 'other'
    title: string
    description: string
    timestamp: string
}

const UserProfilePage = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    const [ isLoading, setIsLoading ] = useState(false)
    const [ activeTab, setActiveTab ] = useState<'profile' | 'info' | 'security' | 'permissions' | 'activity' | 'avatar'>('profile')
    const [ activities, setActivities ] = useState<Activity[]>([])
    const [ loadingActivities, setLoadingActivities ] = useState(false)

    // Debug: verificar estado de autenticação
    useEffect(() => {
        console.log('🔍 Profile Page - Estado Auth:', {
            user: user ? `ID: ${user.id}, Nome: ${user.nomeCompleto}, Email: ${user.email}` : 'null',
            isAuthenticated,
            authLoading
        })
    }, [user, isAuthenticated, authLoading])

    // Carregar atividades quando a aba for acessada
    useEffect(() => {
        if (activeTab === 'activity' && user?.id && activities.length === 0) {
            loadActivities()
        }
    }, [activeTab, user?.id])

    const loadActivities = async () => {
        if (!user?.id) return
        
        try {
            setLoadingActivities(true)
            const result = await UserProfileService.getUserActivities(user.id)
            setActivities(result.activities)
        } catch (error) {
            console.error('Erro ao carregar atividades:', error)
            // Manter array vazio em caso de erro
        } finally {
            setLoadingActivities(false)
        }
    }

    const handleAvatarUpload = async (file: File) => {
        try {
            if (!user?.id) {
                throw new Error('Usuário não encontrado')
            }
            
            setIsLoading(true)
            
            const formData = new FormData()
            formData.append('avatar', file)
            formData.append('userId', user.id.toString())
            
            // TODO: Implementar endpoint de upload de avatar quando disponível
            // const response = await fetch('/api/user/avatar', {
            //     method: 'POST',
            //     body: formData
            // })
            
            // if (!response.ok) {
            //     throw new Error('Erro ao fazer upload do avatar')
            // }
            
            // const data = await response.json()
            // Atualizar contexto com nova URL do avatar
            
            console.log('Upload avatar:', file.name, 'Tamanho:', file.size)
            
            // Simular sucesso (remover quando implementar API real)
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            throw new Error('Endpoint de upload de avatar ainda não implementado')
        } catch (error: any) {
            console.error('Erro ao fazer upload do avatar:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangePassword = async (data: {
        username: string
        password: string
        newPassword: string
        idUsuario: number
    }) => {
        try {
            setIsLoading(true)
            
            await UserProfileService.updatePassword(
                data.username,
                data.password,
                data.newPassword,
                data.idUsuario
            )
        } catch (error: any) {
            console.error('Erro ao alterar senha:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const tabs = [
        { id: 'profile' as const, label: 'Editar Perfil', icon: User },
        { id: 'avatar' as const, label: 'Foto de Perfil', icon: Camera },
        { id: 'info' as const, label: 'Informações', icon: Info },
        { id: 'permissions' as const, label: 'Permissões', icon: Shield },
        { id: 'security' as const, label: 'Segurança', icon: Lock },
        { id: 'activity' as const, label: 'Atividades', icon: Clock }
    ]

    // Loading state
    if (authLoading || !user) {
        return (
            <PageWrapper maxWidth="full" spacing="xl">
                <div className={`flex items-center justify-center min-h-96 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p>Carregando perfil...</p>
                        {!authLoading && !user && (
                            <p className="text-sm text-red-500">
                                Usuário não encontrado. Redirecionando...
                            </p>
                        )}
                    </div>
                </div>
            </PageWrapper>
        )
    }

    // ✅ Garantir que user.roles existe antes de mapear
    const safeUser = {
        ...user,
        roles: user.roles ? user.roles.map(role => typeof role === 'string' ? role : role.toString()) : []
    }

    return (
        <PageWrapper maxWidth="full" spacing="xl">
            {/* Header da página */}
            <UserProfileHeader user={user} isDark={isDark} />

            <div className="relative -mt-24 space-y-8">
                {/* Tabs Navigation */}
                <div className={`
                    p-2 rounded-xl border shadow-lg transition-colors
                    ${isMobile ? 'overflow-x-auto' : ''}
                    ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}
                `}>
                    <div className={`flex gap-2 ${isMobile ? 'min-w-max' : 'flex-wrap'}`}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                                        ${isMobile ? 'text-sm px-4 py-2' : ''}
                                        ${isActive
                                            ? (isDark 
                                                ? 'bg-blue-500 text-white shadow-lg' 
                                                : 'bg-blue-600 text-white shadow-lg'
                                            )
                                            : (isDark
                                                ? 'text-gray-300 hover:bg-gray-700/50'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            )
                                        }
                                    `}
                                >
                                    <Icon 
                                        className={`w-5 h-5 ${isActive ? 'profile-tab-icon-active' : 'profile-tab-icon'}`}
                                    />
                                    <span className="whitespace-nowrap">{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {activeTab === 'profile' && (
                        <UserProfileForm
                            user={safeUser}
                            isDark={isDark}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    )}

                    {activeTab === 'avatar' && (
                        <UserAvatarUpload
                            currentAvatar={user?.avatar}
                            userName={user?.nomeCompleto || user?.username}
                            onUpload={handleAvatarUpload}
                            isDark={isDark}
                        />
                    )}

                    {activeTab === 'info' && (
                        <UserInfoCard
                            user={user}
                            isDark={isDark}
                        />
                    )}

                    {activeTab === 'permissions' && (
                        <div className="max-w-2xl mx-auto">
                            <UserPermissionsCard
                                user={user}
                                isDark={isDark}
                                isLoading={isLoading}
                            />
                        </div>
                    )}

                    {activeTab === 'security' && user && (
                        <UserSecuritySettings
                            onChangePassword={handleChangePassword}
                            user={{
                                id: user.id,
                                email: user.email
                            }}
                            isDark={isDark}
                        />
                    )}

                    {activeTab === 'activity' && (
                        <UserActivityLog
                            activities={activities}
                            isDark={isDark}
                        />
                    )}
                </div>
            </div>
        </PageWrapper>
    )
}

export default UserProfilePage
