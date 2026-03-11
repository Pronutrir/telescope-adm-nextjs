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
    description: 'Satisfação das consultas',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-500/10',
    component: AbasAnswers,
  },
  {
    id: 'quimio',
    label: 'Tratamento',
    icon: FlaskConical,
    description: 'Quimioterapia e infusões',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    component: AbasTratamento,
  },
  {
    id: 'tratamentos',
    label: 'Novos Tratamentos',
    icon: ClipboardList,
    description: 'Listagem de tratamentos',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    component: TratamentoList,
  },
  {
    id: 'medicos',
    label: 'Médicos',
    icon: Stethoscope,
    description: 'NPS por médico e convênio',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    component: AbasMedicos,
  },
  {
    id: 'recepcionistas',
    label: 'Recepcionistas',
    icon: Headphones,
    description: 'Atendimento da recepção',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    component: AbasRecepcionistas,
  },
] as const

export default function NpsUnificado() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="flex flex-col gap-4">

      {/* Tabs Header */}
      <div className="bg-white dark:bg-[#212845] rounded-2xl border border-gray-200 dark:border-gray-700/20 shadow-sm p-2">
        <nav className="flex gap-1" role="tablist" aria-label="Seções NPS">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon
            const isActive = activeTab === idx

            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`nps-panel-${tab.id}`}
                onClick={() => setActiveTab(idx)}
                className={cn(
                  'group relative flex flex-1 items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer select-none overflow-hidden',
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-600 ring-1 ring-cyan-200 dark:ring-cyan-400/30 shadow-sm shadow-cyan-100 dark:shadow-cyan-500/20'
                    : 'hover:bg-gray-100 dark:hover:bg-white/5',
                )}
              >
                {/* Indicador inferior */}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full bg-cyan-400 dark:bg-white/40" />
                )}

                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-200',
                    isActive ? 'bg-cyan-100 dark:bg-white/20' : tab.bg,
                  )}
                >
                  <Icon
                    size={16}
                    className={cn('transition-colors', isActive ? 'text-cyan-700 dark:text-white' : tab.color)}
                  />
                </span>

                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-sm font-semibold leading-tight truncate transition-colors',
                      isActive ? 'text-cyan-800 dark:text-white' : 'text-gray-700 dark:text-gray-200 font-medium',
                    )}
                  >
                    {tab.label}
                  </p>
                  <p
                    className={cn(
                      'text-[11px] leading-tight truncate mt-0.5 transition-colors',
                      isActive ? 'text-cyan-600 dark:text-cyan-100' : 'text-gray-500 dark:text-gray-500',
                    )}
                  >
                    {tab.description}
                  </p>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tabs Body */}
      {TABS.map((tab, idx) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`nps-panel-${tab.id}`}
          hidden={activeTab !== idx}
        >
          {activeTab === idx && <tab.component />}
        </div>
      ))}

    </div>
  )
}
