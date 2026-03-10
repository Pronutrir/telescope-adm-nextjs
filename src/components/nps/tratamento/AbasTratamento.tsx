'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { List, BarChart3 } from 'lucide-react'
import QuimioList from './QuimioList'
import TratamentoDashboard from './TratamentoDashboard'

const TABS = [
  { label: 'Listagem', icon: List },
  { label: 'Dashboard', icon: BarChart3 },
] as const

const AbasTratamento: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="flex flex-col">
      {/* Tabs Header */}
      <div className="border-b border-gray-200 dark:border-gray-700/60">
        <nav className="flex gap-1" aria-label="NPS Tratamento tabs">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon
            const isActive = activeTab === idx
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`nps-tratamento-tabpanel-${idx}`}
                className={cn(
                  'flex items-center gap-2 py-3 px-6 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer',
                  isActive
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600',
                )}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <div
          role="tabpanel"
          id="nps-tratamento-tabpanel-0"
          hidden={activeTab !== 0}
        >
          {activeTab === 0 && <QuimioList />}
        </div>
        <div
          role="tabpanel"
          id="nps-tratamento-tabpanel-1"
          hidden={activeTab !== 1}
        >
          {activeTab === 1 && <TratamentoDashboard />}
        </div>
      </div>
    </div>
  )
}

export default AbasTratamento
