'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Palette, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface Props {
    isDark: boolean
    isMobile: boolean
    sidebarOpen: boolean
    mounted: boolean
    theme: string
    toggleTheme: () => void
}

const InfoRow: React.FC<{ isDark: boolean; label: string; value: string; active?: boolean }> = ({
    isDark, label, value, active,
}) => (
    <div className={cn(
        'flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200',
        isDark ? 'hover:bg-slate-700/40' : 'hover:bg-slate-200/50'
    )}>
        <span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>{label}</span>
        <span className={cn(
            'text-sm font-medium px-2.5 py-0.5 rounded-md',
            active !== undefined
                ? active
                    ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                    : isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-100 text-slate-500'
                : isDark ? 'text-slate-200' : 'text-slate-700'
        )}>
            {value}
        </span>
    </div>
)

export const ContextInfoSection: React.FC<Props> = ({
    isDark, isMobile, sidebarOpen, mounted, theme, toggleTheme,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className={cn(
            'group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300',
            'hover:-translate-y-0.5',
            isDark
                ? 'bg-slate-900/60 border-slate-700/40 hover:border-violet-500/30 shadow-lg shadow-black/15'
                : 'bg-slate-100/70 border-slate-300/60 hover:border-violet-400/50 shadow-lg shadow-slate-300/20'
        )}>
            {/* Accent glow on hover */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none bg-violet-500" />

            <div className="relative flex items-center gap-3 mb-4">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}
                >
                    <Palette className="w-[18px] h-[18px]" />
                </div>
                <h3 className={cn('text-base font-semibold', isDark ? 'text-slate-100' : 'text-slate-800')}>
                    Theme Context
                </h3>
            </div>
            <div className="relative space-y-1">
                <InfoRow isDark={isDark} label="Tema atual" value={theme} />
                <InfoRow isDark={isDark} label="Modo escuro" value={isDark ? 'Ativo' : 'Inativo'} active={isDark} />
                <InfoRow isDark={isDark} label="Mounted" value={mounted ? 'Sim' : 'Não'} active={mounted} />
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme} className="w-full mt-4" aria-label="Alternar tema">
                Alternar Tema
            </Button>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className={cn(
            'group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300',
            'hover:-translate-y-0.5',
            isDark
                ? 'bg-slate-900/60 border-slate-700/40 hover:border-sky-500/30 shadow-lg shadow-black/15'
                : 'bg-slate-100/70 border-slate-300/60 hover:border-sky-400/50 shadow-lg shadow-slate-300/20'
        )}>
            {/* Accent glow on hover */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none bg-sky-500" />

            <div className="relative flex items-center gap-3 mb-4">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: '#0ea5e915', color: '#0ea5e9' }}
                >
                    <Smartphone className="w-[18px] h-[18px]" />
                </div>
                <h3 className={cn('text-base font-semibold', isDark ? 'text-slate-100' : 'text-slate-800')}>
                    Layout Context
                </h3>
            </div>
            <div className="relative space-y-1">
                <InfoRow isDark={isDark} label="Mobile" value={isMobile ? 'Sim' : 'Não'} active={isMobile} />
                <InfoRow isDark={isDark} label="Sidebar aberta" value={sidebarOpen ? 'Sim' : 'Não'} active={sidebarOpen} />
                <InfoRow isDark={isDark} label="Mounted" value={mounted ? 'Sim' : 'Não'} active={mounted} />
            </div>
            <div className={cn(
                'mt-4 py-2.5 px-3 rounded-lg text-xs',
                isDark ? 'bg-sky-500/5 text-sky-300/80' : 'bg-sky-100/80 text-sky-700'
            )}>
                O layout se adapta automaticamente ao tamanho da tela.
            </div>
        </motion.div>
    </div>
)
