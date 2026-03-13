'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionBlockProps {
    id: string
    number: string
    title: string
    description: string
    icon: LucideIcon
    iconColor?: string
    isDark: boolean
    children: React.ReactNode
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
    id,
    number,
    title,
    description,
    icon: Icon,
    iconColor = 'text-cyan-400',
    isDark,
    children,
}) => (
    <motion.section
        id={id}
        className="scroll-mt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
            <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold',
                'ring-1 ring-inset transition-transform duration-300 hover:scale-110',
                isDark
                    ? 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20'
                    : 'bg-cyan-100 text-cyan-700 ring-cyan-300/60'
            )}>
                {number}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-5 h-5', iconColor)} />
                    <h2 className={cn(
                        'text-2xl font-semibold tracking-tight',
                        isDark ? 'text-slate-50' : 'text-slate-800'
                    )}>
                        {title}
                    </h2>
                </div>
                <p className={cn(
                    'text-sm mt-0.5',
                    isDark ? 'text-slate-400' : 'text-slate-500'
                )}>
                    {description}
                </p>
            </div>
        </div>

        {/* Section Content — Premium Glass Card */}
        <div className={cn(
            'rounded-2xl border p-6 lg:p-8',
            'backdrop-blur-2xl',
            'transition-all duration-300',
            isDark
                ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl shadow-black/25'
                : 'bg-slate-50/80 border-slate-200 shadow-2xl shadow-slate-400/10'
        )}>
            {children}
        </div>
    </motion.section>
)
