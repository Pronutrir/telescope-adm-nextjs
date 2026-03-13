'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { EvolucaoPaciente } from '@/types/tasy'

interface Props {
    isDark: boolean
    isOpen: boolean
    evolucao: EvolucaoPaciente | null
    onClose: () => void
}

export const EvolutionDetailModal: React.FC<Props> = ({ isDark, isOpen, evolucao, onClose }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Evolução" size="lg">
        {evolucao && (
            <div className="space-y-6">
                <div className={cn(
                    'flex flex-col md:flex-row justify-between gap-4 p-4 rounded-2xl',
                    isDark ? 'bg-slate-800/60' : 'bg-slate-50',
                )}>
                    <div>
                        <h4 className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-slate-900')}>
                            {evolucao.nomeProfissional}
                        </h4>
                        <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                            {evolucao.usuario}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-slate-900')}>
                            {format(new Date(evolucao.dataEvolucao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                        <div className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                            Atendimento: {evolucao.numeroAtendimento}
                        </div>
                    </div>
                </div>

                <div className={cn('prose max-w-none', isDark && 'prose-invert')}>
                    <div dangerouslySetInnerHTML={{ __html: evolucao.descricao }} />
                </div>

                {evolucao.dataLiberacao && (
                    <div className={cn(
                        'text-xs text-right pt-4 border-t',
                        isDark ? 'border-slate-700 text-emerald-400' : 'border-slate-200 text-emerald-600',
                    )}>
                        Liberado em: {format(new Date(evolucao.dataLiberacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                )}
            </div>
        )}
    </Modal>
)
