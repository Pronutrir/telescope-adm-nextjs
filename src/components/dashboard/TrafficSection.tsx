'use client'

import React from 'react'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { TrafficChart } from '@/components/dashboard/TrafficChart'
import { useTrafficData } from '@/hooks/useTrafficData'
import {
    TrendingUp,
    Users,
    Eye,
    UserPlus,
    RefreshCw,
    BarChart3,
    Activity,
    Globe,
    ExternalLink,
    Clock,
    MousePointer,
    Monitor,
    Smartphone
} from 'lucide-react'

interface TrafficSectionProps {
    isDark?: boolean
    className?: string
}

export const TrafficSection: React.FC<TrafficSectionProps> = ({
    isDark = false,
    className = ''
}) => {
    const {
        trafficData,
        trafficStats,
        pageViews,
        originTraffic,
        isLoading,
        isConnected,
        error,
        refreshData,
        handleAuth
    } = useTrafficData()

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Alerta de erro se houver */}
            {error && (
                <div className={`p-4 rounded-lg border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                        Erro: {error}
                    </p>
                </div>
            )}

            {/* Header da Seção */}
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            <TrendingUp className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            Tráfego de Acessos
                        </h2>
                        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                            Dados em tempo real do Google Analytics 4 e API interna
                        </p>
                        {!isConnected && (
                            <div className={`mt-2 text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                Google Analytics não conectado - usando dados mock
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={RefreshCw}
                            loading={isLoading}
                            onClick={refreshData}
                        >
                            Atualizar
                        </Button>

                        {!isConnected && (
                            <Button
                                variant="success"
                                size="sm"
                                icon={Activity}
                                onClick={handleAuth}
                            >
                                Conectar GA4
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Cards de Estatísticas - Estilo FlyonCardExamples */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total de Visitas"
                    value={trafficStats.totalVisits.toLocaleString('pt-BR')}
                    icon={Eye}
                    iconColor="primary"
                    trend={{
                        value: '+12.5% vs período anterior',
                        isPositive: true
                    }}
                    description="Visualizações de páginas totais"
                    variant="telescope"
                    isDark={isDark}
                />

                <StatsCard
                    title="Usuários Únicos"
                    value={trafficStats.totalUsers.toLocaleString('pt-BR')}
                    icon={Users}
                    iconColor="success"
                    trend={{
                        value: '+8.3% vs período anterior',
                        isPositive: true
                    }}
                    description="Usuários únicos que acessaram"
                    variant="telescope"
                    isDark={isDark}
                />

                <StatsCard
                    title="Novos Usuários"
                    value={trafficStats.newUsers.toLocaleString('pt-BR')}
                    icon={UserPlus}
                    iconColor="info"
                    trend={{
                        value: '+15.7% vs período anterior',
                        isPositive: true
                    }}
                    description="Primeira visita ao sistema"
                    variant="telescope"
                    isDark={isDark}
                />

                <StatsCard
                    title="Taxa de Rejeição"
                    value={`${trafficStats.bounceRate}%`}
                    icon={MousePointer}
                    iconColor="warning"
                    trend={{
                        value: '-2.1% vs período anterior',
                        isPositive: true
                    }}
                    description="Usuários que saíram rapidamente"
                    variant="telescope"
                    isDark={isDark}
                />
            </div>

            {/* Gráfico e Dados Detalhados */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico Principal */}
                <div className={`lg:col-span-2 p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Evolução do Tráfego
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Visitas e usuários ao longo do tempo
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Visitas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Usuários</span>
                            </div>
                        </div>
                    </div>
                    <TrafficChart
                        data={trafficData}
                        height={350}
                        isDark={isDark}
                        showUsers={true}
                    />
                </div>

                {/* Usuários Ativos */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Status em Tempo Real
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Usuários Online
                                </span>
                                <span className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                    1,429
                                </span>
                            </div>
                            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: '71%' }}
                                ></div>
                            </div>
                        </div>

                        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Dispositivos
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="w-4 h-4" />
                                        <span className="text-sm">Desktop</span>
                                    </div>
                                    <span className="text-sm font-medium">67%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="w-4 h-4" />
                                        <span className="text-sm">Mobile</span>
                                    </div>
                                    <span className="text-sm font-medium">33%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabelas de Dados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Páginas Mais Visitadas */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Páginas Mais Visitadas
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {pageViews.map((page, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-all duration-200`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4 text-blue-500" />
                                        <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                            {page.url}
                                        </span>
                                    </div>
                                    <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                        {page.visits.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {page.application}
                                    </span>
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {page.uniqueUsers.toLocaleString()} usuários únicos
                                    </span>
                                </div>
                                <div className={`mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5`}>
                                    <div
                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${page.accessIndex}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Origem do Tráfego */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Origem do Tráfego
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {originTraffic.map((origin, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-all duration-200`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                            {origin.source}
                                        </span>
                                        <span className={`text-sm ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            ({origin.medium})
                                        </span>
                                    </div>
                                    <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                        {origin.trafficPercentage}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {origin.users.toLocaleString()} usuários
                                    </span>
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {origin.sessions.toLocaleString()} sessões
                                    </span>
                                </div>
                                <div className={`mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5`}>
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${origin.trafficPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer com dica */}
            <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        🎯 <strong>Design System:</strong> Este componente segue o mesmo padrão visual dos FlyonCardExamples
                        com dados reais da aplicação original.
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TrafficSection
