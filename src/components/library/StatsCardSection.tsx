'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Database, Shield, Monitor, Settings, Globe, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatsCard } from '@/components/ui/StatsCard'
import type { STATS_EXAMPLES } from './useBibliotecaComponentes'

interface Props {
    isDark: boolean
    statsExamples: typeof STATS_EXAMPLES
}

const VARIANTS = [
    { key: 'default', label: 'Default' },
    { key: 'gradient', label: 'Gradient' },
    { key: 'telescope', label: 'Telescope Premium' },
] as const

const ICON_COLORS = [
    { title: 'Primary', icon: Database, color: 'primary' as const },
    { title: 'Success', icon: Shield, color: 'success' as const },
    { title: 'Warning', icon: Monitor, color: 'warning' as const },
    { title: 'Error', icon: Settings, color: 'error' as const },
    { title: 'Info', icon: Globe, color: 'info' as const },
]

const SubHeading: React.FC<{ isDark: boolean; children: React.ReactNode }> = ({ isDark, children }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className={cn('h-px flex-1 max-w-[40px]', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
        <h3 className={cn(
            'text-[11px] font-semibold uppercase tracking-wider',
            isDark ? 'text-slate-400' : 'text-slate-500'
        )}>
            {children}
        </h3>
        <div className={cn('h-px flex-1', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
    </div>
)

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

export const StatsCardSection: React.FC<Props> = ({ isDark, statsExamples }) => (
    <div className="space-y-10">
        {VARIANTS.map(({ key, label }) => (
            <div key={key}>
                <SubHeading isDark={isDark}>{label}</SubHeading>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" variants={stagger} initial="hidden" animate="show">
                    {statsExamples.map((stat, i) => (
                        <motion.div key={`${key}-${i}`} variants={fadeUp}>
                            <StatsCard {...stat} variant={key} isDark={isDark} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        ))}

        <div>
            <SubHeading isDark={isDark}>Simplificado</SubHeading>
            <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5" variants={stagger} initial="hidden" animate="show">
                <motion.div variants={fadeUp}><StatsCard title="Vendas do Mês" value="R$ 45.230" variant="default" isDark={isDark} /></motion.div>
                <motion.div variants={fadeUp}><StatsCard title="Produtos em Estoque" value="1,247" description="Disponíveis para venda" variant="gradient" isDark={isDark} /></motion.div>
                <motion.div variants={fadeUp}><StatsCard title="Taxa de Satisfação" value="97.8%" icon={Star} iconColor="warning" variant="telescope" isDark={isDark} /></motion.div>
            </motion.div>
        </div>

        <div>
            <SubHeading isDark={isDark}>Paleta de Ícones</SubHeading>
            <motion.div className="grid grid-cols-2 sm:grid-cols-5 gap-5" variants={stagger} initial="hidden" animate="show">
                {ICON_COLORS.map(({ title, icon, color }) => (
                    <motion.div key={color} variants={fadeUp}>
                        <StatsCard title={title} value="100" icon={icon} iconColor={color} variant="telescope" isDark={isDark} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </div>
)
