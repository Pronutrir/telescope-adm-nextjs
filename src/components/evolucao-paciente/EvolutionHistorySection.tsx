'use client'

import React from 'react'
import { Activity, FileText, Calendar, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EvolutionCard } from './EvolutionCard'
import type { EvolucaoPaciente } from '@/types/tasy'

interface Props {
    isDark: boolean
    evolucoes: EvolucaoPaciente[]
    isLoading: boolean
    error: string | null
    onOpenDetail: (e: EvolucaoPaciente) => void
    onNewEvolution: () => void
}

export const EvolutionHistorySection: React.FC<Props> = ({
    isDark, evolucoes, isLoading, error, onOpenDetail, onNewEvolution,
}) => (
    <div className={cn(
        'p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300',
        isDark
            ? 'bg-slate-900/70 border-slate-700/50 shadow-lg shadow-black/20'
            : 'bg-slate-50/80 border-slate-200 shadow-lg shadow-slate-300/20',
    )}>
        <div className="flex items-center justify-between mb-6">
            <h2 className={cn('text-lg font-semibold flex items-center gap-2.5', isDark ? 'text-white' : 'text-slate-800')}>
                <div
                    className="flex items-center justify-center w-9 h-9 rounded-xl"
                    style={{ backgroundColor: '#10b98115', color: '#10b981' }}
                >
                    <Activity className="w-4 h-4" />
                </div>
                Histórico de Evoluções
            </h2>
            <button
                className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                    'flex items-center gap-2 cursor-pointer',
                    'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
                    'shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30',
                    'hover:scale-[1.02] active:scale-[0.98]',
                )}
                onClick={onNewEvolution}
            >
                <FileText className="w-4 h-4" />
                Nova Evolução
            </button>
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
                <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    Carregando evoluções...
                </p>
            </div>
        ) : error ? (
            <div className={cn(
                'p-4 rounded-xl border flex items-center gap-3',
                isDark
                    ? 'bg-red-500/5 border-red-500/20 text-red-400'
                    : 'bg-red-50 border-red-200 text-red-700',
            )}>
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
            </div>
        ) : evolucoes.length === 0 ? (
            <div className={cn(
                'text-center py-16 border-2 border-dashed rounded-2xl',
                isDark ? 'border-slate-700/50' : 'border-slate-200',
            )}>
                <Calendar className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-slate-600' : 'text-slate-300')} />
                <h3 className={cn('text-base font-medium mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}>
                    Nenhuma evolução encontrada
                </h3>
                <p className={cn('max-w-md mx-auto text-sm', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    Não foram encontrados registros de evolução para este paciente.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {evolucoes.map((evolucao, i) => (
                    <EvolutionCard
                        key={evolucao.id}
                        isDark={isDark}
                        evolucao={evolucao}
                        index={i}
                        onClick={() => onOpenDetail(evolucao)}
                    />
                ))}
            </div>
        )}
    </div>
)
