'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { List, BarChart3 } from 'lucide-react'
import AnswersList from './AnswersList'
import AnswersDashboard from './AnswersDashboard'

const TABS = [
  { label: 'Respostas', icon: List },
  { label: 'Dashboard', icon: BarChart3 },
] as const

const AbasAnswers: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon
          const isActive = activeTab === idx
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer select-none overflow-hidden',
                isActive
                  ? 'bg-cyan-50 dark:bg-cyan-600 ring-1 ring-cyan-200 dark:ring-cyan-400/30 shadow-sm shadow-cyan-100 dark:shadow-cyan-500/20 font-semibold text-cyan-800 dark:text-white'
                  : 'font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-[#212845] border border-gray-200 dark:border-gray-700/40 hover:bg-gray-50 dark:hover:bg-gray-700/40',
              )}
            >

              <span
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-md shrink-0 transition-all duration-200',
                  isActive ? 'bg-cyan-100 dark:bg-white/20' : 'bg-gray-100 dark:bg-white/5',
                )}
              >
                <Icon
                  size={14}
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-cyan-700 dark:text-white' : 'text-gray-500 dark:text-gray-400',
                  )}
                />
              </span>
              {tab.label}
            </button>
          )
        })}
      </div>

      <div>
        <div role="tabpanel" id="nps-tabpanel-0" hidden={activeTab !== 0}>
          {activeTab === 0 && <AnswersList />}
        </div>
        <div role="tabpanel" id="nps-tabpanel-1" hidden={activeTab !== 1}>
          {activeTab === 1 && <AnswersDashboard />}
        </div>
      </div>
    </div>
  )
}

export default AbasAnswers
