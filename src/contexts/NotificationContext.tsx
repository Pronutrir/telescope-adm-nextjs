/**
 * 🔔 GLOBAL NOTIFICATION SYSTEM
 * 
 * Sistema de notificações global reutilizável e personalizável
 * - Suporte a múltiplas notificações simultâneas
 * - Tipos: success, error, warning, info
 * - Auto-hide configurável
 * - Posicionamento flexível
 * - Animações suaves
 * - Tema dark/light
 */

'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// 🎯 Tipos de notificação
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// 🎯 Posições possíveis
export type NotificationPosition =
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'

// 🎯 Interface da notificação
export interface Notification {
    id: string
    type: NotificationType
    title?: string
    message: string
    duration?: number // em ms, 0 = não auto-hide
    dismissible?: boolean
    actions?: NotificationAction[]
    icon?: React.ComponentType<any>
    className?: string
}

// 🎯 Ações da notificação (botões)
export interface NotificationAction {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
    className?: string
}

// 🎯 Configurações do sistema
export interface NotificationConfig {
    position: NotificationPosition
    maxNotifications: number
    defaultDuration: number
    defaultDismissible: boolean
    enableSounds: boolean
    enableAnimations: boolean
}

// 🎯 Interface do contexto
interface NotificationContextType {
    notifications: Notification[]
    config: NotificationConfig
    show: (notification: Omit<Notification, 'id'>) => string
    showSuccess: (message: string, options?: Partial<Notification>) => string
    showError: (message: string, options?: Partial<Notification>) => string
    showWarning: (message: string, options?: Partial<Notification>) => string
    showInfo: (message: string, options?: Partial<Notification>) => string
    hide: (id: string) => void
    hideAll: () => void
    updateConfig: (newConfig: Partial<NotificationConfig>) => void
}

// 🎯 Configuração padrão
const defaultConfig: NotificationConfig = {
    position: 'top-right',
    maxNotifications: 5,
    defaultDuration: 5000, // 5 segundos
    defaultDismissible: true,
    enableSounds: false,
    enableAnimations: true
}

// 🎯 Contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// 🎯 Provider
interface NotificationProviderProps {
    children: ReactNode
    initialConfig?: Partial<NotificationConfig>
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    initialConfig = {}
}) => {
    const [ notifications, setNotifications ] = useState<Notification[]>([])
    const [ config, setConfig ] = useState<NotificationConfig>({
        ...defaultConfig,
        ...initialConfig
    })

    // 🔧 Gerar ID único
    const generateId = useCallback(() => {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }, [])

    // 🔧 Auto-hide timer
    const setupAutoHide = useCallback((id: string, duration: number) => {
        if (duration > 0) {
            setTimeout(() => {
                hide(id)
            }, duration)
        }
    }, [])

    // 📝 Mostrar notificação genérica
    const show = useCallback((notificationData: Omit<Notification, 'id'>): string => {
        const id = generateId()
        const notification: Notification = {
            id,
            duration: config.defaultDuration,
            dismissible: config.defaultDismissible,
            ...notificationData
        }

        setNotifications(prev => {
            const newNotifications = [ ...prev, notification ]

            // Limitar número máximo de notificações
            if (newNotifications.length > config.maxNotifications) {
                return newNotifications.slice(-config.maxNotifications)
            }

            return newNotifications
        })

        // Configurar auto-hide se necessário
        if (notification.duration && notification.duration > 0) {
            setupAutoHide(id, notification.duration)
        }

        return id
    }, [ generateId, config.defaultDuration, config.defaultDismissible, config.maxNotifications, setupAutoHide ])

    // ✅ Notificação de sucesso
    const showSuccess = useCallback((message: string, options: Partial<Notification> = {}): string => {
        return show({
            type: 'success',
            message,
            ...options
        })
    }, [ show ])

    // ❌ Notificação de erro
    const showError = useCallback((message: string, options: Partial<Notification> = {}): string => {
        return show({
            type: 'error',
            message,
            duration: 0, // Erros não desaparecem automaticamente por padrão
            ...options
        })
    }, [ show ])

    // ⚠️ Notificação de aviso
    const showWarning = useCallback((message: string, options: Partial<Notification> = {}): string => {
        return show({
            type: 'warning',
            message,
            ...options
        })
    }, [ show ])

    // ℹ️ Notificação informativa
    const showInfo = useCallback((message: string, options: Partial<Notification> = {}): string => {
        return show({
            type: 'info',
            message,
            ...options
        })
    }, [ show ])

    // 🗑️ Esconder notificação específica
    const hide = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, [])

    // 🗑️ Esconder todas as notificações
    const hideAll = useCallback(() => {
        setNotifications([])
    }, [])

    // ⚙️ Atualizar configurações
    const updateConfig = useCallback((newConfig: Partial<NotificationConfig>) => {
        setConfig(prev => ({ ...prev, ...newConfig }))
    }, [])

    const contextValue: NotificationContextType = {
        notifications,
        config,
        show,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hide,
        hideAll,
        updateConfig
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    )
}

// 🪝 Hook para usar notificações
export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext)

    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }

    return context
}

// 🎯 Hook simplificado para casos comuns
export const useNotify = () => {
    const { showSuccess, showError, showWarning, showInfo } = useNotifications()

    return {
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo
    }
}
