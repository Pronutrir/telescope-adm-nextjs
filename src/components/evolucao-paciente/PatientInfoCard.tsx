'use client'

import React from 'react'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PessoaFisica } from '@/types/tasy'

interface Props {
    isDark: boolean
    patient: PessoaFisica
}

export const PatientInfoCard: React.FC<Props> = ({ isDark, patient }) => (
    <div className={cn(
        'group relative overflow-hidden p-6 rounded-2xl border border-l-4',
        'backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5',
        isDark
            ? 'bg-slate-900/70 border-slate-700/50 border-l-cyan-500 shadow-lg shadow-black/20'
            : 'bg-slate-50/80 border-slate-200 border-l-cyan-500 shadow-lg shadow-slate-300/20',
    )}>
        {/* Accent glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none bg-cyan-500" />

        <div className="relative flex items-start justify-between">
            <div>
                <h3 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                    {patient.nome}
                </h3>
                <div className={cn('mt-2 space-y-1 text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                    <p>Código: <span className="font-medium">{patient.id}</span></p>
                    {patient.cpf && <p>CPF: <span className="font-medium">{patient.cpf}</span></p>}
                </div>
            </div>
            <div
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#06b6d415', color: '#06b6d4' }}
            >
                <User className="w-5 h-5" />
            </div>
        </div>
    </div>
)
