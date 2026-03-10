'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'
import RecepcionistasList from './RecepcionistasList'

const TABS = [
  { label: 'Listagem', icon: List },
] as const

const AbasRecepcionistas: React.FC = () => {
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
                'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#212845] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700/40 hover:bg-gray-50 dark:hover:bg-gray-700/40',
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div>
        <div
          role="tabpanel"
          id="nps-recepcionistas-tabpanel-0"
          hidden={activeTab !== 0}
        >
          {activeTab === 0 && <RecepcionistasList />}
        </div>
      </div>
    </div>
  )
}

export default AbasRecepcionistas
