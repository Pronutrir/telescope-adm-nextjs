'use client'

import React from 'react'
import { BarChart3, Database, Shield, Monitor, Settings, Globe, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatsCard } from '@/components/ui/StatsCard'
import type { STATS_EXAMPLES } from './useBibliotecaComponentes'

interface Props {
    isDark: boolean
    statsExamples: typeof STATS_EXAMPLES
}

const VARIANTS = [
    { key: 'default', label: 'Variante Default' },
    { key: 'gradient', label: 'Variante Gradient' },
    { key: 'telescope', label: 'Variante Telescope (Premium)' },
] as const

const ICON_COLORS = [
    { title: 'Primary', icon: Database, color: 'primary' as const },
    { title: 'Success', icon: Shield, color: 'success' as const },
    { title: 'Warning', icon: Monitor, color: 'warning' as const },
    { title: 'Error', icon: Settings, color: 'error' as const },
    { title: 'Info', icon: Globe, color: 'info' as const },
]

export const StatsCardSection: React.FC<Props> = ({ isDark, statsExamples }) => (
    <div className="mb-12">
        <h2 className={cn('text-3xl font-semibold mb-6 flex items-center gap-2', isDark ? 'text-white' : 'text-slate-800')}>
            <BarChart3 className={cn('w-7 h-7', isDark ? 'text-blue-400' : 'text-primary-600')} />
            StatsCard Component
        </h2>
        <p className={cn('text-lg mb-8', isDark ? 'text-gray-300' : 'text-muted-foreground')}>
            Componente para exibir estatísticas com diferentes variantes e estilos.
        </p>

        {VARIANTS.map(({ key, label }) => (
            <div key={key} className="mb-8">
                <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>{label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsExamples.map((stat, i) => (
                        <StatsCard key={`${key}-${i}`} {...stat} variant={key} isDark={isDark} />
                    ))}
                </div>
            </div>
        ))}

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>Versões Simplificadas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatsCard title="Vendas do Mês" value="R$ 45.230" variant="default" isDark={isDark} />
                <StatsCard title="Produtos em Estoque" value="1,247" description="Disponíveis para venda" variant="gradient" isDark={isDark} />
                <StatsCard title="Taxa de Satisfação" value="97.8%" icon={Star} iconColor="warning" variant="telescope" isDark={isDark} />
            </div>
        </div>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>Cores dos Ícones</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                {ICON_COLORS.map(({ title, icon, color }) => (
                    <StatsCard key={color} title={title} value="100" icon={icon} iconColor={color} variant="telescope" isDark={isDark} />
                ))}
            </div>
        </div>
    </div>
)
