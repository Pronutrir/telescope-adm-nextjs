'use client'

import React from 'react'
import { TrendingUp, Users, Download, Database, Zap, Shield, Activity, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SortableProgressStats } from './SortableProgressStats'
import type { SortableItem } from './useBibliotecaComponentes'

interface Props {
    isDark: boolean
    sortableItems: SortableItem[]
    setSortableItems: (items: SortableItem[]) => void
}

const VERTICAL_ITEMS: SortableItem[] = [
    { id: 'revenue-v', title: 'Receita Mensal', value: 'R$ 47.8k', total: 'R$ 60k', progress: 80, icon: TrendingUp, color: 'success', variant: 'telescope', size: 'sm' },
    { id: 'users-v', title: 'Novos Usuários', value: '234', total: '300', progress: 78, icon: Users, color: 'primary', variant: 'telescope', size: 'sm' },
    { id: 'downloads-v', title: 'Downloads', value: '1.456', total: '2.000', progress: 73, icon: Download, color: 'info', variant: 'telescope', size: 'sm' },
    { id: 'storage-v', title: 'Armazenamento', value: '34 GB', total: '50 GB', progress: 68, icon: Database, color: 'warning', variant: 'telescope', size: 'sm' },
]

const FAST_ITEMS: SortableItem[] = [
    { id: 'fast-1', title: 'Velocidade', value: '95', total: '100', progress: 95, icon: Zap, color: 'success', variant: 'modern', size: 'sm' },
    { id: 'fast-2', title: 'Segurança', value: '88', total: '100', progress: 88, icon: Shield, color: 'primary', variant: 'modern', size: 'sm' },
    { id: 'fast-3', title: 'Performance', value: '92', total: '100', progress: 92, icon: Activity, color: 'info', variant: 'modern', size: 'sm' },
    { id: 'fast-4', title: 'Qualidade', value: '87', total: '100', progress: 87, icon: Star, color: 'warning', variant: 'modern', size: 'sm' },
]

const SubHeading: React.FC<{ isDark: boolean; children: React.ReactNode }> = ({ isDark, children }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className={cn('h-px flex-1 max-w-[40px]', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
        <h3 className={cn('text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
            {children}
        </h3>
        <div className={cn('h-px flex-1', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
    </div>
)

export const SortableProgressSection: React.FC<Props> = ({ isDark, sortableItems, setSortableItems }) => (
    <div className="space-y-10">
        <div>
            <SubHeading isDark={isDark}>Dashboard Reordenável</SubHeading>
            <div className={cn(
                'p-5 rounded-2xl border backdrop-blur-sm',
                isDark ? 'border-slate-700/40 bg-slate-900/40' : 'border-slate-300/50 bg-slate-100/50'
            )}>
                <SortableProgressStats items={sortableItems} onSortEnd={setSortableItems} isDark={isDark} gridCols={4} animation={200} />
            </div>
        </div>

        <div>
            <SubHeading isDark={isDark}>Layouts Alternativos</SubHeading>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                    { label: '2 Colunas — Animação Suave (300ms)', items: VERTICAL_ITEMS, animation: 300 },
                    { label: '2 Colunas — Animação Rápida (100ms)', items: FAST_ITEMS, animation: 100 },
                ].map(({ label, items, animation }) => (
                    <div key={label}>
                        <p className={cn('text-xs font-medium mb-3', isDark ? 'text-slate-500' : 'text-slate-400')}>
                            {label}
                        </p>
                        <div className={cn(
                            'p-4 rounded-2xl border backdrop-blur-sm',
                            isDark ? 'border-slate-700/40 bg-slate-900/40' : 'border-slate-300/50 bg-slate-100/50'
                        )}>
                            <SortableProgressStats items={items} isDark={isDark} gridCols={2} animation={animation} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
