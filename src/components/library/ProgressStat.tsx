'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressStatProps {
    title: string
    value: string
    total: string
    progress: number
    icon: LucideIcon
    color?: 'success' | 'warning' | 'error' | 'info' | 'primary'
    variant?: 'default' | 'modern' | 'telescope'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    isDark?: boolean
    style?: React.CSSProperties
}

const COLOR_MAP = {
    success: {
        iconBg: { dark: 'bg-emerald-500/20', light: 'bg-emerald-100' },
        iconText: { dark: 'text-emerald-400', light: 'text-emerald-600' },
        bar: { dark: 'bg-emerald-500', light: 'bg-emerald-500' },
        barTrack: { dark: 'bg-emerald-500/10', light: 'bg-emerald-100' },
        pct: { dark: 'text-emerald-400', light: 'text-emerald-600' },
    },
    warning: {
        iconBg: { dark: 'bg-orange-500/20', light: 'bg-orange-100' },
        iconText: { dark: 'text-orange-400', light: 'text-orange-600' },
        bar: { dark: 'bg-orange-400', light: 'bg-orange-500' },
        barTrack: { dark: 'bg-orange-400/10', light: 'bg-orange-100' },
        pct: { dark: 'text-orange-400', light: 'text-orange-600' },
    },
    error: {
        iconBg: { dark: 'bg-red-500/20', light: 'bg-red-100' },
        iconText: { dark: 'text-red-400', light: 'text-red-600' },
        bar: { dark: 'bg-red-500', light: 'bg-red-500' },
        barTrack: { dark: 'bg-red-500/10', light: 'bg-red-100' },
        pct: { dark: 'text-red-400', light: 'text-red-600' },
    },
    info: {
        iconBg: { dark: 'bg-sky-500/20', light: 'bg-sky-100' },
        iconText: { dark: 'text-sky-400', light: 'text-sky-600' },
        bar: { dark: 'bg-sky-500', light: 'bg-sky-500' },
        barTrack: { dark: 'bg-sky-500/10', light: 'bg-sky-100' },
        pct: { dark: 'text-sky-400', light: 'text-sky-600' },
    },
    primary: {
        iconBg: { dark: 'bg-blue-500/20', light: 'bg-blue-100' },
        iconText: { dark: 'text-blue-400', light: 'text-blue-600' },
        bar: { dark: 'bg-blue-500', light: 'bg-blue-500' },
        barTrack: { dark: 'bg-blue-500/10', light: 'bg-blue-100' },
        pct: { dark: 'text-blue-400', light: 'text-blue-600' },
    },
} as const

const SIZE_MAP = {
    sm: { pad: 'p-4', icon: 'w-10 h-10', iconPx: 18, title: 'text-sm', sub: 'text-xs', gap: 'gap-3' },
    md: { pad: 'p-5', icon: 'w-12 h-12', iconPx: 22, title: 'text-base', sub: 'text-sm', gap: 'gap-4' },
    lg: { pad: 'p-6', icon: 'w-14 h-14', iconPx: 26, title: 'text-lg', sub: 'text-base', gap: 'gap-4' },
} as const

const ProgressStat: React.FC<ProgressStatProps> = ({
    title, value, total, progress, icon: Icon,
    color = 'primary', variant = 'default', size = 'md',
    className = '', isDark = false, style,
}) => {
    const t = isDark ? 'dark' : 'light'
    const c = COLOR_MAP[color]
    const s = SIZE_MAP[size]
    const pct = Math.min(Math.max(progress, 0), 100)

    return (
        <div
            className={cn(
                'rounded-2xl border transition-all duration-300',
                'hover:-translate-y-0.5',
                s.pad,
                variant === 'telescope' && isDark && 'bg-slate-950/90 border-blue-500/25 shadow-lg shadow-black/20 backdrop-blur-sm',
                variant === 'telescope' && !isDark && 'bg-slate-100/80 border-blue-300/40 shadow-md shadow-blue-500/5',
                variant === 'modern' && isDark && 'bg-slate-900/80 border-slate-700/40 shadow-md',
                variant === 'modern' && !isDark && 'bg-slate-100/70 border-slate-300/70 shadow-sm',
                variant === 'default' && isDark && 'bg-slate-800/70 border-slate-700/50 shadow-sm',
                variant === 'default' && !isDark && 'bg-slate-50/90 border-slate-300/80 shadow-sm',
                className,
            )}
            style={style}
        >
            <div className={cn('flex items-start', s.gap)}>
                {/* Icon */}
                <div className={cn(
                    'rounded-full flex items-center justify-center shrink-0',
                    s.icon, c.iconBg[t],
                )}>
                    <Icon size={s.iconPx} className={c.iconText[t]} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        'font-semibold truncate',
                        s.title,
                        isDark ? 'text-slate-100' : 'text-slate-800',
                    )}>
                        {title}
                    </div>
                    <div className={cn(
                        s.sub, 'mb-3',
                        isDark ? 'text-slate-400' : 'text-slate-500',
                    )}>
                        {value} of {total}
                    </div>

                    {/* Progress bar */}
                    <div
                        className={cn('w-full h-2 rounded-full overflow-hidden', c.barTrack[t])}
                        role="progressbar"
                        aria-label={`${title} Progress`}
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <motion.div
                            className={cn('h-full rounded-full', c.bar[t])}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                    </div>

                    <div className={cn('text-xs font-medium mt-1.5 text-right', c.pct[t])}>
                        {pct}%
                    </div>
                </div>
            </div>
        </div>
    )
}

export { ProgressStat }
export type { ProgressStatProps }
