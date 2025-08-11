'use client'

import React, { useState, useEffect } from 'react'
import { Users, UserCheck, Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { StatsCard } from '@/components/ui/StatsCard'

interface IAcompanhantesStatsProps {
    className?: string
}

// Mock de dados para demonstração - substituir por dados reais da API
const statsData = {
    acompanhantesAtivos: {
        total: 42,
        trend: { value: '+8.2%', isPositive: true },
        description: 'vs semana anterior'
    },
    novosHoje: {
        total: 8,
        trend: { value: '+15%', isPositive: true },
        description: 'vs ontem'
    },
    pendentes: {
        total: 3,
        trend: { value: '-2', isPositive: true },
        description: 'menos que ontem'
    },
    tempoMedio: {
        total: '4h 20m',
        trend: { value: '+12%', isPositive: false },
        description: 'vs média mensal'
    },
    totalSemana: {
        total: 127,
        trend: { value: '+23%', isPositive: true },
        description: 'vs semana anterior'
    },
    satisfacao: {
        total: '94.2%',
        trend: { value: '+2.1%', isPositive: true },
        description: 'avaliação positiva'
    }
}

const AcompanhantesStats: React.FC<IAcompanhantesStatsProps> = ({ className }) => {
    // Estado para detectar tema
    const [ isDark, setIsDark ] = useState(false)

    // Detectar tema atual
    useEffect(() => {
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

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className || ''}`}>
            {/* Acompanhantes Ativos */}
            <StatsCard
                title="Acompanhantes Ativos"
                value={statsData.acompanhantesAtivos.total.toString()}
                icon={UserCheck}
                iconColor="success"
                trend={{
                    value: statsData.acompanhantesAtivos.trend.value,
                    isPositive: statsData.acompanhantesAtivos.trend.isPositive
                }}
                description={statsData.acompanhantesAtivos.description}
                variant="telescope"
                isDark={isDark}
            />

            {/* Novos Hoje */}
            <StatsCard
                title="Novos Hoje"
                value={statsData.novosHoje.total.toString()}
                icon={Users}
                iconColor="primary"
                trend={{
                    value: statsData.novosHoje.trend.value,
                    isPositive: statsData.novosHoje.trend.isPositive
                }}
                description={statsData.novosHoje.description}
                variant="telescope"
                isDark={isDark}
            />

            {/* Pendentes */}
            <StatsCard
                title="Pendentes"
                value={statsData.pendentes.total.toString()}
                icon={AlertTriangle}
                iconColor="warning"
                trend={{
                    value: statsData.pendentes.trend.value,
                    isPositive: statsData.pendentes.trend.isPositive
                }}
                description={statsData.pendentes.description}
                variant="telescope"
                isDark={isDark}
            />

            {/* Tempo Médio */}
            <StatsCard
                title="Tempo Médio"
                value={statsData.tempoMedio.total}
                icon={Clock}
                iconColor="info"
                trend={{
                    value: statsData.tempoMedio.trend.value,
                    isPositive: statsData.tempoMedio.trend.isPositive
                }}
                description={statsData.tempoMedio.description}
                variant="telescope"
                isDark={isDark}
            />

            {/* Total da Semana */}
            <StatsCard
                title="Total da Semana"
                value={statsData.totalSemana.total.toString()}
                icon={TrendingUp}
                iconColor="success"
                trend={{
                    value: statsData.totalSemana.trend.value,
                    isPositive: statsData.totalSemana.trend.isPositive
                }}
                description={statsData.totalSemana.description}
                variant="telescope"
            />

            {/* Satisfação */}
            <StatsCard
                title="Satisfação"
                value={statsData.satisfacao.total}
                icon={Activity}
                iconColor="success"
                trend={{
                    value: statsData.satisfacao.trend.value,
                    isPositive: statsData.satisfacao.trend.isPositive
                }}
                description={statsData.satisfacao.description}
                variant="telescope"
            />
        </div>
    )
}

export default AcompanhantesStats
