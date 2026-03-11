'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { useNotifications } from '@/contexts/NotificationContext'
import UserProfileService from '@/services/userProfileService'
import { User, Shield, Lock, Clock, Info, Camera, Home } from 'lucide-react'

export interface Activity {
    id: string
    type: 'login' | 'logout' | 'update' | 'security' | 'document' | 'other'
    title: string
    description: string
    timestamp: string
}

export type ProfileTabId = 'profile' | 'avatar' | 'info' | 'permissions' | 'preferences' | 'security' | 'activity'

const TABS = [
    { id: 'profile' as const, label: 'Editar Perfil', icon: User },
    { id: 'avatar' as const, label: 'Foto de Perfil', icon: Camera },
    { id: 'info' as const, label: 'Informações', icon: Info },
    { id: 'permissions' as const, label: 'Permissões', icon: Shield },
    { id: 'preferences' as const, label: 'Preferências', icon: Home },
    { id: 'security' as const, label: 'Segurança', icon: Lock },
    { id: 'activity' as const, label: 'Atividades', icon: Clock },
] as const

export const useProfilePage = () => {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    const { showSuccess, showError } = useNotifications()

    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<ProfileTabId>('profile')
    const [activities, setActivities] = useState<Activity[]>([])

    const loadActivities = useCallback(async () => {
        if (!user?.id) return
        try {
            const result = await UserProfileService.getUserActivities(user.id)
            setActivities(result.activities)
        } catch (error) {
            console.error('Erro ao carregar atividades:', error)
        }
    }, [user?.id])

    useEffect(() => {
        if (activeTab === 'activity' && user?.id && activities.length === 0) {
            loadActivities()
        }
    }, [activeTab, user?.id, activities.length, loadActivities])

    const handleAvatarUpload = async (file: File) => {
        if (!user?.id) throw new Error('Usuário não encontrado')
        setIsLoading(true)
        try {
            console.log('Upload avatar:', file.name, 'Tamanho:', file.size)
            await new Promise(resolve => setTimeout(resolve, 1500))
            throw new Error('Endpoint de upload de avatar ainda não implementado')
        } catch (error: unknown) {
            console.error('Erro ao fazer upload do avatar:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
        if (!user?.id || !user?.email) throw new Error('Usuário não encontrado')
        try {
            const response = await fetch('/api/auth/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idUsuario: user.id,
                    password: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.message || 'Erro ao alterar senha')
            showSuccess('Senha alterada com sucesso!', { duration: 5000 })
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erro ao alterar senha'
            showError(message, { duration: 6000 })
            throw error
        }
    }

    return {
        user,
        isAuthenticated,
        authLoading,
        isDark,
        isMobile,
        isLoading,
        setIsLoading,
        activeTab,
        setActiveTab,
        activities,
        tabs: TABS,
        handleAvatarUpload,
        handleChangePassword,
    }
}
