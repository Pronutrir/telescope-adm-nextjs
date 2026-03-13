'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    DollarSign, TrendingUp, Zap, Users,
    CheckCircle, Circle, Target, HardDrive,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ───────── Shared card wrapper ───────── */

const BentoCard: React.FC<{
    isDark: boolean
    className?: string
    delay?: number
    children: React.ReactNode
}> = ({ isDark, className, delay = 0, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
            'group relative overflow-hidden rounded-2xl border p-5',
            'backdrop-blur-2xl transition-all duration-300',
            'hover:scale-[1.01] hover:-translate-y-0.5',
            isDark
                ? 'bg-slate-900/70 border-slate-700/50 hover:border-slate-600/70 shadow-lg shadow-black/15'
                : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-lg shadow-slate-300/30',
            className
        )}
    >
        {children}
    </motion.div>
)

/* ───────── 1. Revenue Card (wide) ───────── */

const BARS = [
    { month: 'Jul', value: 45 },
    { month: 'Ago', value: 65 },
    { month: 'Set', value: 55 },
    { month: 'Out', value: 80 },
    { month: 'Nov', value: 72 },
    { month: 'Dez', value: 95 },
]

const RevenueCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <BentoCard isDark={isDark} className="md:col-span-2" delay={0}>
        <div className="flex items-start justify-between mb-6">
            <div>
                <p className={cn('text-sm font-medium mb-1', isDark ? 'text-slate-400' : 'text-slate-500')}>Receita Mensal</p>
                <p className={cn('text-3xl font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>R$ 847.2k</p>
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-500">
                    <TrendingUp className="w-3 h-3" /> +12.5% vs mês anterior
                </div>
            </div>
            <div
                className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#6366f115', color: '#6366f1' }}
            >
                <DollarSign className="w-5 h-5" />
            </div>
        </div>
        <div className="flex items-end gap-2 h-24">
            {BARS.map((bar, i) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.value}%` }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                        className={cn(
                            'w-full rounded-md bg-indigo-500',
                            bar.month === 'Dez' ? 'opacity-100' : 'opacity-40'
                        )}
                    />
                    <span className={cn('text-[10px] font-medium', isDark ? 'text-slate-500' : 'text-slate-400')}>
                        {bar.month}
                    </span>
                </div>
            ))}
        </div>
    </BentoCard>
)

/* ───────── 2. Performance Ring ───────── */

const ScoreCard: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const score = 94
    const radius = 40
    const circumference = 2 * Math.PI * radius

    return (
        <BentoCard isDark={isDark} delay={0.1}>
            <p className={cn('text-sm font-medium mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>Performance</p>
            <div className="relative flex items-center justify-center py-2">
                <svg width="100" height="100" className="-rotate-90">
                    <circle
                        cx="50" cy="50" r={radius} fill="none" strokeWidth="8"
                        className={isDark ? 'stroke-slate-800' : 'stroke-slate-100'}
                    />
                    <motion.circle
                        cx="50" cy="50" r={radius} fill="none"
                        strokeWidth="8" strokeLinecap="round"
                        stroke="url(#bentoScoreGradient)"
                        initial={{ strokeDasharray: `0 ${circumference}` }}
                        animate={{ strokeDasharray: `${(score / 100) * circumference} ${circumference}` }}
                        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                    />
                    <defs>
                        <linearGradient id="bentoScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>{score}</span>
                    <span className={cn('text-[10px] font-medium', isDark ? 'text-slate-500' : 'text-slate-400')}>de 100</span>
                </div>
            </div>
        </BentoCard>
    )
}

/* ───────── 3. Team Card ───────── */

const TEAM = [
    { initials: 'AS', color: '#6366f1' },
    { initials: 'BC', color: '#06b6d4' },
    { initials: 'CM', color: '#f59e0b' },
    { initials: 'DF', color: '#10b981' },
    { initials: 'ER', color: '#ec4899' },
]

const TeamCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <BentoCard isDark={isDark} delay={0.15}>
        <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4" style={{ color: '#06b6d4' }} />
            <p className={cn('text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Equipe Ativa</p>
        </div>
        <div className="flex items-center mb-3">
            {TEAM.map((m, i) => (
                <div
                    key={m.initials}
                    className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white ring-2',
                        isDark ? 'ring-slate-900' : 'ring-white'
                    )}
                    style={{ backgroundColor: m.color, marginLeft: i ? -8 : 0, zIndex: TEAM.length - i }}
                >
                    {m.initials}
                </div>
            ))}
        </div>
        <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>12 membros online</span>
        </div>
    </BentoCard>
)

/* ───────── 4. Tasks Card ───────── */

const TASKS = [
    { text: 'Revisar PR #142', done: true },
    { text: 'Atualizar docs API', done: true },
    { text: 'Deploy v2.4.0', done: false },
    { text: 'Code review auth', done: false },
]

const TasksCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <BentoCard isDark={isDark} delay={0.2}>
        <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <p className={cn('text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Tarefas</p>
        </div>
        <div className="space-y-2.5">
            {TASKS.map(t => (
                <div key={t.text} className="flex items-center gap-2.5">
                    {t.done
                        ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        : <Circle className={cn('w-4 h-4 shrink-0', isDark ? 'text-slate-600' : 'text-slate-300')} />}
                    <span className={cn(
                        'text-sm',
                        t.done
                            ? isDark ? 'text-slate-500 line-through' : 'text-slate-400 line-through'
                            : isDark ? 'text-slate-200' : 'text-slate-700'
                    )}>
                        {t.text}
                    </span>
                </div>
            ))}
        </div>
    </BentoCard>
)

/* ───────── 5. Activity Card (tall) ───────── */

const ACTIVITY = [
    { user: 'Ana', action: 'fez deploy v2.4', time: '2 min', color: '#10b981' },
    { user: 'Bruno', action: 'merge na main', time: '18 min', color: '#6366f1' },
    { user: 'Carla', action: 'abriu PR #143', time: '1h', color: '#06b6d4' },
    { user: 'Diego', action: 'comentou issue', time: '3h', color: '#f59e0b' },
    { user: 'Elena', action: 'fechou bug #89', time: '5h', color: '#ec4899' },
]

const ActivityCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <BentoCard isDark={isDark} className="md:row-span-2" delay={0.25}>
        <p className={cn('text-sm font-medium mb-4', isDark ? 'text-slate-400' : 'text-slate-500')}>Atividade Recente</p>
        <div className="relative space-y-4">
            <div className={cn('absolute left-[7px] top-3 bottom-3 w-px', isDark ? 'bg-slate-700/60' : 'bg-slate-200')} />
            {ACTIVITY.map((a, i) => (
                <motion.div
                    key={a.time}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-3 relative"
                >
                    <div
                        className="w-[15px] h-[15px] rounded-full border-2 shrink-0 z-10"
                        style={{
                            borderColor: a.color,
                            backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                        }}
                    />
                    <div className="min-w-0 -mt-0.5">
                        <p className={cn('text-sm truncate', isDark ? 'text-slate-200' : 'text-slate-700')}>
                            <span className="font-semibold">{a.user}</span> {a.action}
                        </p>
                        <p className={cn('text-xs mt-0.5', isDark ? 'text-slate-500' : 'text-slate-400')}>{a.time} atrás</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </BentoCard>
)

/* ───────── 6. Storage Card ───────── */

const StorageCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <BentoCard isDark={isDark} delay={0.3}>
        <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-4 h-4" style={{ color: '#f43f5e' }} />
            <p className={cn('text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Armazenamento</p>
        </div>
        <div className={cn('h-2.5 rounded-full overflow-hidden mb-3', isDark ? 'bg-slate-800' : 'bg-slate-100')}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '67%' }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
            />
        </div>
        <div className="flex items-center justify-between">
            <span className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>67.3 GB de 100 GB</span>
            <span className={cn('text-xs font-medium', isDark ? 'text-indigo-400' : 'text-indigo-600')}>67%</span>
        </div>
    </BentoCard>
)

/* ───────── 7. Goals Card ───────── */

const GOALS = [
    { label: 'Vendas', progress: 82, color: '#6366f1' },
    { label: 'Retenção', progress: 94, color: '#10b981' },
    { label: 'NPS', progress: 71, color: '#f59e0b' },
]

const GoalsCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <BentoCard isDark={isDark} delay={0.35}>
        <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4" style={{ color: '#84cc16' }} />
            <p className={cn('text-sm font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Metas</p>
        </div>
        <div className="space-y-3">
            {GOALS.map(g => (
                <div key={g.label}>
                    <div className="flex items-center justify-between mb-1">
                        <span className={cn('text-xs font-medium', isDark ? 'text-slate-300' : 'text-slate-600')}>{g.label}</span>
                        <span className={cn('text-xs font-mono tabular-nums', isDark ? 'text-slate-500' : 'text-slate-400')}>{g.progress}%</span>
                    </div>
                    <div className={cn('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-slate-800' : 'bg-slate-100')}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${g.progress}%` }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: g.color }}
                        />
                    </div>
                </div>
            ))}
        </div>
    </BentoCard>
)

/* ───────── Main Export ───────── */

interface Props {
    isDark: boolean
}

export const BentoGridShowcase: React.FC<Props> = ({ isDark }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RevenueCard isDark={isDark} />
        <ScoreCard isDark={isDark} />
        <TeamCard isDark={isDark} />
        <TasksCard isDark={isDark} />
        <ActivityCard isDark={isDark} />
        <StorageCard isDark={isDark} />
        <GoalsCard isDark={isDark} />
    </div>
)
