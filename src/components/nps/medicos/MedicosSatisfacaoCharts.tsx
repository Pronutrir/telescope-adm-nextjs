'use client'

import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { ISatisfactionMedicos } from '@/types/nps'

const COLORS = ['#00E1EF', '#6DEED7', '#6577F3', '#FF9F99', '#FB5656']
const LABELS = ['Muito Satisfeito', 'Satisfeito', 'Indiferente', 'Insatisfeito', 'Muito Insatisfeito']

function satisfToData(s: ISatisfactionMedicos) {
  return [
    { name: LABELS[0], value: s.muitO_SATISFEITO },
    { name: LABELS[1], value: s.satisfeito },
    { name: LABELS[2], value: s.indiferente },
    { name: LABELS[3], value: s.insatisfeito },
    { name: LABELS[4], value: s.muitO_INSATISFEITO },
  ].filter((d) => d.value > 0)
}

interface SatisfChartProps {
  title: string
  data: ISatisfactionMedicos
}

function SatisfChart({ title, data }: SatisfChartProps) {
  const chartData = satisfToData(data)
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[LABELS.indexOf(entry.name)] ?? COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [value, 'Respostas']} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface Props {
  satisfacaoAtendimento: ISatisfactionMedicos
  satisfacaoTempoEspera: ISatisfactionMedicos
}

export function MedicosSatisfacaoCharts({ satisfacaoAtendimento, satisfacaoTempoEspera }: Props) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Satisfação
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a2035] border border-gray-200 dark:border-gray-700/30 rounded-xl p-4">
          <SatisfChart title="Satisfação com o Atendimento" data={satisfacaoAtendimento} />
        </div>
        <div className="bg-white dark:bg-[#1a2035] border border-gray-200 dark:border-gray-700/30 rounded-xl p-4">
          <SatisfChart title="Satisfação com o Tempo de Espera" data={satisfacaoTempoEspera} />
        </div>
      </div>
    </div>
  )
}
