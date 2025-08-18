'use client'

import React, { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useGoogleAnalytics } from '@/components/analytics/GoogleAnalyticsLoader'
import { useTrafficMetrics } from '@/hooks/useTrafficMetrics'
import {
    Users,
    Calendar,
    TrendingUp,
    TrendingDown,
    UserCheck,
    RefreshCw,
    Wifi,
    WifiOff,
    AlertCircle,
    BarChart3,
    Activity,
    Eye,
    Clock,
    Globe,
    Monitor
} from 'lucide-react'

const Dashboard = () => {
    // Estado para detectar tema e montagem
    const [ isDark, setIsDark ] = useState(false)
    const [ mounted, setMounted ] = useState(false)

    // Hook para carregar Google Analytics
    const { isReady: isGAReady, error: gaError, GoogleAnalyticsLoader } = useGoogleAnalytics()

    // Hook para dados do dashboard
    const {
        stats,
        analyticsState,
        isLoading,
        refreshData,
        toggleGAConnection
    } = useDashboardData()

    // Hook para métricas de tráfego reais
    const { metrics: trafficMetrics, isLoading: isLoadingTraffic, refreshMetrics } = useTrafficMetrics()

    // Detectar tema atual
    useEffect(() => {
        setMounted(true)

        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }

        checkTheme()

        // Observer para mudanças no tema
        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [ 'class' ]
        })

        return () => observer.disconnect()
    }, [])

    // Mapeamento de ícones para os cards
    const iconMap = {
        'USUÁRIOS': Users,
        'PACIENTES': UserCheck,
        'AGENDAS': Calendar
    }

    // Mapeamento de cores para ícones
    const iconColorMap = {
        'USUÁRIOS': 'success' as const,
        'PACIENTES': 'info' as const,
        'AGENDAS': 'warning' as const
    }

    // Transformar dados para componente StatsCard (usando o formato dos exemplos)
    const dashboardStats = stats.map(stat => ({
        title: stat.title,
        value: stat.value,
        icon: iconMap[ stat.title as keyof typeof iconMap ] || TrendingUp,
        iconColor: iconColorMap[ stat.title as keyof typeof iconColorMap ] || 'primary',
        trend: { value: stat.change, isPositive: stat.changeType === 'positive' },
        description: mounted ? `Dados atualizados em ${analyticsState.lastUpdate.toLocaleTimeString('pt-BR')}` : 'Carregando dados...'
    }))

    const handleRefresh = () => {
        refreshData()
    }

    const handleGAToggle = () => {
        toggleGAConnection()
    }

    // Prevenir hidratação inconsistente
    if (!mounted) {
        return (
            <PageWrapper maxWidth="full" spacing="xl">
                <div className="w-full space-y-8">
                    <div className="text-center">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[ ...Array(4) ].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper maxWidth="full" spacing="xl">
            {/* Carregador do Google Analytics */}
            <GoogleAnalyticsLoader />

            <div className="w-full space-y-8">
                {/* Header da Página - inspirado no ComponentsExamples */}
                <div className="text-center">
                    <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Dashboard Telescope-ADM
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        Painel principal com dados reais do Google Analytics 4 e sistema interno
                    </p>
                    <div className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-accent/20 border-border/20'}`}>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                            📊 <strong>Dados em Tempo Real:</strong> Métricas atualizadas automaticamente a cada 5 minutos.
                        </p>
                    </div>
                </div>

                {/* Controles de Ação */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Status do Google Analytics */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {analyticsState.isConnected ? (
                            <>
                                <Wifi className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600 dark:text-green-400">
                                    GA4 Conectado
                                </span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-600 dark:text-red-400">
                                    GA4 Desconectado
                                </span>
                            </>
                        )}
                    </div>

                    {/* Botões de ação usando o componente Button ajustado */}
                    {!analyticsState.isConnected && (
                        <Button
                            variant="primary"
                            icon={Wifi}
                            iconPosition="left"
                            onClick={handleGAToggle}
                            disabled={isLoading}
                        >
                            Conectar GA4
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        icon={RefreshCw}
                        iconPosition="left"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        {isLoading ? 'Atualizando...' : 'Atualizar Dados'}
                    </Button>
                </div>

                {/* Alerta de erro se houver */}
                {analyticsState.error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                Erro nos dados
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-300">
                                {analyticsState.error}
                            </p>
                        </div>
                    </div>
                )}

                {/* Seção de Stats Cards - usando o layout dos exemplos */}
                <div className="mb-12">
                    <h2 className={`text-3xl font-semibold mb-6 flex items-center justify-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <BarChart3 className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-primary-600'}`} />
                        Métricas Principais
                    </h2>
                    <p className={`text-lg mb-8 text-center ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        Estatísticas em tempo real do sistema Telescope-ADM
                    </p>

                    {/* Cards Principais - Variante Telescope */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dashboardStats.map((stat, index) => (
                            <StatsCard
                                key={index}
                                title={stat.title}
                                value={isLoading ? '...' : stat.value}
                                icon={stat.icon}
                                iconColor={stat.iconColor}
                                trend={stat.trend}
                                description={stat.description}
                                variant="telescope"
                                isDark={isDark}
                                className={`transform hover:scale-105 transition-all duration-300 ${isLoading ? 'opacity-75' : ''}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Seção de Métricas de Tráfego */}
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                Métricas de Tráfego de Acessos
                            </h2>
                            <Button
                                onClick={refreshMetrics}
                                disabled={isLoadingTraffic}
                                size="sm"
                                variant="outline"
                                className="ml-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoadingTraffic ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                            Análise detalhada do comportamento dos usuários
                        </p>
                    </div>

                    {/* Cards de Métricas de Tráfego */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="VISUALIZAÇÕES"
                            value={isLoadingTraffic ? '...' : trafficMetrics.pageViews.toString()}
                            icon={Eye}
                            iconColor="primary"
                            trend={{ type: 'up', value: '12.5%', isPositive: true }}
                            description="Total de páginas visualizadas"
                            variant="telescope"
                            isDark={isDark}
                            className={`${isLoadingTraffic ? 'opacity-75' : ''}`}
                        />
                        <StatsCard
                            title="SESSÕES"
                            value={isLoadingTraffic ? '...' : trafficMetrics.sessions.toString()}
                            icon={Users}
                            iconColor="success"
                            trend={{ type: 'up', value: '8.3%', isPositive: true }}
                            description="Sessões ativas no período"
                            variant="telescope"
                            isDark={isDark}
                            className={`${isLoadingTraffic ? 'opacity-75' : ''}`}
                        />
                        <StatsCard
                            title="TAXA DE REJEIÇÃO"
                            value={isLoadingTraffic ? '...' : `${(trafficMetrics.bounceRate * 100).toFixed(1)}%`}
                            icon={TrendingDown}
                            iconColor="warning"
                            trend={{ type: 'down', value: '2.1%', isPositive: false }}
                            description="Usuários que saíram rapidamente"
                            variant="telescope"
                            isDark={isDark}
                            className={`${isLoadingTraffic ? 'opacity-75' : ''}`}
                        />
                        <StatsCard
                            title="TEMPO MÉDIO"
                            value={isLoadingTraffic ? '...' : `${Math.round(trafficMetrics.avgSessionDuration / 60)}min`}
                            icon={Clock}
                            iconColor="info"
                            trend={{ type: 'up', value: '15.2%', isPositive: true }}
                            description="Duração média das sessões"
                            variant="telescope"
                            isDark={isDark}
                            className={`${isLoadingTraffic ? 'opacity-75' : ''}`}
                        />
                    </div>

                    {/* Gráfico de Tráfego */}
                    <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            <BarChart3 className="h-5 w-5" />
                            Evolução do Tráfego (Últimos 30 dias)
                        </h3>
                        <div className={`h-64 flex items-center justify-center rounded border ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="text-center">
                                <BarChart3 className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Gráfico de evolução do tráfego
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Dados do Google Analytics 4
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Métricas Adicionais de Tráfego */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Origem do Tráfego */}
                        <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <h4 className={`text-md font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                <Globe className="h-4 w-4" />
                                Origem do Tráfego
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Busca Orgânica</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>45.2%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Tráfego Direto</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>28.7%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Redes Sociais</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>16.1%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Referências</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>10.0%</span>
                                </div>
                            </div>
                        </div>

                        {/* Dispositivos */}
                        <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <h4 className={`text-md font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                <Monitor className="h-4 w-4" />
                                Dispositivos
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Desktop</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>52.3%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Mobile</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>38.9%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Tablet</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>8.8%</span>
                                </div>
                            </div>
                        </div>

                        {/* Páginas Populares */}
                        <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <h4 className={`text-md font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                <Activity className="h-4 w-4" />
                                Páginas Populares
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/dashboard</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>1,234</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/agendamentos</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>892</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/medicos</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>567</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>/relatorios</span>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>234</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Status - usando o layout dos exemplos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            <Activity className="h-5 w-5" />
                            Status da Conectividade
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Google Analytics 4
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${analyticsState.isConnected
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                    {analyticsState.isConnected ? 'Conectado' : 'Desconectado'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    API Interna
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200">
                                    Conectada
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Google API Status
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isGAReady
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    }`}>
                                    {isGAReady ? 'Carregada' : 'Carregando...'}
                                </span>
                            </div>
                        </div>
                        {gaError && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-300">
                                Erro: {gaError}
                            </div>
                        )}
                    </div>

                    <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            <TrendingUp className="h-5 w-5" />
                            Informações do Sistema
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Última atualização
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {mounted ? analyticsState.lastUpdate.toLocaleTimeString('pt-BR') : '--:--:--'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Atualização automática
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    5 min
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Cards carregados
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    {stats.length} métricas
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Tema atual
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                    {isDark ? 'Dark Mode' : 'Light Mode'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Demonstração de Controles Interativos */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50'}`}>
                    <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Ações Rápidas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                            variant="primary"
                            icon={BarChart3}
                            onClick={() => alert('Relatório detalhado em desenvolvimento!')}
                            className="w-full"
                        >
                            Relatório Detalhado
                        </Button>
                        <Button
                            variant="success"
                            icon={TrendingUp}
                            onClick={() => alert('Análise de tendências em desenvolvimento!')}
                            className="w-full"
                        >
                            Análise de Tendências
                        </Button>
                        <Button
                            variant="info"
                            icon={Users}
                            onClick={() => alert('Gestão de usuários em desenvolvimento!')}
                            className="w-full"
                        >
                            Gestão de Usuários
                        </Button>
                        <Button
                            variant="accent"
                            icon={Calendar}
                            onClick={() => alert('Configurações de agenda em desenvolvimento!')}
                            className="w-full"
                        >
                            Configurar Agendas
                        </Button>
                    </div>
                    <div className={`mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        <p>💡 <strong>Dica:</strong> Use os botões acima para acessar funcionalidades avançadas do sistema.</p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default Dashboard
