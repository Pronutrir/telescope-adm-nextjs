'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Activity, BarChart3, CheckCircle, Clock, AlertTriangle, Download, User, TrendingUp, GripVertical } from 'lucide-react'
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

const SubHeading: React.FC<{ isDark: boolean; children: React.ReactNode }> = ({ isDark, children }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className={cn('h-px flex-1 max-w-[40px]', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
        <h3 className={cn('text-[11px] font-semibold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
            {children}
        </h3>
        <div className={cn('h-px flex-1', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
    </div>
)

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

export const ProgressStatSection: React.FC<Props> = ({ isDark, interactiveItems, setInteractiveItems }) => (
    <div className="space-y-10">
        <div>
            <SubHeading isDark={isDark}>Variantes</SubHeading>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5" variants={stagger} initial="hidden" animate="show">
                <motion.div variants={fadeUp}><ProgressStat title="Usuários Ativos" value="1.234" total="2.000" progress={62} icon={Users} color="primary" variant="default" isDark={isDark} /></motion.div>
                <motion.div variants={fadeUp}><ProgressStat title="Vendas Concluídas" value="847" total="1.200" progress={71} icon={Target} color="success" variant="modern" isDark={isDark} /></motion.div>
                <motion.div variants={fadeUp}><ProgressStat title="Projetos Ativos" value="23" total="30" progress={77} icon={Activity} color="info" variant="telescope" isDark={isDark} /></motion.div>
            </motion.div>
        </div>

        <div>
            <SubHeading isDark={isDark}>Cores</SubHeading>
            <motion.div className="grid grid-cols-1 md:grid-cols-5 gap-4" variants={stagger} initial="hidden" animate="show">
                {COLORS_DEMO.map(({ title, icon, color, progress, value, total }) => (
                    <motion.div key={color} variants={fadeUp}>
                        <ProgressStat title={title} value={value} total={total} progress={progress} icon={icon} color={color} variant="modern" size="sm" isDark={isDark} />
                    </motion.div>
                ))}
            </motion.div>
        </div>

        <div>
            <SubHeading isDark={isDark}>Tamanhos</SubHeading>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5" variants={stagger} initial="hidden" animate="show">
                <motion.div variants={fadeUp}><ProgressStat title="Downloads" value="3.421" total="5.000" progress={68} icon={Download} color="success" variant="telescope" size="sm" isDark={isDark} /></motion.div>
                <motion.div variants={fadeUp}><ProgressStat title="Cadastros" value="2.156" total="3.000" progress={72} icon={User} color="primary" variant="telescope" size="md" isDark={isDark} /></motion.div>
                <motion.div variants={fadeUp}><ProgressStat title="Receita Mensal" value="R$ 47.8k" total="R$ 60k" progress={80} icon={TrendingUp} color="success" variant="telescope" size="lg" isDark={isDark} /></motion.div>
            </motion.div>
        </div>

        <div>
            <SubHeading isDark={isDark}>Interativo — Drag &amp; Drop</SubHeading>
            <div className={cn(
                'p-5 rounded-2xl border backdrop-blur-sm',
                isDark ? 'border-slate-700/40 bg-slate-900/40' : 'border-slate-300/50 bg-slate-100/50'
            )}>
                <SortableProgressStats items={interactiveItems} onSortEnd={setInteractiveItems} isDark={isDark} gridCols={4} animation={250} />
            </div>
            <div className={cn(
                'mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs',
                isDark ? 'text-slate-500' : 'text-slate-400'
            )}>
                <GripVertical className="w-3.5 h-3.5" />
                Arraste os cards para reorganizar a ordem
            </div>
        </div>
    </div>
)
