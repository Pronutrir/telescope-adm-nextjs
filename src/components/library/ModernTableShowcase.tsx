'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, MoreHorizontal, ArrowUpDown,
    ChevronLeft, ChevronRight,
    Check, Clock, AlertCircle, XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ───────── Types & Config ───────── */

type Status = 'active' | 'pending' | 'inactive' | 'error'

interface TableRow {
    id: string
    name: string
    email: string
    role: string
    status: Status
    progress: number
    lastActive: string
    avatar: string
    avatarColor: string
}

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ElementType; dark: string; light: string }> = {
    active:   { label: 'Ativo',    icon: Check,       dark: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20', light: 'bg-emerald-50 text-emerald-600 ring-emerald-200' },
    pending:  { label: 'Pendente', icon: Clock,       dark: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',      light: 'bg-amber-50 text-amber-600 ring-amber-200' },
    inactive: { label: 'Inativo',  icon: AlertCircle, dark: 'bg-slate-500/10 text-slate-400 ring-slate-500/20',      light: 'bg-slate-100 text-slate-500 ring-slate-200' },
    error:    { label: 'Erro',     icon: XCircle,     dark: 'bg-red-500/10 text-red-400 ring-red-500/20',            light: 'bg-red-50 text-red-600 ring-red-200' },
}

const ROWS: TableRow[] = [
    { id: '1', name: 'Ana Silva',      email: 'ana@telescope.dev',    role: 'Admin',  status: 'active',   progress: 92, lastActive: '2 min atrás',    avatar: 'AS', avatarColor: '#6366f1' },
    { id: '2', name: 'Bruno Costa',    email: 'bruno@telescope.dev',  role: 'Editor', status: 'active',   progress: 78, lastActive: '15 min atrás',   avatar: 'BC', avatarColor: '#06b6d4' },
    { id: '3', name: 'Carla Mendes',   email: 'carla@telescope.dev',  role: 'Viewer', status: 'pending',  progress: 45, lastActive: '1h atrás',       avatar: 'CM', avatarColor: '#f59e0b' },
    { id: '4', name: 'Diego Ferreira', email: 'diego@telescope.dev',  role: 'Editor', status: 'inactive', progress: 12, lastActive: '3 dias atrás',   avatar: 'DF', avatarColor: '#10b981' },
    { id: '5', name: 'Elena Rocha',    email: 'elena@telescope.dev',  role: 'Admin',  status: 'active',   progress: 88, lastActive: '30 min atrás',   avatar: 'ER', avatarColor: '#ec4899' },
    { id: '6', name: 'Felipe Santos',  email: 'felipe@telescope.dev', role: 'Viewer', status: 'error',    progress: 5,  lastActive: '1 semana atrás', avatar: 'FS', avatarColor: '#8b5cf6' },
]

const COLUMNS = ['Usuário', 'Função', 'Status', 'Progresso', 'Última Atividade', '']

/* ───────── Component ───────── */

interface Props {
    isDark: boolean
}

export const ModernTableShowcase: React.FC<Props> = ({ isDark }) => {
    const [search, setSearch] = useState('')
    const [activePage, setActivePage] = useState(1)

    const filtered = ROWS.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200',
                'focus-within:ring-2 focus-within:ring-offset-0',
                isDark
                    ? 'bg-slate-900/60 border-slate-700/50 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50'
                    : 'bg-slate-100/80 border-slate-200 focus-within:ring-indigo-500/20 focus-within:border-indigo-300'
            )}>
                <Search className={cn('w-4 h-4 shrink-0', isDark ? 'text-slate-500' : 'text-slate-400')} />
                <input
                    type="text"
                    placeholder="Buscar usuários..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={cn(
                        'flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400',
                        isDark ? 'text-slate-200' : 'text-slate-700'
                    )}
                />
                {search && (
                    <span className={cn(
                        'text-xs px-2 py-0.5 rounded-md',
                        isDark ? 'bg-slate-700/60 text-slate-400' : 'bg-slate-100 text-slate-500'
                    )}>
                        {filtered.length} resultado{filtered.length !== 1 && 's'}
                    </span>
                )}
            </div>

            {/* Table */}
            <div className={cn('rounded-xl border overflow-hidden', isDark ? 'border-slate-700/50' : 'border-slate-200')}>
                <div className="overflow-x-auto">
                    {/* Header */}
                    <div className={cn(
                        'grid grid-cols-[1fr_90px_110px_140px_130px_44px] min-w-[700px] gap-4 px-5 py-3',
                        'text-xs font-medium uppercase tracking-wider',
                        isDark
                            ? 'bg-slate-900/80 text-slate-400 border-b border-slate-700/50'
                            : 'bg-slate-100/90 text-slate-500 border-b border-slate-200'
                    )}>
                        {COLUMNS.map(col => (
                            <div key={col || 'actions'} className={cn('flex items-center gap-1.5', col && 'cursor-pointer')}>
                                {col}
                                {col && <ArrowUpDown className="w-3 h-3 opacity-40" />}
                            </div>
                        ))}
                    </div>

                    {/* Body */}
                    <AnimatePresence mode="popLayout">
                        {filtered.map((row, i) => {
                            const cfg = STATUS_CONFIG[row.status]
                            const StatusIcon = cfg.icon
                            return (
                                <motion.div
                                    key={row.id}
                                    layout
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                    className={cn(
                                        'grid grid-cols-[1fr_90px_110px_140px_130px_44px] min-w-[700px] gap-4 px-5 py-3.5 items-center',
                                        'transition-colors duration-150 cursor-pointer',
                                        isDark
                                            ? 'hover:bg-slate-800/60 border-b border-slate-800/50 last:border-0'
                                            : 'hover:bg-slate-50/80 border-b border-slate-100 last:border-0'
                                    )}
                                >
                                    {/* User */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                            style={{ backgroundColor: row.avatarColor }}
                                        >
                                            {row.avatar}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={cn('text-sm font-medium truncate', isDark ? 'text-slate-100' : 'text-slate-800')}>{row.name}</p>
                                            <p className={cn('text-xs truncate', isDark ? 'text-slate-500' : 'text-slate-400')}>{row.email}</p>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <span className={cn('text-xs font-medium', isDark ? 'text-slate-300' : 'text-slate-600')}>{row.role}</span>

                                    {/* Status */}
                                    <span className={cn(
                                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-inset w-fit',
                                        isDark ? cfg.dark : cfg.light
                                    )}>
                                        <StatusIcon className="w-3 h-3" />
                                        {cfg.label}
                                    </span>

                                    {/* Progress */}
                                    <div className="flex items-center gap-3">
                                        <div className={cn('flex-1 h-1.5 rounded-full overflow-hidden', isDark ? 'bg-slate-700/60' : 'bg-slate-200/80')}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${row.progress}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.08 }}
                                                className={cn(
                                                    'h-full rounded-full',
                                                    row.progress > 70 ? 'bg-emerald-500' : row.progress > 40 ? 'bg-amber-500' : 'bg-red-500'
                                                )}
                                            />
                                        </div>
                                        <span className={cn('text-xs font-mono tabular-nums w-8 text-right', isDark ? 'text-slate-400' : 'text-slate-500')}>
                                            {row.progress}%
                                        </span>
                                    </div>

                                    {/* Last Active */}
                                    <span className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{row.lastActive}</span>

                                    {/* Actions */}
                                    <button
                                        className={cn(
                                            'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                                            isDark ? 'hover:bg-slate-700/60 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
                                        )}
                                        aria-label={`Ações para ${row.name}`}
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-1">
                <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    Mostrando {filtered.length} de {ROWS.length} usuários
                </p>
                <div className="flex items-center gap-1">
                    <button
                        className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition-colors', isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    {[1, 2, 3].map(p => (
                        <button
                            key={p}
                            onClick={() => setActivePage(p)}
                            className={cn(
                                'w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-200',
                                activePage === p
                                    ? isDark ? 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30' : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200'
                                    : isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                            )}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition-colors', isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}
                        aria-label="Próxima página"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
