'use client'

import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HistoryQTStopWatchH, IStopwatchTodayHub } from '@/types/stopwatch'

interface InsignDailyProps {
  history?: HistoryQTStopWatchH[]
  hubData?: IStopwatchTodayHub | null
  metrics?: Record<string, number>
}

const METRIC_DEFAULTS: Record<string, number> = {
  AC_RE: 10,
  RE_TR: 15,
  TR_ACM: 10,
  FA_SAT_TT: 30,
  FA_TT: 30,
  PE_TT: 20,
}

const LABELS = [
  'Acolhimento - Recepção',
  'Recepção - Triagem',
  'Triagem - Acomodação',
  'Farmácia Satélite',
  'Farmácia Produção',
  'Posto de enfermagem',
]

function countDelaysFromPatients(
  patients: { interV_AC_RE: number; interV_RE_TR: number; interV_TR_I_AC: number; interV_FA_SAT_TT: number; interV_FA_TT: number; interV_ENF_TT: number; interV_TR_F_TT?: number }[],
  metrics: Record<string, number>,
) {
  const c = [0, 0, 0, 0, 0, 0]
  for (const item of patients) {
    if (item.interV_AC_RE > 0 && item.interV_AC_RE > (metrics.AC_RE ?? 10)) c[0]++
    if (item.interV_RE_TR > 0 && item.interV_RE_TR > (metrics.RE_TR ?? 15)) c[1]++
    if (item.interV_TR_I_AC > 0 && item.interV_TR_I_AC > (metrics.TR_ACM ?? 10)) c[2]++
    if (item.interV_FA_SAT_TT > 0 && item.interV_FA_SAT_TT > (metrics.FA_SAT_TT ?? 30)) c[3]++
    if (item.interV_FA_TT > 0 && item.interV_FA_TT > (metrics.FA_TT ?? 30)) c[4]++
    if (item.interV_ENF_TT > 0 && item.interV_ENF_TT > (metrics.PE_TT ?? 20)) c[5]++
  }
  return c
}

export function InsignDaily({ history = [], hubData, metrics = METRIC_DEFAULTS }: InsignDailyProps) {
  const data = useMemo(() => {
    // Use hub data (real-time) if available, otherwise use history
    if (hubData) {
      const allPatients = [
        ...hubData.acolhimento.patients,
        ...hubData.recepcao.patients,
        ...hubData.triagem.patients,
        ...hubData.farmacia.satelite.patients,
        ...hubData.farmacia.producao.patients,
        ...hubData.acomodacao.patients,
        ...hubData.pre_Tratamento.patients,
        ...hubData.tratamento.patients,
      ]
      // Deduplicate by nR_SEQ_PACIENTE
      const unique = Array.from(
        new Map(allPatients.map(p => [p.nR_SEQ_PACIENTE, p])).values()
      )
      if (unique.length === 0) return []
      const c = countDelaysFromPatients(unique, metrics)
      return LABELS.map((name, i) => ({ name, atrasos: c[i] }))
    }

    if (!history.length) return []
    const c = countDelaysFromPatients(history, metrics)
    return LABELS.map((name, i) => ({ name, atrasos: c[i] }))
  }, [history, hubData, metrics])

  const hasData = data.some(d => d.atrasos > 0)
  const now = format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#1b2030] p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest">Setores</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Total de atrasos diário - {now}
        </p>
      </div>
      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              width={140}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-card, #1f2937)',
                border: '1px solid var(--color-border, #374151)',
                borderRadius: 8,
                color: 'var(--color-foreground, #f3f4f6)',
              }}
              formatter={(v) => [`${v} atrasos`, '']}
            />
            <Bar dataKey="atrasos" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.atrasos > 0 ? '#7c3aed' : '#374151'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-2">
            <span className="text-lg text-gray-400">0</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Sem dados de atrasos hoje</p>
        </div>
      )}
    </div>
  )
}
