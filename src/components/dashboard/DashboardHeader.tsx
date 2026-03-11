'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
    isDark: boolean
}

export const DashboardHeader: React.FC<Props> = ({ isDark }) => (
    <div className="text-center">
        <h1 className={cn('text-4xl font-bold mb-4', isDark ? 'text-white' : 'text-slate-800')}>
            Dashboard Telescope-ADM
        </h1>
        <p className={cn('text-lg', isDark ? 'text-gray-300' : 'text-muted-foreground')}>
            Painel principal com dados reais do Google Analytics 4 e sistema interno
        </p>
        <div className={cn(
            'mt-6 p-4 rounded-lg border',
            isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-accent/20 border-border/20'
        )}>
            <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-muted-foreground')}>
                📊 <strong>Dados em Tempo Real:</strong> Métricas atualizadas automaticamente a cada 5 minutos.
            </p>
        </div>
    </div>
)
