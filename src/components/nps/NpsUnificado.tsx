'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ClipboardCheck,
  FlaskConical,
  ClipboardList,
  Stethoscope,
  Headphones,
} from 'lucide-react'
import AbasAnswers from './AbasAnswers'
import AbasTratamento from './tratamento/AbasTratamento'
import TratamentoList from './tratamento/TratamentoList'
import AbasMedicos from './medicos/AbasMedicos'
import AbasRecepcionistas from './recepcionistas/AbasRecepcionistas'

const TABS = [
  {
    id: 'consultas',
    label: 'Consultas',
    icon: ClipboardCheck,
    description: 'Pesquisa de satisfação das consultas',
    component: AbasAnswers,
  },
  {
    id: 'quimio',
    label: 'Tratamento',
    icon: FlaskConical,
    description: 'NPS dos tratamentos de quimioterapia',
    component: AbasTratamento,
  },
  {
    id: 'tratamentos',
    label: 'Tratamentos',
    icon: ClipboardList,
    description: 'Listagem de novos tratamentos',
    component: TratamentoList,
  },
  {
    id: 'medicos',
    label: 'Médicos',
    icon: Stethoscope,
    description: 'NPS por médico e por convênio',
    component: AbasMedicos,
  },
  {
    id: 'recepcionistas',
    label: 'Recepcionistas',
    icon: Headphones,
    description: 'Satisfação no atendimento da recepção',
    component: AbasRecepcionistas,
  },
] as const

export default function NpsUnificado() {
  const [activeTab, setActiveTab] = useState(0)
  const ActiveComponent = TABS[activeTab].component

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="bg-white dark:bg-[#212845] rounded-xl border border-gray-200 dark:border-gray-700/20 shadow-sm p-1.5">
        <nav className="flex gap-1 flex-wrap" aria-label="NPS sections">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon
            const isActive = activeTab === idx
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                aria-selected={isActive}
                className={cn(
                  'group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none',
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-200',
                )}
              >
                <Icon
                  size={16}
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300',
                  )}
                />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  )
}
