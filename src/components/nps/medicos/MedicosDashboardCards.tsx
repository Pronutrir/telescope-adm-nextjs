'use client'

import React from 'react'
import { Info } from 'lucide-react'
import NpsCard from '../NpsCard'
import type { INPSMedicoValues } from '@/types/nps'

interface Props {
  data: INPSMedicoValues | null
  mode?: 'medico' | 'convenio'
  porcentagem?: number
}

export function MedicosDashboardCards({ data, mode = 'medico', porcentagem }: Props) {
  const pct = porcentagem ?? (mode === 'medico' ? data?.porcentageM_MEDICO : (data as any)?.porcentageM_CONVENIO) ?? 0

  const cards = [
    {
      value: data?.qtD_ATENDIMENTOS ?? 0,
      label: 'Atendimentos',
      tooltip: 'Total de atendimentos no período selecionado',
    },
    {
      value: data ? Math.round(data.mediA_TEMPO_ESPERA) : 0,
      unit: 'min',
      label: 'Tempo médio de espera',
      tooltip: 'Média de tempo de espera dos pacientes em minutos',
    },
    {
      value: data ? Math.round(data.mediA_TEMPO_CONSULTA) : 0,
      unit: 'min',
      label: 'Tempo médio de consulta',
      tooltip: 'Média de duração das consultas em minutos',
    },
    {
      value: data ? Math.round(pct) : 0,
      unit: '%',
      label: mode === 'medico' ? '% espera ≤ 30 min (médico)' : '% espera ≤ 30 min (convênio)',
      tooltip: 'Percentual de atendimentos com espera de até 30 minutos',
    },
    {
      value: data ? Math.round(data.porcentageM_GERAL ?? 0) : 0,
      unit: '%',
      label: '% espera ≤ 30 min (geral)',
      tooltip: 'Percentual geral de atendimentos com espera de até 30 minutos',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
      {cards.map((card) => (
        <NpsCard.Root key={card.label} themeColor="dark">
          <NpsCard.Wrapper>
            <NpsCard.TotalText>{card.value}</NpsCard.TotalText>
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
