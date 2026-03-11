'use client'

import React, { memo } from 'react'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface IConnectionStatus {
    status: 'disconnected' | 'connecting' | 'connected' | 'error'
    connectionId?: string
    error?: string
}

interface ConnectionStatusProps {
    connectionStatus: IConnectionStatus
    isLoadingInitialData: boolean
    isDark: boolean
}

export const ConnectionStatus = memo<ConnectionStatusProps>(({
    connectionStatus,
    isLoadingInitialData,
    isDark
}) => {
    // Priorizar indicador de carregamento inicial
    if (isLoadingInitialData) {
        return (
            <div className="bg-theme-loading text-theme-loading flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Carregando dados iniciais...</span>
            </div>
        )
    }

    const statusConfig = (() => {
        switch (connectionStatus.status) {
            case 'connected':
                return {
                    icon: <Wifi className="w-4 h-4" />,
                    text: 'Conectado',
                    className: 'bg-theme-connected text-theme-connected flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium'
                }
            case 'connecting':
                return {
                    icon: <Loader2 className="w-4 h-4 animate-spin" />,
                    text: 'Conectando...',
                    className: twMerge(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                        isDark ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    )
                }
            case 'error':
                return {
                    icon: <WifiOff className="w-4 h-4" />,
                    text: 'Erro de Conexão',
                    className: 'bg-theme-error text-theme-error flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium'
                }
            default:
                return {
                    icon: <WifiOff className="w-4 h-4" />,
                    text: 'Desconectado',
                    className: twMerge(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                    )
                }
        }
    })()

    return (
        <div className={statusConfig.className}>
            {statusConfig.icon}
            <span>{statusConfig.text}</span>
        </div>
    )
})

ConnectionStatus.displayName = 'ConnectionStatus'