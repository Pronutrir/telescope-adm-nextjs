'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, FileText, Settings, Users, BarChart3, Mail,
    Zap, Globe, Shield, Terminal, Hash, ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ───────── Types ───────── */

type CommandCategory = 'navigation' | 'actions' | 'settings'

interface CommandItem {
    id: string
    label: string
    description: string
    icon: React.ElementType
    category: CommandCategory
    shortcut?: string
    accentColor: string
}

/* ───────── Data ───────── */

const COMMANDS: CommandItem[] = [
    { id: '1', label: 'Ir para Dashboard',       description: 'Visão geral do sistema',           icon: BarChart3, category: 'navigation', shortcut: 'G D', accentColor: '#6366f1' },
    { id: '2', label: 'Gerenciar Usuários',       description: 'Lista de usuários e permissões',   icon: Users,     category: 'navigation', shortcut: 'G U', accentColor: '#06b6d4' },
    { id: '3', label: 'Relatórios',               description: 'Exportar e visualizar relatórios', icon: FileText,  category: 'navigation', shortcut: 'G R', accentColor: '#10b981' },
    { id: '4', label: 'Enviar Notificação',        description: 'Push para equipe ou paciente',     icon: Mail,      category: 'actions',    shortcut: 'N',   accentColor: '#f59e0b' },
    { id: '5', label: 'Executar Diagnóstico',      description: 'Verificar status dos serviços',    icon: Zap,       category: 'actions',    shortcut: 'D',   accentColor: '#ef4444' },
    { id: '6', label: 'Abrir API Explorer',        description: 'Documentação interativa da API',   icon: Globe,     category: 'actions',                     accentColor: '#8b5cf6' },
    { id: '7', label: 'Configurações Gerais',      description: 'Tema, idioma e preferências',      icon: Settings,  category: 'settings',   shortcut: ',',   accentColor: '#64748b' },
    { id: '8', label: 'Segurança & Acessos',       description: '2FA, tokens e auditoria',          icon: Shield,    category: 'settings',                    accentColor: '#ec4899' },
    { id: '9', label: 'Abrir Terminal',            description: 'Console do sistema',               icon: Terminal,  category: 'actions',    shortcut: '⌃ `', accentColor: '#a3e635' },
]

const CATEGORY_LABELS: Record<CommandCategory, string> = {
    navigation: 'Navegação',
    actions: 'Ações',
    settings: 'Configurações',
}

/* ───────── Kbd Component ───────── */

const Kbd: React.FC<{ children: string; isDark: boolean }> = ({ children, isDark }) => (
    <kbd className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold leading-none',
        'border shadow-sm',
        isDark
            ? 'bg-slate-700 border-slate-600 text-slate-300 shadow-black/20'
            : 'bg-white border-slate-200 text-slate-500 shadow-slate-200/50'
    )}>
        {children}
    </kbd>
)

/* ───────── Command Row ───────── */

interface CommandRowProps {
    item: CommandItem
    isDark: boolean
    isActive: boolean
    index: number
    onHover: () => void
}

const CommandRow: React.FC<CommandRowProps> = ({ item, isDark, isActive, index, onHover }) => {
    const Icon = item.icon
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            onMouseEnter={onHover}
            className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl cursor-pointer',
                'transition-all duration-150',
                isActive
                    ? isDark
                        ? 'bg-slate-700/70'
                        : 'bg-slate-100'
                    : 'hover:bg-slate-700/40'
            )}
        >
            {/* Active indicator */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        layoutId="command-active"
                        className={cn(
                            'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full',
                        )}
                        style={{ backgroundColor: item.accentColor }}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.15 }}
                    />
                )}
            </AnimatePresence>

            <div
                className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                    'transition-transform duration-200',
                    isActive && 'scale-110'
                )}
                style={{
                    backgroundColor: `${item.accentColor}15`,
                    color: item.accentColor,
                }}
            >
                <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
                <p className={cn(
                    'text-sm font-medium truncate',
                    isDark ? 'text-slate-200' : 'text-slate-700'
                )}>
                    {item.label}
                </p>
                <p className={cn(
                    'text-xs truncate',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                )}>
                    {item.description}
                </p>
            </div>

            {item.shortcut && (
                <div className="flex items-center gap-1 shrink-0">
                    {item.shortcut.split(' ').map((key, i) => (
                        <Kbd key={i} isDark={isDark}>{key}</Kbd>
                    ))}
                </div>
            )}

            <ArrowRight className={cn(
                'w-3.5 h-3.5 shrink-0 transition-all duration-200',
                isActive
                    ? 'opacity-60 translate-x-0'
                    : 'opacity-0 -translate-x-1',
                isDark ? 'text-slate-400' : 'text-slate-400'
            )} />
        </motion.div>
    )
}

/* ───────── Main Showcase ───────── */

interface Props {
    isDark: boolean
}

export const CommandPaletteShowcase: React.FC<Props> = ({ isDark }) => {
    const [query, setQuery] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)

    const filtered = useMemo(() => {
        if (!query.trim()) return COMMANDS
        const q = query.toLowerCase()
        return COMMANDS.filter(
            c => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        )
    }, [query])

    const grouped = useMemo(() => {
        const map = new Map<CommandCategory, CommandItem[]>()
        for (const cmd of filtered) {
            const arr = map.get(cmd.category) ?? []
            arr.push(cmd)
            map.set(cmd.category, arr)
        }
        return map
    }, [filtered])

    // flat index for keyboard
    const flatItems = useMemo(() => {
        const items: CommandItem[] = []
        for (const [, cmds] of grouped) items.push(...cmds)
        return items
    }, [grouped])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(i => (i + 1) % flatItems.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(i => (i - 1 + flatItems.length) % flatItems.length)
        }
    }

    let globalIndex = 0

    return (
        <div className="flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(
                    'w-full max-w-xl rounded-2xl overflow-hidden',
                    'border backdrop-blur-2xl',
                    'shadow-2xl',
                    isDark
                        ? 'bg-slate-900/95 border-slate-700/60 shadow-black/40'
                        : 'bg-white/95 border-slate-200 shadow-slate-400/20'
                )}
                onKeyDown={handleKeyDown}
            >
                {/* Search bar */}
                <div className={cn(
                    'flex items-center gap-3 px-4 py-3.5',
                    'border-b',
                    isDark ? 'border-slate-800' : 'border-slate-100'
                )}>
                    <Search className={cn('w-5 h-5 shrink-0', isDark ? 'text-slate-500' : 'text-slate-400')} />
                    <input
                        type="text"
                        placeholder="Buscar comandos, ações, páginas..."
                        value={query}
                        onChange={e => { setQuery(e.target.value); setActiveIndex(0) }}
                        className={cn(
                            'flex-1 bg-transparent border-none outline-none text-sm',
                            'placeholder:text-slate-500',
                            isDark ? 'text-white' : 'text-slate-900'
                        )}
                    />
                    <div className="flex items-center gap-1">
                        <Kbd isDark={isDark}>⌘</Kbd>
                        <Kbd isDark={isDark}>K</Kbd>
                    </div>
                </div>

                {/* Results */}
                <div className={cn(
                    'max-h-[360px] overflow-y-auto py-2',
                    'scrollbar-thin',
                    isDark ? 'scrollbar-thumb-slate-700' : 'scrollbar-thumb-slate-300'
                )}>
                    {flatItems.length === 0 ? (
                        <div className="py-12 text-center">
                            <Hash className={cn('w-10 h-10 mx-auto mb-3', isDark ? 'text-slate-700' : 'text-slate-300')} />
                            <p className={cn('text-sm font-medium', isDark ? 'text-slate-500' : 'text-slate-400')}>
                                Nenhum resultado encontrado
                            </p>
                            <p className={cn('text-xs mt-1', isDark ? 'text-slate-600' : 'text-slate-400')}>
                                Tente outro termo de busca
                            </p>
                        </div>
                    ) : (
                        Array.from(grouped.entries()).map(([category, items]) => (
                            <div key={category} className="mb-1">
                                <p className={cn(
                                    'px-5 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider',
                                    isDark ? 'text-slate-600' : 'text-slate-400'
                                )}>
                                    {CATEGORY_LABELS[category]}
                                </p>
                                {items.map((item) => {
                                    const idx = globalIndex++
                                    return (
                                        <CommandRow
                                            key={item.id}
                                            item={item}
                                            isDark={isDark}
                                            isActive={idx === activeIndex}
                                            index={idx}
                                            onHover={() => setActiveIndex(idx)}
                                        />
                                    )
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer bar */}
                <div className={cn(
                    'flex items-center justify-between px-4 py-2.5',
                    'border-t',
                    isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/60'
                )}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <Kbd isDark={isDark}>↑</Kbd>
                            <Kbd isDark={isDark}>↓</Kbd>
                            <span className={cn('text-[11px]', isDark ? 'text-slate-600' : 'text-slate-400')}>
                                navegar
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Kbd isDark={isDark}>↵</Kbd>
                            <span className={cn('text-[11px]', isDark ? 'text-slate-600' : 'text-slate-400')}>
                                selecionar
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Kbd isDark={isDark}>esc</Kbd>
                        <span className={cn('text-[11px]', isDark ? 'text-slate-600' : 'text-slate-400')}>
                            fechar
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
