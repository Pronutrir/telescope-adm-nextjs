'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp, TrendingDown, Users, DollarSign, Activity, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ───────── Sparkline SVG ───────── */

const SparkLine: React.FC<{ data: number[]; color: string; id: string }> = ({ data, color, id }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const w = 80
    const h = 32
    const pts = data
        .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
        .join(' ')

    return (
        <svg width={w} height={h} className="overflow-visible" aria-hidden="true">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pts}
            />
            <polygon fill={`url(#${id})`} points={`0,${h} ${pts} ${w},${h}`} />
        </svg>
    )
}

/* ───────── Metric Card ───────── */

interface MetricCardProps {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative'
    icon: React.ElementType
    sparkData: number[]
    accentColor: string
    isDark: boolean
    delay?: number
}

const MetricCard: React.FC<MetricCardProps> = ({
    title, value, change, changeType, icon: Icon,
    sparkData, accentColor, isDark, delay = 0,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
            'group relative overflow-hidden rounded-2xl p-6',
            'border backdrop-blur-xl transition-all duration-300',
            'hover:scale-[1.02] hover:-translate-y-1 cursor-pointer',
            isDark
                ? 'bg-slate-900/80 border-slate-700/50 hover:border-slate-600/80 shadow-lg shadow-black/20 hover:shadow-xl'
                : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-lg shadow-slate-300/30 hover:shadow-xl'
        )}
    >
        {/* Corner glow on hover */}
        <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{ backgroundColor: accentColor }}
        />

        <div className="relative flex items-start justify-between mb-4">
            <div>
                <p className={cn('text-sm font-medium mb-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    {title}
                </p>
                <p className={cn('text-3xl font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
                    {value}
                </p>
            </div>
            <div
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
                <Icon className="w-5 h-5" />
            </div>
        </div>

        <div className="relative flex items-end justify-between">
            <div className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold',
                changeType === 'positive'
                    ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                    : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
            )}>
                {changeType === 'positive'
                    ? <TrendingUp className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />}
                {change}
            </div>
            <SparkLine data={sparkData} color={accentColor} id={`spark-${accentColor.replace('#', '')}`} />
        </div>
    </motion.div>
)

/* ───────── Data + Export ───────── */

const METRICS: Omit<MetricCardProps, 'isDark' | 'delay'>[] = [
    { title: 'Receita Total', value: 'R$ 284.5k', change: '+23.5%', changeType: 'positive', icon: DollarSign, sparkData: [30, 40, 35, 50, 49, 60, 70, 91, 85, 97], accentColor: '#6366f1' },
    { title: 'Usuários Ativos', value: '12,847', change: '+18.2%', changeType: 'positive', icon: Users, sparkData: [20, 25, 30, 35, 28, 40, 45, 55, 50, 60], accentColor: '#06b6d4' },
    { title: 'Engajamento', value: '94.2%', change: '-2.4%', changeType: 'negative', icon: Activity, sparkData: [80, 85, 78, 90, 88, 92, 85, 82, 78, 75], accentColor: '#f59e0b' },
    { title: 'Visualizações', value: '1.2M', change: '+45.1%', changeType: 'positive', icon: Eye, sparkData: [10, 15, 25, 20, 35, 45, 40, 55, 65, 80], accentColor: '#10b981' },
]

interface Props {
    isDark: boolean
}

export const PremiumMetricsShowcase: React.FC<Props> = ({ isDark }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {METRICS.map((metric, i) => (
            <MetricCard key={metric.title} {...metric} isDark={isDark} delay={i * 0.1} />
        ))}
    </div>
)
