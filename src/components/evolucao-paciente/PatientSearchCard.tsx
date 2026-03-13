'use client'

import React from 'react'
import { Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AutocompletePessoa } from '@/components/pdf/AutocompletePessoa'
import type { PessoaFisica } from '@/types/tasy'

interface Props {
    isDark: boolean
    value: string
    onSelect: (nome: string, pessoa?: PessoaFisica) => void
}

export const PatientSearchCard: React.FC<Props> = ({ isDark, value, onSelect }) => (
    <div className={cn(
        'relative z-50 overflow-visible p-6 rounded-2xl border',
        'backdrop-blur-xl transition-all duration-300',
        isDark
            ? 'bg-slate-900/70 border-slate-700/50 shadow-lg shadow-black/20'
            : 'bg-slate-50/80 border-slate-200 shadow-lg shadow-slate-300/20',
    )}>
        <h2 className={cn(
            'text-lg font-semibold mb-4 flex items-center gap-2.5',
            isDark ? 'text-white' : 'text-slate-800',
        )}>
            <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ backgroundColor: '#6366f115', color: '#6366f1' }}
            >
                <Search className="w-4 h-4" />
            </div>
            Buscar Paciente
        </h2>
        <div className="max-w-2xl mx-auto">
            <AutocompletePessoa
                value={value}
                onChange={onSelect}
                placeholder="Digite o nome do paciente..."
                className="w-full"
            />
        </div>
    </div>
)
