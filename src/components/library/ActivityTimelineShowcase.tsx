'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Rocket, GitMerge, Eye, AlertTriangle, MessageSquare,
    GitPullRequest, CheckCircle, Bug,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ───────── Types & Config ───────── */

type EventType = 'deploy' | 'merge' | 'review' | 'pr' | 'bugfix' | 'alert' | 'release' | 'comment'

interface TimelineEvent {
    id: string
    type: EventType
    title: string
    description: string
    time: string
    user: string
    userColor: string
}

const EVENT_CONFIG: Record<EventType, { icon: React.ElementType; color: string; bgDark: string; bgLight: string }> = {
    deploy:  { icon: Rocket,         color: '#10b981', bgDark: 'bg-emerald-500/10', bgLight: 'bg-emerald-50' },
    merge:   { icon: GitMerge,       color: '#8b5cf6', bgDark: 'bg-violet-500/10',  bgLight: 'bg-violet-50' },
    review:  { icon: Eye,            color: '#06b6d4', bgDark: 'bg-cyan-500/10',    bgLight: 'bg-cyan-50' },
    pr:      { icon: GitPullRequest, color: '#6366f1', bgDark: 'bg-indigo-500/10',  bgLight: 'bg-indigo-50' },
    bugfix:  { icon: Bug,            color: '#ef4444', bgDark: 'bg-red-500/10',     bgLight: 'bg-red-50' },
    alert:   { icon: AlertTriangle,  color: '#f59e0b', bgDark: 'bg-amber-500/10',   bgLight: 'bg-amber-50' },
    release: { icon: CheckCircle,    color: '#ec4899', bgDark: 'bg-pink-500/10',    bgLight: 'bg-pink-50' },
    comment: { icon: MessageSquare,  color: '#64748b', bgDark: 'bg-slate-500/10',   bgLight: 'bg-slate-100' },
}

const EVENTS: TimelineEvent[] = [
    { id: '1', type: 'deploy',  title: 'Deploy em Produção',       description: 'telescope-adm v2.4.0 via GitHub Actions',  time: '2 min atrás',  user: 'Ana S.',    userColor: '#6366f1' },
    { id: '2', type: 'merge',   title: 'Merge na branch main',     description: 'PR #142 — Refatoração módulo NPS',          time: '18 min atrás', user: 'Bruno C.',   userColor: '#06b6d4' },
    { id: '3', type: 'review',  title: 'Code Review aprovado',     description: 'Revisão do componente ProfilePage',          time: '45 min atrás', user: 'Carla M.',   userColor: '#f59e0b' },
    { id: '4', type: 'pr',      title: 'Pull Request aberto',      description: 'PR #143 — Feature: Stopwatch com SignalR',  time: '1h atrás',     user: 'Diego F.',   userColor: '#10b981' },
    { id: '5', type: 'bugfix',  title: 'Bug corrigido',            description: 'Fix: hydration mismatch no ThemeContext',    time: '2h atrás',     user: 'Elena R.',   userColor: '#ec4899' },
    { id: '6', type: 'alert',   title: 'Alerta de performance',    description: 'Latência da API acima de 500ms por 3 min',  time: '3h atrás',     user: 'Sistema',    userColor: '#64748b' },
    { id: '7', type: 'release', title: 'Release v2.3.9 publicada', description: 'Correções de segurança e melhorias de UX',  time: '5h atrás',     user: 'Ana S.',    userColor: '#6366f1' },
    { id: '8', type: 'comment', title: 'Comentário na issue #78',  description: '"Reproduzi o bug. Está relacionado ao Redis."', time: '6h atrás', user: 'Felipe S.', userColor: '#8b5cf6' },
]

/* ───────── Component ───────── */

interface Props {
    isDark: boolean
}

export const ActivityTimelineShowcase: React.FC<Props> = ({ isDark }) => (
    <div className="relative">
        {/* Vertical gradient line */}
        <div className={cn(
            'absolute left-[19px] top-0 bottom-0 w-px',
            isDark
                ? 'bg-gradient-to-b from-slate-700 via-slate-700/60 to-transparent'
                : 'bg-gradient-to-b from-slate-200 via-slate-200/60 to-transparent'
        )} />

        <div className="space-y-1">
            {EVENTS.map((event, i) => {
                const cfg = EVENT_CONFIG[event.type]
                const Icon = cfg.icon
                return (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={cn(
                            'group relative flex items-start gap-4 py-3 px-3 rounded-xl -ml-1',
                            'transition-colors duration-200 cursor-pointer',
                            isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                        )}
                    >
                        {/* Icon badge */}
                        <div className={cn(
                            'relative z-10 flex items-center justify-center w-[38px] h-[38px] rounded-xl shrink-0',
                            'transition-transform duration-300 group-hover:scale-110',
                            isDark ? cfg.bgDark : cfg.bgLight
                        )}>
                            <Icon className="w-[18px] h-[18px]" style={{ color: cfg.color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className={cn('text-sm font-semibold truncate', isDark ? 'text-slate-100' : 'text-slate-800')}>
                                    {event.title}
                                </p>
                                <span className={cn('text-xs shrink-0', isDark ? 'text-slate-600' : 'text-slate-400')}>
                                    {event.time}
                                </span>
                            </div>
                            <p className={cn('text-sm truncate', isDark ? 'text-slate-400' : 'text-slate-500')}>
                                {event.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                                    style={{ backgroundColor: event.userColor }}
                                >
                                    {event.user.charAt(0)}
                                </div>
                                <span className={cn('text-xs font-medium', isDark ? 'text-slate-500' : 'text-slate-400')}>
                                    {event.user}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    </div>
)
