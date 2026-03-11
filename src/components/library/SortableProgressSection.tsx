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

const LAYOUT_DEMOS = [
    { label: 'Layout Vertical (2 Colunas)', items: VERTICAL_ITEMS, animation: 300 },
    { label: 'Animação Rápida (100ms)', items: FAST_ITEMS, animation: 100 },
]

export const SortableProgressSection: React.FC<Props> = ({ isDark, sortableItems, setSortableItems }) => (
    <div className="mb-12">
        <h2 className={cn('text-3xl font-semibold mb-8', isDark ? 'text-white' : 'text-slate-800')}>
            Sortable Progress Statistics
        </h2>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
                Drag &amp; Drop Dashboard
            </h3>
            <div className={cn('p-6 rounded-lg border mb-4', isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50')}>
                <SortableProgressStats
                    items={sortableItems}
                    onSortEnd={setSortableItems}
                    isDark={isDark}
                    gridCols={4}
                    animation={200}
                />
            </div>
        </div>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
                Diferentes Layouts
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {LAYOUT_DEMOS.map(({ label, items, animation }) => (
                    <div key={label}>
                        <h4 className={cn('text-lg font-medium mb-3', isDark ? 'text-gray-200' : 'text-gray-700')}>
                            {label}
                        </h4>
                        <div className={cn('p-4 rounded-lg border', isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50')}>
                            <SortableProgressStats items={items} isDark={isDark} gridCols={2} animation={animation} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
