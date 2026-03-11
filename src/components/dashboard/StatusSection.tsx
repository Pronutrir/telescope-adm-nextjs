'use client'

import React from 'react'
import { Activity, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalyticsState } from '@/hooks/useDashboardData'

interface Props {
    isDark: boolean
    mounted: boolean
    isGAReady: boolean
    gaError: string | null
    analyticsState: AnalyticsState
    statsCount: number
}

const Badge: React.FC<{ color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray'; label: string }> = ({ color, label }) => {
    const colorCls: Record<string, string> = {
        green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200',
        purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    }
    return (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', colorCls[color])}>
            {label}
        </span>
    )
}

const StatusRow: React.FC<{ isDark: boolean; label: string; badge: React.ReactNode }> = ({ isDark, label, badge }) => (
    <div className="flex items-center justify-between">
        <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>{label}</span>
        {badge}
    </div>
)

export const StatusSection: React.FC<Props> = ({ isDark, mounted, isGAReady, gaError, analyticsState, statsCount }) => {
    const cardCls = cn('p-6 rounded-lg border', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm')
    const titleCls = cn('text-lg font-semibold mb-4 flex items-center gap-2', isDark ? 'text-white' : 'text-slate-800')

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={cardCls}>
                <h3 className={titleCls}>
                    <Activity className="h-5 w-5" />Status da Conectividade
                </h3>
                <div className="space-y-3">
                    <StatusRow isDark={isDark} label="Google Analytics 4"
                        badge={<Badge color={analyticsState.isConnected ? 'green' : 'red'} label={analyticsState.isConnected ? 'Conectado' : 'Desconectado'} />} />
                    <StatusRow isDark={isDark} label="API Interna"
                        badge={<Badge color="blue" label="Conectada" />} />
                    <StatusRow isDark={isDark} label="Google API Status"
                        badge={<Badge color={isGAReady ? 'green' : 'yellow'} label={isGAReady ? 'Carregada' : 'Carregando...'} />} />
                </div>
                {gaError && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-300">
                        Erro: {gaError}
                    </div>
                )}
            </div>

            <div className={cardCls}>
                <h3 className={titleCls}>
                    <TrendingUp className="h-5 w-5" />Informações do Sistema
                </h3>
                <div className="space-y-3">
                    <StatusRow isDark={isDark} label="Última atualização"
                        badge={<Badge color="blue" label={mounted ? analyticsState.lastUpdate.toLocaleTimeString('pt-BR') : '--:--:--'} />} />
                    <StatusRow isDark={isDark} label="Atualização automática"
                        badge={<Badge color="green" label="5 min" />} />
                    <StatusRow isDark={isDark} label="Cards carregados"
                        badge={<Badge color="purple" label={`${statsCount} métricas`} />} />
                    <StatusRow isDark={isDark} label="Tema atual"
                        badge={<Badge color="gray" label={isDark ? 'Dark Mode' : 'Light Mode'} />} />
                </div>
            </div>
        </div>
    )
}
