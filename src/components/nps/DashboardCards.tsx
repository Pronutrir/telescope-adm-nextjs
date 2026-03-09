'use client'

import React from 'react'
import { Info } from 'lucide-react'
import NpsCard from './NpsCard'
import type { IDashboardValues } from '@/types/nps'

interface CardConfig {
  value: number
  unit?: string
  label: string
  tooltip: string
}

interface DashboardCardsProps {
  data: IDashboardValues | null
}

export function DashboardCards({ data }: DashboardCardsProps) {
  const cards: CardConfig[] = [
    { value: data?.percentuaL_RESPOSTAS ?? 0, unit: '%', label: 'Taxa de resposta', tooltip: 'Percentual de pacientes que responderam a pesquisa em relação ao total de pesquisas enviadas' },
    { value: data?.percentuaL_COMENTARIOS ?? 0, unit: '%', label: 'Taxa de comentários', tooltip: 'Percentual de comentários que foram respondidos em relação ao total de comentários recebidos' },
    { value: data?.percentuaL_ELOGIOS_RESPONDIDOS_24H ?? 0, unit: '%', label: 'Elogios em até 24h', tooltip: 'Percentual de elogios respondidos dentro de 24 horas' },
    { value: data?.percentuaL_ELOGIOS_RESPONDIDOS_72H ?? 0, unit: '%', label: 'Elogios em até 72h', tooltip: 'Percentual de elogios respondidos dentro de 72 horas' },
    { value: data?.percentuaL_QUEIXAS_RESPONDIDAS_24H ?? 0, unit: '%', label: 'Queixas em até 24h', tooltip: 'Percentual de queixas respondidas dentro de 24 horas' },
    { value: data?.percentuaL_QUEIXAS_RESPONDIDAS_72H ?? 0, unit: '%', label: 'Queixas em até 72h', tooltip: 'Percentual de queixas respondidas dentro de 72 horas' },
    { value: data?.qtD_QUEIXAS_MELHORIAS ?? 0, label: 'Queixas em melhorias', tooltip: 'Total de queixas transformadas em ações de melhoria' },
    { value: data?.qtD_NAO_RESPONDIDOS ?? 0, label: 'Não respondidos', tooltip: 'Pesquisas enviadas que não foram respondidas' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
      {cards.map((card) => (
        <NpsCard.Root key={card.label} themeColor="dark">
          <NpsCard.Wrapper>
            <NpsCard.TotalText>
              {card.unit ? card.value.toFixed(0) : card.value}
            </NpsCard.TotalText>
            {card.unit && (
              <span className="self-end text-gray-500 text-lg font-semibold">{card.unit}</span>
            )}
          </NpsCard.Wrapper>
          <NpsCard.Legend className="flex items-center gap-1 text-xs justify-center px-2">
            {card.label}
            <span title={card.tooltip}>
              <Info size={12} className="text-gray-500 cursor-help shrink-0" />
            </span>
          </NpsCard.Legend>
        </NpsCard.Root>
      ))}
    </div>
  )
}
