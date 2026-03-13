'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { EvolucaoPaciente } from '@/types/tasy'

interface Props {
    isDark: boolean
    evolucao: EvolucaoPaciente
    index: number
    onClick: () => void
}

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as const },
    }),
}

export const EvolutionCard: React.FC<Props> = ({ isDark, evolucao, index, onClick }) => (
    <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={index}
        onClick={onClick}
        className={cn(
            'group relative overflow-hidden p-3.5 rounded-2xl border cursor-pointer',
            'flex flex-col h-48 transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-xl',
            isDark
                ? 'bg-slate-900/70 border-slate-700/50 hover:border-cyan-500/40 shadow-lg shadow-black/15'
                : 'bg-slate-50/80 border-slate-200 hover:border-cyan-400/50 shadow-lg shadow-slate-300/20',
        )}
    >
        {/* Hover accent glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none bg-cyan-500" />

        <div className="relative">
            <div className="flex items-center justify-between mb-2">
                <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-lg',
                    isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-700',
                )}>
                    #{evolucao.numeroAtendimento}
                </span>
                <span className={cn('text-[10px]', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    {format(new Date(evolucao.dataEvolucao), 'dd/MM/yy', { locale: ptBR })}
                </span>
            </div>

            <h4
                className={cn('font-semibold text-xs mb-0.5 truncate', isDark ? 'text-white' : 'text-slate-900')}
                title={evolucao.nomeProfissional}
            >
                {evolucao.nomeProfissional}
            </h4>
            <p className={cn('text-[10px] mb-2 truncate', isDark ? 'text-slate-500' : 'text-slate-400')}>
                {evolucao.usuario}
            </p>
        </div>

        <div className={cn(
            'relative pt-2 border-t flex-1 overflow-hidden',
            isDark ? 'border-slate-700/60' : 'border-slate-200/80',
        )}>
            <div
                className={cn('text-[10px] line-clamp-5 leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-500')}
                dangerouslySetInnerHTML={{ __html: evolucao.descricao }}
            />
        </div>
    </motion.div>
)
