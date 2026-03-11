'use client'

import { TrendingUp, MessageSquare, ThumbsUp, AlertCircle, Lightbulb, Clock } from 'lucide-react'
import { NpsSummaryCard, type NpsSummaryCardProps } from './NpsSummaryCard'
import type { IDashboardValues } from '@/types/nps'

interface DashboardCardsProps {
  data: IDashboardValues | null
}

export function DashboardCards({ data }: DashboardCardsProps) {
  const cards: NpsSummaryCardProps[] = [
    {
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      label: 'Taxa de resposta',
      value: data?.percentuaL_RESPOSTAS.toFixed(0) ?? 0,
      unit: '%',
      tooltip: 'Percentual de pacientes que responderam a pesquisa em relação ao total de pesquisas enviadas',
    },
    {
      icon: MessageSquare,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      label: 'Taxa de comentários',
      value: data?.percentuaL_COMENTARIOS.toFixed(0) ?? 0,
      unit: '%',
      tooltip: 'Percentual de comentários que foram respondidos em relação ao total de comentários recebidos',
    },
    {
      icon: ThumbsUp,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-500/10',
      label: 'Elogios em até 24h',
      value: data?.percentuaL_ELOGIOS_RESPONDIDOS_24H.toFixed(0) ?? 0,
      unit: '%',
      tooltip: 'Percentual de elogios respondidos dentro de 24 horas',
    },
    {
      icon: ThumbsUp,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      label: 'Elogios em até 72h',
      value: data?.percentuaL_ELOGIOS_RESPONDIDOS_72H.toFixed(0) ?? 0,
      unit: '%',
      tooltip: 'Percentual de elogios respondidos dentro de 72 horas',
    },
    {
      icon: AlertCircle,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      label: 'Queixas em até 24h',
      value: data?.percentuaL_QUEIXAS_RESPONDIDAS_24H.toFixed(0) ?? 0,
      unit: '%',
      tooltip: 'Percentual de queixas respondidas dentro de 24 horas',
    },
    {
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      label: 'Queixas em até 72h',
      value: data?.percentuaL_QUEIXAS_RESPONDIDAS_72H.toFixed(0) ?? 0,
      unit: '%',
      tooltip: 'Percentual de queixas respondidas dentro de 72 horas',
    },
    {
      icon: Lightbulb,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      label: 'Queixas em melhorias',
      value: data?.qtD_QUEIXAS_MELHORIAS ?? 0,
      tooltip: 'Total de queixas transformadas em ações de melhoria',
    },
    {
      icon: Clock,
      color: 'text-gray-500 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-white/5',
      label: 'Não respondidos',
      value: data?.qtD_NAO_RESPONDIDOS ?? 0,
      tooltip: 'Pesquisas enviadas que não foram respondidas',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
      {cards.map((c) => <NpsSummaryCard key={c.label} {...c} />)}
    </div>
  )
}
