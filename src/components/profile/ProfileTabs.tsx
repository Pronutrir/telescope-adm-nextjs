'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type { ProfileTabId } from './useProfilePage'

interface Tab {
    id: ProfileTabId
    label: string
    icon: LucideIcon
}

interface ProfileTabsProps {
    tabs: readonly Tab[]
    activeTab: ProfileTabId
    setActiveTab: (tab: ProfileTabId) => void
    isDark: boolean
    isMobile: boolean
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
    tabs,
    activeTab,
    setActiveTab,
    isDark,
    isMobile,
}) => {
    return (
        <div className={cn(
            'p-2 rounded-xl border shadow-lg transition-colors',
            isMobile && 'overflow-x-auto',
            isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200',
        )}>
            <div className={cn('flex gap-2', isMobile ? 'min-w-max' : 'flex-wrap')}>
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                                isMobile && 'text-sm px-4 py-2',
                                isActive
                                    ? isDark
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-blue-600 text-white shadow-lg'
                                    : isDark
                                        ? 'text-gray-300 hover:bg-gray-700/50'
                                        : 'text-gray-600 hover:bg-gray-100',
                            )}
                        >
                            <Icon className={cn('w-5 h-5', isActive ? 'profile-tab-icon-active' : 'profile-tab-icon')} />
                            <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
