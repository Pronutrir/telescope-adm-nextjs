'use client'

import React from 'react'
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface Props {
    isDark: boolean
}

const ACTIONS = [
    { label: 'Relatório Detalhado', icon: BarChart3, variant: 'primary' as const, msg: 'Relatório detalhado em desenvolvimento!' },
    { label: 'Análise de Tendências', icon: TrendingUp, variant: 'success' as const, msg: 'Análise de tendências em desenvolvimento!' },
    { label: 'Gestão de Usuários', icon: Users, variant: 'info' as const, msg: 'Gestão de usuários em desenvolvimento!' },
    { label: 'Configurar Agendas', icon: Calendar, variant: 'accent' as const, msg: 'Configurações de agenda em desenvolvimento!' },
]

export const QuickActionsSection: React.FC<Props> = ({ isDark }) => (
    <div className={cn('p-6 rounded-xl border', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50')}>
        <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
            Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTIONS.map(({ label, icon, variant, msg }) => (
                <Button
                    key={label}
                    variant={variant}
                    icon={icon}
                    onClick={() => alert(msg)}
                    className="w-full"
                >
                    {label}
                </Button>
            ))}
        </div>
        <div className={cn('mt-4 text-sm', isDark ? 'text-gray-300' : 'text-muted-foreground')}>
            <p>💡 <strong>Dica:</strong> Use os botões acima para acessar funcionalidades avançadas do sistema.</p>
        </div>
    </div>
)
