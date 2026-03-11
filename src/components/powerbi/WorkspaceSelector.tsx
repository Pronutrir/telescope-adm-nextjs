'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Maximize2, Minimize2, Users, RefreshCw } from 'lucide-react'
import type { Report, Workspace } from './types'

interface Props {
    isDark: boolean
    workspaces: Workspace[]
    selectedWorkspaceId: string
    loadingWorkspaces: boolean
    reports: Report[]
    selectedReport: string | null
    loadingReports: boolean
    isFullscreen: boolean
    selectedReportData?: Report
    onWorkspaceChange: (id: string) => void
    onReportChange: (id: string) => void
    onRefresh: () => void
    onShowUsers: () => void
    onToggleFullscreen: () => void
}

export const WorkspaceSelector: React.FC<Props> = ({
    isDark, workspaces, selectedWorkspaceId, loadingWorkspaces,
    reports, selectedReport, loadingReports, isFullscreen, selectedReportData,
    onWorkspaceChange, onReportChange, onRefresh, onShowUsers, onToggleFullscreen,
}) => {
    const selectCls = cn(
        'w-full px-3 py-2 rounded-lg border transition-colors text-sm',
        'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        isDark ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-800'
               : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
    )
    const btnCls = cn(
        'p-2 rounded-lg border transition-all flex items-center justify-center shrink-0',
        'focus:ring-2 focus:ring-blue-500',
        isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white disabled:bg-gray-800'
               : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700 disabled:bg-gray-100'
    )
    const formattedDate = selectedReportData?.lastRefreshTime
        ? new Date(selectedReportData.lastRefreshTime).toLocaleString('pt-BR', {
              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
          })
        : null

    return (
        <div className={cn('p-3 border rounded-lg', isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3">
                <div className="w-full xl:w-auto xl:min-w-[280px]">
                    <label className={cn('text-xs font-medium mb-1 block xl:hidden', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        🏢 Workspace
                    </label>
                    <select value={selectedWorkspaceId} onChange={(e) => onWorkspaceChange(e.target.value)}
                        disabled={loadingWorkspaces} className={cn(selectCls, loadingWorkspaces && 'cursor-wait')}>
                        {loadingWorkspaces ? <option>Carregando...</option>
                            : workspaces.length === 0 ? <option>Sem workspaces</option>
                            : workspaces.map((w) => (
                                <option key={w.id} value={w.id}>🏢 {w.name} {w.isCurrent ? '★' : ''}</option>
                            ))}
                    </select>
                </div>

                <div className="w-full xl:w-auto xl:min-w-[240px] xl:max-w-[320px]">
                    <label className={cn('text-xs font-medium mb-1 block xl:hidden', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        📊 Dashboard
                    </label>
                    <select value={selectedReport || ''} onChange={(e) => onReportChange(e.target.value)}
                        disabled={loadingReports || reports.length === 0}
                        className={cn(selectCls, (loadingReports || reports.length === 0) && 'cursor-wait')}>
                        {loadingReports ? <option>Carregando...</option>
                            : reports.length === 0 ? <option>Sem dashboards</option>
                            : reports.map((r) => (
                                <option key={r.id} value={r.id}>📊 {r.name}</option>
                            ))}
                    </select>
                </div>

                {formattedDate && (
                    <div className={cn(
                        'hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm whitespace-nowrap',
                        isDark ? 'bg-blue-900/20 border-blue-700 text-blue-300'
                               : 'bg-blue-50 border-blue-200 text-blue-700'
                    )}>
                        <span className="text-xs opacity-75">Atualizado:</span>
                        <span className="font-semibold">{formattedDate}</span>
                    </div>
                )}

                <div className="hidden xl:flex flex-1" />

                <div className="flex items-center gap-2 w-full xl:w-auto xl:ml-auto">
                    <button onClick={onRefresh} disabled={loadingReports} className={cn(btnCls, loadingReports && 'cursor-wait')} title="Atualizar relatórios">
                        <RefreshCw className={cn('w-4 h-4', loadingReports && 'animate-spin')} />
                    </button>
                    <button onClick={onShowUsers} className={btnCls} title="Ver usuários do workspace">
                        <Users className="w-4 h-4" />
                    </button>
                    <button onClick={onToggleFullscreen} disabled={!selectedReport} className={btnCls}
                        title={isFullscreen ? 'Sair da tela cheia (ESC)' : 'Expandir para tela cheia'}>
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
