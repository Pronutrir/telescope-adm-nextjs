'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Folder, Check, Lock, Zap } from 'lucide-react'
import type { Workspace } from './types'

interface Props {
    workspace: Workspace
    isDark: boolean
}

const STATE_COLORS: Record<string, string> = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    Deleted: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export const WorkspaceCard: React.FC<Props> = ({ workspace, isDark }) => {
    const stateBadge = workspace.isCurrent ? (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1">
            <Check className="w-3 h-3" /> Workspace Atual
        </span>
    ) : (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', STATE_COLORS[workspace.state] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300')}>
            {workspace.state}
        </span>
    )

    return (
        <div className={cn(
            'p-4 rounded-lg border transition-all',
            workspace.isCurrent
                ? isDark ? 'bg-blue-900/20 border-blue-700 ring-2 ring-blue-500/50'
                         : 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/50'
                : isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                         : 'bg-gray-50 border-gray-200 hover:border-gray-300'
        )}>
            <div className="flex items-center gap-2 mb-2">
                <Folder className={cn('w-5 h-5 flex-shrink-0', workspace.isCurrent ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-600')} />
                <h3 className={cn('font-semibold truncate', workspace.isCurrent ? 'text-blue-600 dark:text-blue-400' : isDark ? 'text-white' : 'text-gray-900')}>
                    {workspace.name}
                </h3>
            </div>
            <p className="text-xs font-mono mb-2 truncate text-gray-500">ID: {workspace.id}</p>
            <div className="flex flex-wrap gap-2">
                {stateBadge}
                {workspace.isReadOnly && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Somente Leitura
                    </span>
                )}
                {workspace.isOnDedicatedCapacity && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Capacidade Dedicada
                    </span>
                )}
                {workspace.isOrphaned && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Órfão</span>
                )}
                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}>
                    {workspace.type}
                </span>
            </div>
            {workspace.capacityId && (
                <p className="text-xs mt-2 text-gray-500">Capacity ID: {workspace.capacityId}</p>
            )}
        </div>
    )
}
