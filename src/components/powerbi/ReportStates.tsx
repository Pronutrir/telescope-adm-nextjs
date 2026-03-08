'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, AlertCircle } from 'lucide-react'

interface ReportLoadingProps {
    isDark: boolean
    reportName?: string
    height: string
    className?: string
}

export const ReportLoading: React.FC<ReportLoadingProps> = ({ isDark, reportName, height, className }) => (
    <div
        className={cn(
            'flex flex-col items-center justify-center rounded-lg border',
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
            className
        )}
        style={{ height }}
    >
        <Loader2 className={cn('w-8 h-8 animate-spin mb-3', isDark ? 'text-blue-400' : 'text-blue-600')} />
        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Carregando relatório {reportName}...
        </p>
    </div>
)

interface ReportErrorProps {
    isDark: boolean
    error: string
    height: string
    className?: string
}

export const ReportError: React.FC<ReportErrorProps> = ({ isDark, error, height, className }) => (
    <div
        className={cn(
            'flex flex-col items-center justify-center rounded-lg border',
            isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200',
            className
        )}
        style={{ height }}
    >
        <AlertCircle className={cn('w-8 h-8 mb-3', isDark ? 'text-red-400' : 'text-red-600')} />
        <p className={cn('text-sm font-medium mb-1', isDark ? 'text-red-300' : 'text-red-700')}>{error}</p>
        <p className={cn('text-xs', isDark ? 'text-red-400' : 'text-red-600')}>
            Verifique as configurações do Power BI
        </p>
    </div>
)
