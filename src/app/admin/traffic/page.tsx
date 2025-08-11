'use client'

import React, { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { TrafficChart } from '@/components/dashboard/TrafficChart'
import { useTrafficData } from '@/hooks/useTrafficData'
import {
    Users,
    Eye,
    UserPlus,
    RefreshCw,
    Globe,
    Monitor,
    Smartphone,
    BarChart3,
    Activity,
    Clock,
    MousePointer,
    ExternalLink,
    MapPin,
    Wifi,
    WifiOff
} from 'lucide-react'

const TrafficPage = () => {
    // Estado para detectar tema
    const [ isDark, setIsDark ] = useState(false)

    // Hook para dados de tráfego
    const {
        isLoading,
        isConnected,
        lastUpdate,
        filters,
        trafficData,
        trafficStats,
        pageViews,
        originTraffic,
        geoData,
        refreshData,
        updateFilters
    } = useTrafficData()

    // Detectar tema atual
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }

        checkTheme()

        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [ 'class' ]
        })

        return () => observer.disconnect()
    }, [])

    return (
        <PageWrapper>
            {/* Header com título */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tráfego de Acessos</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Análise detalhada do tráfego e comportamento dos usuários</p>
            </div>

            {/* Header com status e controles */}
            <div className={`mb-8 p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Visão Geral do Tráfego
                        </h2>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                {isConnected ? (
                                    <>
                                        <Wifi className="w-4 h-4 text-green-500" />
                                        <span className={isDark ? 'text-green-400' : 'text-green-600'}>
                                            Google Analytics Conectado
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-4 h-4 text-red-500" />
                                        <span className={isDark ? 'text-red-400' : 'text-red-600'}>
                                            Google Analytics Desconectado
                                        </span>
                                    </>
                                )}
                            </div>
                            {lastUpdate && (
                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Última atualização: {lastUpdate.toLocaleString('pt-BR')}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Filtros de período */}
                        <div className="flex gap-2">
                            <Button
                                variant={filters.period === 'month' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => updateFilters({ period: 'month', timeRange: 'last_month' })}
                            >
                                Mês
                            </Button>
                            <Button
                                variant={filters.period === 'week' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => updateFilters({ period: 'week', timeRange: 'last_week' })}
                            >
                                Semana
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            icon={RefreshCw}
                            loading={isLoading}
                            onClick={refreshData}
                        >
                            Atualizar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Cards de estatísticas principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            {/* Gráfico principal de tráfego */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Gráfico de linha do tráfego */}
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
                        height={400}
                        isDark={isDark}
                        showUsers={true}
                    />
                </div>

                {/* Card de usuários ativos */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Usuários Ativos
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Usuários Online
                                </span>
                                <span className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                    {trafficStats.activeUsers}
                                </span>
                            </div>
                            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(trafficStats.activeUsers / 2000) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Tempo Médio
                                </span>
                                <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    {trafficStats.avgSessionDuration}
                                </span>
                            </div>
                        </div>

                        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Dispositivos Mais Usados
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

            {/* Tabelas de dados detalhados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Páginas mais visitadas */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Páginas Mais Visitadas
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {pageViews.slice(0, 5).map((page, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4 text-blue-500" />
                                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                            {page.url}
                                        </span>
                                    </div>
                                    <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                        {page.visits.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                        {page.application}
                                    </span>
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                        {page.uniqueUsers.toLocaleString()} usuários únicos
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Origem do tráfego */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Origem do Tráfego
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {originTraffic.slice(0, 5).map((origin, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'}`}
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
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                        {origin.users.toLocaleString()} usuários
                                    </span>
                                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                        {origin.avgEngagementTime}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dados geográficos */}
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <MapPin className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Visitantes por País
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {geoData.map((country, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600/50' : 'bg-gray-50 border-gray-200'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    {country.country}
                                </span>
                                <span className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                    {country.visitPercentage}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    {country.visitors.toLocaleString()} visitantes
                                </span>
                            </div>
                            <div className={`mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5`}>
                                <div
                                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${country.visitPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer com informações adicionais */}
            <div className={`mt-8 p-4 rounded-lg border ${isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Os dados são atualizados automaticamente a cada hora.
                        Para dados em tempo real, conecte-se ao Google Analytics 4.
                    </span>
                </div>
            </div>
        </PageWrapper>
    )
}

export default TrafficPage
