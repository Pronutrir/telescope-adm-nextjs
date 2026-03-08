'use client'

import React from 'react'
import { Users, Target, Activity, BarChart3, CheckCircle, Clock, AlertTriangle, Download, User, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressStat } from './ProgressStat'
import { SortableProgressStats } from './SortableProgressStats'
import type { SortableItem } from './useBibliotecaComponentes'

interface Props {
    isDark: boolean
    interactiveItems: SortableItem[]
    setInteractiveItems: (items: SortableItem[]) => void
}

const COLORS_DEMO = [
    { title: 'Primary', icon: BarChart3, color: 'primary' as const, progress: 86, value: '856', total: '1.000' },
    { title: 'Success', icon: CheckCircle, color: 'success' as const, progress: 86, value: '432', total: '500' },
    { title: 'Warning', icon: Clock, color: 'warning' as const, progress: 62, value: '123', total: '200' },
    { title: 'Error', icon: AlertTriangle, color: 'error' as const, progress: 24, value: '12', total: '50' },
    { title: 'Info', icon: TrendingUp, color: 'info' as const, progress: 85, value: '678', total: '800' },
]

export const ProgressStatSection: React.FC<Props> = ({ isDark, interactiveItems, setInteractiveItems }) => (
    <div className="mb-12">
        <h2 className={cn('text-3xl font-semibold mb-8', isDark ? 'text-white' : 'text-slate-800')}>
            Progress Statistics Component
        </h2>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>Variantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProgressStat title="Usuários Ativos" value="1.234" total="2.000" progress={62} icon={Users} color="primary" variant="default" isDark={isDark} />
                <ProgressStat title="Vendas Concluídas" value="847" total="1.200" progress={71} icon={Target} color="success" variant="modern" isDark={isDark} />
                <ProgressStat title="Projetos Ativos" value="23" total="30" progress={77} icon={Activity} color="info" variant="telescope" isDark={isDark} />
            </div>
        </div>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>Cores</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {COLORS_DEMO.map(({ title, icon, color, progress, value, total }) => (
                    <ProgressStat key={color} title={title} value={value} total={total} progress={progress} icon={icon} color={color} variant="modern" size="sm" isDark={isDark} />
                ))}
            </div>
        </div>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>Tamanhos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProgressStat title="Downloads" value="3.421" total="5.000" progress={68} icon={Download} color="success" variant="telescope" size="sm" isDark={isDark} />
                <ProgressStat title="Cadastros" value="2.156" total="3.000" progress={72} icon={User} color="primary" variant="telescope" size="md" isDark={isDark} />
                <ProgressStat title="Receita Mensal" value="R$ 47.8k" total="R$ 60k" progress={80} icon={TrendingUp} color="success" variant="telescope" size="lg" isDark={isDark} />
            </div>
        </div>

        <div className="mb-8">
            <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
                Demonstração Interativa com Drag &amp; Drop
            </h3>
            <div className={cn('p-4 rounded-lg border', isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50')}>
                <SortableProgressStats items={interactiveItems} onSortEnd={setInteractiveItems} isDark={isDark} gridCols={4} animation={250} />
            </div>
            <div className={cn('mt-4 p-4 rounded-lg border', isDark ? 'border-blue-500/30 bg-blue-900/20' : 'border-blue-200 bg-blue-50')}>
                <p className={cn('text-sm font-medium mb-2', isDark ? 'text-blue-200' : 'text-blue-800')}>🎯 Funcionalidades Sortable</p>
                <ul className={cn('space-y-1 text-sm', isDark ? 'text-blue-200' : 'text-blue-700')}>
                    {['Drag & Drop: Arraste qualquer card para reorganizar a ordem', 'Animações fluidas: Transições suaves durante o movimento', 'Estados visuais: Feedback visual durante o arraste', 'Grid responsivo: Reorganização automática em diferentes resoluções'].map(item => (
                        <li key={item}>• {item}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
)
