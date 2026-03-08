'use client'

import { useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { useDashboardData } from '@/hooks/useDashboardData'
import type { DashboardStats } from '@/hooks/useDashboardData'
import { useGoogleAnalytics } from '@/components/analytics/GoogleAnalyticsLoader'
import { useTrafficMetrics } from '@/hooks/useTrafficMetrics'
import { Users, Calendar, UserCheck, TrendingUp } from 'lucide-react'

type IconColor = 'primary' | 'success' | 'info' | 'warning'

const ICON_MAP = {
    'USUÁRIOS': Users,
    'PACIENTES': UserCheck,
    'AGENDAS': Calendar,
} as const

const COLOR_MAP: Record<string, IconColor> = {
    'USUÁRIOS': 'success',
    'PACIENTES': 'info',
    'AGENDAS': 'warning',
}

export const useDashboard = () => {
    const { isDark } = useTheme()
    const { mounted } = useLayout()

    const { isReady: isGAReady, error: gaError, GoogleAnalyticsLoader } = useGoogleAnalytics()

    const { stats, analyticsState, isLoading, refreshData, toggleGAConnection } = useDashboardData()

    const { metrics: trafficMetrics, isLoading: isLoadingTraffic, refreshMetrics } = useTrafficMetrics()

    const dashboardCards = stats.map((stat: DashboardStats) => ({
        title: stat.title,
        value: stat.value,
        icon: ICON_MAP[stat.title as keyof typeof ICON_MAP] ?? TrendingUp,
        iconColor: COLOR_MAP[stat.title] ?? ('primary' as IconColor),
        trend: { value: stat.change, isPositive: stat.changeType === 'positive' },
        description: mounted
            ? `Atualizado em ${analyticsState.lastUpdate.toLocaleTimeString('pt-BR')}`
            : 'Carregando dados...',
    }))

    const handleRefresh = useCallback(() => refreshData(), [refreshData])
    const handleGAToggle = useCallback(() => toggleGAConnection(), [toggleGAConnection])

    return {
        isDark,
        mounted,
        isGAReady,
        gaError,
        GoogleAnalyticsLoader,
        stats,
        analyticsState,
        isLoading,
        dashboardCards,
        trafficMetrics,
        isLoadingTraffic,
        refreshMetrics,
        handleRefresh,
        handleGAToggle,
    }
}
