'use client'

import { ClipboardList, MessageSquare, MessageSquareOff, CheckCircle2, Clock } from 'lucide-react'
import { NpsSummaryCard, type NpsSummaryCardProps } from '../NpsSummaryCard'
import type { IRatingRecepcionistas } from '@/types/nps'

interface RecepcionistasListCardsProps {
  data: IRatingRecepcionistas[]
  isSuccess: boolean
  calcPercent: (total: number, part: number) => string
}

export function RecepcionistasListCards({ data, isSuccess, calcPercent }: RecepcionistasListCardsProps) {
  const total = data.length
  const withComments = data.filter((i) => Boolean(i.resp2)).length
  const withoutComments = total - withComments
  const replied = data.filter((i) => i.reply).length
  const notReplied = data.filter((i) => !i.reply).length
  const pct = (n: number) => (isSuccess && total > 0 ? `${calcPercent(total, n)}%` : undefined)

  const cards: NpsSummaryCardProps[] = [
    { icon: ClipboardList,    color: 'text-cyan-600 dark:text-cyan-400',    bg: 'bg-cyan-50 dark:bg-cyan-500/10',       label: 'Total de pesquisas', value: total },
    { icon: MessageSquare,    color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/10',     label: 'Com comentários',    value: withComments,    pct: pct(withComments) },
    { icon: MessageSquareOff, color: 'text-gray-500 dark:text-gray-400',    bg: 'bg-gray-100 dark:bg-white/5',          label: 'Sem comentários',    value: withoutComments, pct: pct(withoutComments) },
    { icon: CheckCircle2,     color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Respondidos',     value: replied,         pct: pct(replied) },
    { icon: Clock,            color: 'text-rose-600 dark:text-rose-400',    bg: 'bg-rose-50 dark:bg-rose-500/10',       label: 'Não respondidos',    value: notReplied,      pct: pct(notReplied) },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {cards.map((c) => <NpsSummaryCard key={c.label} {...c} />)}
    </div>
  )
}
