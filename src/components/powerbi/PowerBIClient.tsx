'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { usePowerBIClient } from './usePowerBIClient'
import { WorkspaceSelector } from './WorkspaceSelector'
import { WorkspaceUsersModal } from './WorkspaceUsersModal'
import { PowerBIReport } from './PowerBIReport'
import type { Report } from './types'

interface PowerBIClientProps {
    initialReports: Report[]
    initialWorkspaceId: string
}

export function PowerBIClient({ initialReports, initialWorkspaceId }: PowerBIClientProps) {
    const {
        isDark, workspaces, selectedWorkspaceId, loadingWorkspaces,
        reports, selectedReport, loadingReports, isFullscreen, showUsersModal,
        containerRef, selectedReportData, setSelectedReport, setSelectedWorkspaceId,
        setShowUsersModal, loadReports, toggleFullscreen,
    } = usePowerBIClient({ initialReports, initialWorkspaceId })

    const emptyCardCls = cn(
        'p-8 rounded-lg border text-center',
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    )
    const iconCls = cn('h-12 w-12 mx-auto mb-4', isDark ? 'text-gray-500' : 'text-gray-400')
    const textCls = isDark ? 'text-gray-400' : 'text-gray-600'

    return (
        <div ref={containerRef} className={cn('space-y-4', isFullscreen && 'bg-white dark:bg-gray-900 p-6')}>
            <WorkspaceSelector
                isDark={isDark}
                workspaces={workspaces}
                selectedWorkspaceId={selectedWorkspaceId}
                loadingWorkspaces={loadingWorkspaces}
                reports={reports}
                selectedReport={selectedReport}
                loadingReports={loadingReports}
                isFullscreen={isFullscreen}
                selectedReportData={selectedReportData}
                onWorkspaceChange={setSelectedWorkspaceId}
                onReportChange={setSelectedReport}
                onRefresh={() => loadReports(selectedWorkspaceId)}
                onShowUsers={() => setShowUsersModal(true)}
                onToggleFullscreen={toggleFullscreen}
            />

            {loadingReports && (
                <div className={emptyCardCls}>
                    <RefreshCw className={cn(iconCls, 'animate-spin')} />
                    <p className={textCls}>Carregando dashboards do workspace...</p>
                </div>
            )}

            {!loadingReports && reports.length === 0 && (
                <div className={emptyCardCls}>
                    <AlertCircle className={iconCls} />
                    <p className={textCls}>Nenhum dashboard encontrado neste workspace</p>
                </div>
            )}

            {selectedReport && (
                <div
                    className={cn('overflow-hidden rounded-lg border', isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}
                    style={{
                        height: isFullscreen ? 'calc(100vh - 150px)' : 'calc(100vh - 400px)',
                        minHeight: isFullscreen ? '800px' : '600px',
                        width: '100%',
                    }}
                >
                    <PowerBIReport
                        reportId={selectedReport}
                        workspaceId={selectedWorkspaceId}
                        key={`${selectedWorkspaceId}-${selectedReport}`}
                    />
                </div>
            )}

            <WorkspaceUsersModal isOpen={showUsersModal} onClose={() => setShowUsersModal(false)} />
        </div>
    )
}
