'use client'

import React from 'react'
import { Eye, Users, TrendingDown, Clock, RefreshCw, BarChart3, Globe, Monitor, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import type { TrafficMetrics } from '@/hooks/useTrafficMetrics'

interface Props {
    isDark: boolean
    trafficMetrics: TrafficMetrics
    isLoadingTraffic: boolean
    onRefresh: () => void
}

const TRAFFIC_SOURCES = [
    { label: 'Busca Orgânica', value: '45.2%' },
    { label: 'Tráfego Direto', value: '28.7%' },
    { label: 'Redes Sociais', value: '16.1%' },
    { label: 'Referências', value: '10.0%' },
]

const DEVICES = [
    { label: 'Desktop', value: '52.3%' },
    { label: 'Mobile', value: '38.9%' },
    { label: 'Tablet', value: '8.8%' },
]

const TOP_PAGES = [
    { label: '/dashboard', value: '1.234' },
    { label: '/agendamentos', value: '892' },
    { label: '/medicos', value: '567' },
    { label: '/relatorios', value: '234' },
]

const InfoRow: React.FC<{ label: string; value: string; isDark: boolean }> = ({ label, value, isDark }) => (
    <div className="flex justify-between items-center">
        <span className={cn('text-sm truncate', isDark ? 'text-gray-300' : 'text-gray-600')}>{label}</span>
        <span className={cn('text-sm font-medium ml-2 shrink-0', isDark ? 'text-white' : 'text-gray-900')}>{value}</span>
    </div>
)

const SubCard: React.FC<{ isDark: boolean; icon: React.ReactNode; title: string; rows: { label: string; value: string }[] }> = ({ isDark, icon, title, rows }) => (
    <div className={cn('p-6 rounded-lg border', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm')}>
        <h4 className={cn('text-md font-semibold mb-4 flex items-center gap-2', isDark ? 'text-white' : 'text-slate-800')}>
            {icon}{title}
        </h4>
        <div className="space-y-3">
            {rows.map(row => <InfoRow key={row.label} isDark={isDark} {...row} />)}
        </div>
    </div>
)

export const TrafficMetricsSection: React.FC<Props> = ({ isDark, trafficMetrics, isLoadingTraffic, onRefresh }) => {
    const loading = isLoadingTraffic

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <h2 className={cn('text-2xl font-semibold', isDark ? 'text-white' : 'text-slate-800')}>
                        Métricas de Tráfego de Acessos
                    </h2>
                    <Button onClick={onRefresh} disabled={loading} size="sm" variant="outline">
                        <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                    </Button>
                </div>
                <p className={cn(isDark ? 'text-gray-300' : 'text-muted-foreground')}>
                    Análise detalhada do comportamento dos usuários
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="VISUALIZAÇÕES" value={loading ? '...' : trafficMetrics.pageViews.toString()}
                    icon={Eye} iconColor="primary" trend={{ type: 'up', value: '12.5%', isPositive: true }}
                    description="Total de páginas visualizadas" variant="telescope" isDark={isDark}
                    className={cn(loading && 'opacity-75')} />
                <StatsCard title="SESSÕES" value={loading ? '...' : trafficMetrics.sessions.toString()}
                    icon={Users} iconColor="success" trend={{ type: 'up', value: '8.3%', isPositive: true }}
                    description="Sessões ativas no período" variant="telescope" isDark={isDark}
                    className={cn(loading && 'opacity-75')} />
                <StatsCard title="TAXA DE REJEIÇÃO" value={loading ? '...' : `${(trafficMetrics.bounceRate * 100).toFixed(1)}%`}
                    icon={TrendingDown} iconColor="warning" trend={{ type: 'down', value: '2.1%', isPositive: false }}
                    description="Usuários que saíram rapidamente" variant="telescope" isDark={isDark}
                    className={cn(loading && 'opacity-75')} />
                <StatsCard title="TEMPO MÉDIO" value={loading ? '...' : `${Math.round(trafficMetrics.avgSessionDuration / 60)}min`}
                    icon={Clock} iconColor="info" trend={{ type: 'up', value: '15.2%', isPositive: true }}
                    description="Duração média das sessões" variant="telescope" isDark={isDark}
                    className={cn(loading && 'opacity-75')} />
            </div>

            {/* Gráfico placeholder */}
            <div className={cn('p-6 rounded-lg border', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm')}>
                <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', isDark ? 'text-white' : 'text-slate-800')}>
                    <BarChart3 className="h-5 w-5" />Evolução do Tráfego (Últimos 30 dias)
                </h3>
                <div className={cn('h-64 flex items-center justify-center rounded border', isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50')}>
                    <div className="text-center">
                        <BarChart3 className={cn('h-12 w-12 mx-auto mb-3', isDark ? 'text-gray-500' : 'text-gray-400')} />
                        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>Gráfico de evolução do tráfego</p>
                        <p className={cn('text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-400')}>Dados do Google Analytics 4</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SubCard isDark={isDark} icon={<Globe className="h-4 w-4" />} title="Origem do Tráfego" rows={TRAFFIC_SOURCES} />
                <SubCard isDark={isDark} icon={<Monitor className="h-4 w-4" />} title="Dispositivos" rows={DEVICES} />
                <SubCard isDark={isDark} icon={<Activity className="h-4 w-4" />} title="Páginas Populares" rows={TOP_PAGES} />
            </div>
        </div>
    )
}
