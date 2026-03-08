'use client'

import React from 'react'
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { AnalyticsState } from '@/hooks/useDashboardData'

interface Props {
    isDark: boolean
    isLoading: boolean
    analyticsState: AnalyticsState
    onRefresh: () => void
    onGAToggle: () => void
}

export const DashboardControls: React.FC<Props> = ({
    isDark,
    isLoading,
    analyticsState,
    onRefresh,
    onGAToggle,
}) => (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg',
                isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
                {analyticsState.isConnected ? (
                    <>
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400">GA4 Conectado</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600 dark:text-red-400">GA4 Desconectado</span>
                    </>
                )}
            </div>

            {!analyticsState.isConnected && (
                <Button variant="primary" icon={Wifi} iconPosition="left" onClick={onGAToggle} disabled={isLoading}>
                    Conectar GA4
                </Button>
            )}

            <Button
                variant="secondary"
                icon={RefreshCw}
                iconPosition="left"
                onClick={onRefresh}
                disabled={isLoading}
                loading={isLoading}
            >
                {isLoading ? 'Atualizando...' : 'Atualizar Dados'}
            </Button>
        </div>

        {analyticsState.error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Erro nos dados</p>
                    <p className="text-sm text-red-600 dark:text-red-300">{analyticsState.error}</p>
                </div>
            </div>
        )}
    </div>
)
