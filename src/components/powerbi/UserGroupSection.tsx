'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { WorkspaceUser } from './types'

const ACCESS_COLORS: Record<string, string> = {
    Admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    Member: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Contributor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

interface Props {
    title: string
    icon: React.ReactNode
    list: WorkspaceUser[]
    isDark: boolean
}

export const UserGroupSection: React.FC<Props> = ({ title, icon, list, isDark }) => {
    if (list.length === 0) return null

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                    {title} ({list.length})
                </h3>
            </div>
            <div className="space-y-2">
                {list.map((item, index) => (
                    <div key={index} className={cn(
                        'p-3 rounded-lg border transition-colors',
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    )}>
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className={cn('font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>{item.displayName}</p>
                                {item.emailAddress && (
                                    <p className={cn('text-sm truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>{item.emailAddress}</p>
                                )}
                                {item.identifier !== item.displayName && !item.emailAddress && (
                                    <p className={cn('text-sm truncate', isDark ? 'text-gray-400' : 'text-gray-600')}>{item.identifier}</p>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                <span className={cn(
                                    'px-2 py-1 rounded-full text-xs font-medium',
                                    ACCESS_COLORS[item.groupUserAccessRight] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                )}>
                                    {item.groupUserAccessRight}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
