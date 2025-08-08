'use client'

import React, { useState, useEffect } from 'react'
import { MainLayout, PageWrapper } from '@/components/layout'
import { ThemeDebug } from '@/components/debug/ThemeDebug'
import { StatsCard } from '@/components/ui/StatsCard'
import { FlyonCard, CardBody, CardTitle, CardActions, CardButton } from '@/components/ui/FlyonCard'
import TrafficTable from '@/components/dashboard/TrafficTable'
import LineChart from '@/components/dashboard/LineChart'
import { useDashboardData, useChartData } from '@/hooks/useDashboardData'
import {
    Users,
    Calendar,
    Activity,
    TrendingUp,
    Clock,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    Globe,
    Link,
    Monitor,
    Smartphone,
    ArrowUpRight,
    ArrowDownRight,
    Database,
    FileText,
    UserCheck,
    Settings
} from 'lucide-react'

const Dashboard = () => {
    // Hooks para dados do dashboard
    const {
        analyticsState,
        stats,
        activities,
        trafficData,
        geoData,
        trafficOrigin,
        refreshData,
        toggleGAConnection,
        isLoading: isDashboardLoading
    } = useDashboardData()

    // Estado para período do gráfico
    const [ activeTab, setActiveTab ] = useState<'month' | 'week'>('month')

    // Hook para dados do gráfico
    const {
        chartData,
        isLoading: isChartLoading,
        refreshChart
    } = useChartData(activeTab)

    const handleTabChange = (tab: 'month' | 'week') => {
        setActiveTab(tab)
    }

    // Dados estáticos para demonstração (removidos após implementação dos hooks)
    const staticStats = [
        {
            title: 'Total de Usuários',
            value: '2,847',
            change: '+12%',
            changeType: 'positive' as const,
            icon: Users,
            color: 'from-primary-500 to-primary-600'
        },
        {
            title: 'Sessões Ativas',
            value: '1,429',
            change: '+8%',
            changeType: 'positive' as const,
            icon: Activity,
            color: 'from-success-500 to-success-600'
        },
        {
            title: 'Taxa de Engajamento',
            value: '87%',
            change: '-2%',
            changeType: 'negative' as const,
            icon: TrendingUp,
            color: 'from-warning-500 to-warning-600'
        },
        {
            title: 'Tempo Médio Sessão',
            value: '4:32',
            change: '+15%',
            changeType: 'positive' as const,
            icon: Clock,
            color: 'from-secondary-500 to-secondary-600'
        }
    ]

    const staticActivity = [
        {
            id: 1,
            type: 'ga4',
            message: 'Google Analytics conectado com sucesso',
            time: '2 min atrás',
            icon: Database,
            color: 'text-success-500'
        },
        {
            id: 2,
            type: 'user',
            message: 'Novo usuário cadastrado no sistema',
            time: '15 min atrás',
            icon: UserCheck,
            color: 'text-primary-500'
        },
        {
            id: 3,
            type: 'alert',
            message: 'Pico de tráfego detectado (+45%)',
            time: '28 min atrás',
            icon: AlertTriangle,
            color: 'text-warning-500'
        },
        {
            id: 4,
            type: 'system',
            message: 'Backup automático realizado',
            time: '1 hora atrás',
            icon: CheckCircle,
            color: 'text-success-500'
        }
    ]

    // Dados de tráfego simulados
    const staticTrafficData = [
        { url: '/dashboard', views: 3985, users: 319, rate: 46.53, app: 'Telescope ADM' },
        { url: '/agenda', views: 3513, users: 294, rate: 36.49, app: 'Sistema Agendamento' },
        { url: '/relatorios', views: 2050, users: 147, rate: 50.87, app: 'Relatórios' },
        { url: '/usuarios', views: 1795, users: 190, rate: 28.43, app: 'Gestão Usuários' },
        { url: '/configuracoes', views: 1205, users: 98, rate: 33.21, app: 'Configurações' },
        { url: '/perfil', views: 892, users: 76, rate: 41.22, app: 'Perfil Usuário' },
        { url: '/ajuda', views: 634, users: 52, rate: 35.17, app: 'Central de Ajuda' }
    ]

    // Dados geográficos simulados
    const staticGeoData = [
        { country: 'Brasil', sessions: 1250, percentage: 68.5 },
        { country: 'Estados Unidos', sessions: 320, percentage: 17.5 },
        { country: 'Argentina', sessions: 145, percentage: 8.0 },
        { country: 'Chile', sessions: 68, percentage: 3.7 },
        { country: 'Outros', sessions: 42, percentage: 2.3 }
    ]

    // Traffic origin data simulada
    const staticTrafficOrigin = [
        { source: 'Direto', users: 847, sessions: 1203, engagement: 892, avgTime: '00:04:32', percentage: 45.2 },
        { source: 'Google', users: 634, sessions: 892, engagement: 654, avgTime: '00:03:18', percentage: 33.6 },
        { source: 'Facebook', users: 289, sessions: 412, engagement: 287, avgTime: '00:02:45', percentage: 15.5 },
        { source: 'LinkedIn', users: 124, sessions: 178, engagement: 134, avgTime: '00:05:12', percentage: 6.7 }
    ]

    return (
        <MainLayout>
            <PageWrapper maxWidth="full" spacing="xl">
                <div className="content-distributed">
                    <ThemeDebug />

                    {/* Header - Melhorado com mais espaçamento */}
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 bg-clip-text text-transparent mb-4">
                            Dashboard Analytics
                        </h1>
                        <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
                            Visão geral completa do sistema Telescope ADM
                        </p>
                    </div>

                    {/* GA4 Integration Status - Card com elevação */}
                    <FlyonCard variant="telescope" size="xl" elevation="xl" className="card-hover-lift">
                        <CardBody padding="lg">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                                        <Database className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle level={3} gradient className="text-xl mb-1">
                                            GA4 (Google Analytics Data API)
                                        </CardTitle>
                                        <p className="text-gray-300 text-sm">Detalhes da integração</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${analyticsState.isConnected ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'}`} />
                                    <span className={`text-sm font-medium ${analyticsState.isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                        {analyticsState.isConnected ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-300 space-y-2">
                                <p>Status de integração: <span className={analyticsState.isConnected ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>{analyticsState.isConnected ? 'Conectado' : 'Desconectado'}</span></p>
                                <p>Última atualização: <span className="text-white font-medium">{analyticsState.lastUpdate.toLocaleString('pt-BR')}</span></p>
                            </div>
                        </CardBody>
                    </FlyonCard>
                    {/* Stats Grid - Melhor espaçamento e elevação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {staticStats.map((stat, index) => (
                            <StatsCard
                                key={index}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                iconColor={stat.changeType === 'positive' ? 'success' : 'warning'}
                                trend={{
                                    value: stat.change + ' vs período anterior',
                                    isPositive: stat.changeType === 'positive'
                                }}
                                variant="telescope"
                                className="h-full card-hover-lift"
                            />
                        ))}
                    </div>

                    {/* Traffic Chart - Espaçamento melhorado */}
                    <LineChart
                        data={chartData}
                        isLoading={isChartLoading}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    {/* Content Grid - Cards com elevação melhorada */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Traffic Table */}
                        <div className="lg:col-span-2">
                            <TrafficTable data={staticTrafficData} />
                        </div>

                        {/* Recent Activity */}
                        <FlyonCard variant="telescope" size="lg" elevation="lg" className="h-fit card-hover-lift">
                            <CardBody padding="lg">
                                <CardTitle level={4} gradient className="mb-6 flex items-center">
                                    <Activity className="w-5 h-5 mr-2 text-blue-400" />
                                    Atividade Recente
                                </CardTitle>
                                <div className="space-y-4">
                                    {staticActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/30 hover:bg-gray-800/80 transition-colors">
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shadow-md`}>
                                                <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white font-medium">
                                                    {activity.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <CardActions justify="center" className="mt-6">
                                    <CardButton variant="outline" size="sm">
                                        Ver todas as atividades
                                    </CardButton>
                                </CardActions>
                            </CardBody>
                        </FlyonCard>
                    </div>

                    {/* Geographic and Traffic Origin Data - Cards elevados */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Geographic Data */}
                        <FlyonCard variant="telescope" size="lg" elevation="lg" className="h-fit card-hover-lift">
                            <CardBody padding="lg">
                                <CardTitle level={4} gradient className="mb-6 flex items-center">
                                    <Globe className="w-5 h-5 mr-2 text-blue-400" />
                                    Dados Geográficos
                                </CardTitle>
                                <div className="space-y-3">
                                    {staticGeoData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-800/60 border border-gray-700/30 hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg">
                                            <span className="text-sm text-white font-medium">{item.country}</span>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm text-gray-300">{item.sessions} sessões</span>
                                                <span className="text-lg font-bold text-blue-400">{item.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <CardActions justify="center" className="mt-6">
                                    <CardButton variant="ghost" size="sm">
                                        Ver relatório completo
                                    </CardButton>
                                </CardActions>
                            </CardBody>
                        </FlyonCard>

                        {/* Traffic Origin */}
                        <FlyonCard variant="telescope" size="lg" elevation="lg" className="h-fit card-hover-lift">
                            <CardBody padding="lg">
                                <CardTitle level={4} gradient className="mb-6 flex items-center">
                                    <Link className="w-5 h-5 mr-2 text-blue-400" />
                                    Origem do Tráfego
                                </CardTitle>
                                <div className="space-y-3">
                                    {staticTrafficOrigin.map((item, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-gray-800/60 border border-gray-700/30 hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm text-white font-medium">{item.source}</span>
                                                <span className="text-sm text-blue-400 font-bold">{item.percentage}%</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                                                <span>Usuários: {item.users}</span>
                                                <span>Sessões: {item.sessions}</span>
                                                <span>Engajados: {item.engagement}</span>
                                                <span>Tempo: {item.avgTime}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <CardActions justify="center" className="mt-6">
                                    <CardButton variant="primary" size="sm">
                                        Analisar Tráfego
                                    </CardButton>
                                </CardActions>
                            </CardBody>
                        </FlyonCard>
                    </div>

                    {/* Device & Technology Info Placeholder */}
                    <FlyonCard variant="telescope" size="xl" elevation="lg" className="card-hover-lift">
                        <CardBody padding="lg">
                            <div className="flex items-center justify-between mb-6">
                                <CardTitle level={4} gradient className="flex items-center">
                                    <Monitor className="w-5 h-5 mr-2 text-blue-400" />
                                    Informações de Dispositivos e Tecnologia
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Monitor className="w-4 h-4 text-blue-400" />
                                    <Smartphone className="w-4 h-4 text-purple-400" />
                                </div>
                            </div>
                            <div className="h-40 bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-xl flex items-center justify-center border border-gray-700/30">
                                <div className="text-center">
                                    <Settings className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                    <p className="text-white text-lg font-medium">Dados de dispositivos e navegadores</p>
                                    <p className="text-gray-300 text-sm mt-2">Integração com GA4 - Tecnologia de acesso</p>
                                </div>
                            </div>
                            <CardActions justify="center" className="mt-6">
                                <CardButton variant="primary" size="md">
                                    Configurar Integração
                                </CardButton>
                                <CardButton variant="outline" size="md">
                                    Ver Documentação
                                </CardButton>
                            </CardActions>
                        </CardBody>
                    </FlyonCard>
                </div>
            </PageWrapper>
        </MainLayout>
    )
}

export default Dashboard
