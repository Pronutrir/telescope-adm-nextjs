'use client'

import { Users, Clock, Stethoscope, TrendingUp, BarChart3 } from 'lucide-react'
import { NpsSummaryCard, type NpsSummaryCardProps } from '../NpsSummaryCard'
import type { INPSMedicoValues } from '@/types/nps'

interface Props {
  data: INPSMedicoValues | null
  mode?: 'medico' | 'convenio'
  porcentagem?: number
}

export function MedicosDashboardCards({ data, mode = 'medico', porcentagem }: Props) {
  const pct = porcentagem ?? (mode === 'medico' ? data?.porcentageM_MEDICO : (data as any)?.porcentageM_CONVENIO) ?? 0

  const cards: NpsSummaryCardProps[] = [
    {
      icon: Users,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-500/10',
      label: 'Atendimentos',
      value: data?.qtD_ATENDIMENTOS ?? 0,
      tooltip: 'Total de atendimentos no período selecionado',
    },
    {
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      label: 'Tempo médio de espera',
      value: data ? Math.round(data.mediA_TEMPO_ESPERA) : 0,
      unit: 'min',
      tooltip: 'Média de tempo de espera dos pacientes em minutos',
    },
    {
      icon: Stethoscope,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      label: 'Tempo médio de consulta',
      value: data ? Math.round(data.mediA_TEMPO_CONSULTA) : 0,
      unit: 'min',
      tooltip: 'Média de duração das consultas em minutos',
    },
    {
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      label: mode === 'medico' ? '% espera ≤ 30 min (médico)' : '% espera ≤ 30 min (convênio)',
      value: data ? Math.round(pct) : 0,
      unit: '%',
      tooltip: 'Percentual de atendimentos com espera de até 30 minutos',
    },
    {
      icon: BarChart3,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      label: '% espera ≤ 30 min (geral)',
      value: data ? Math.round(data.porcentageM_GERAL ?? 0) : 0,
      unit: '%',
      tooltip: 'Percentual geral de atendimentos com espera de até 30 minutos',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
      {cards.map((c) => <NpsSummaryCard key={c.label} {...c} />)}
    </div>
  )
}
