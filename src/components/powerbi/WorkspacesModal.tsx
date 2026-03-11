'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X, Folder } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getPowerBIWorkspaces } from '@/app/actions/powerbi/embed'
import { WorkspaceCard } from './WorkspaceCard'
import type { Workspace } from './types'

interface WorkspacesModalProps {
    isOpen: boolean
    onClose: () => void
}

export const WorkspacesModal: React.FC<WorkspacesModalProps> = ({ isOpen, onClose }) => {
    const { isDark } = useTheme()
    const [loading, setLoading] = useState(false)
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) loadWorkspaces()
    }, [isOpen])

    const loadWorkspaces = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await getPowerBIWorkspaces()
            if (result.sucesso) setWorkspaces(result.workspaces)
            else setError(result.erro || 'Erro ao carregar workspaces')
        } catch {
            setError('Erro ao carregar workspaces')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const panelCls = cn('sticky top-0 z-10 px-6 py-4 border-b', isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200')
    const textCls = isDark ? 'text-gray-400' : 'text-gray-600'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={cn('relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl', isDark ? 'bg-gray-900' : 'bg-white')}>
                <div className={panelCls}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>🏢 Workspaces do Power BI</h2>
                            <p className={cn('text-sm mt-1', textCls)}>Workspaces acessíveis pelo Service Principal</p>
                        </div>
                        <button onClick={onClose} aria-label="Fechar modal"
                            className={cn('p-2 rounded-lg transition-colors', isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900')}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 100px)' }}>
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                            <p className={textCls}>Carregando workspaces...</p>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
                            <p className="text-red-800 dark:text-red-300">❌ {error}</p>
                        </div>
                    )}
                    {!loading && !error && workspaces.length === 0 && (
                        <div className="text-center py-12">
                            <Folder className={cn('w-16 h-16 mx-auto mb-4', textCls)} />
                            <p className={textCls}>Nenhum workspace encontrado.</p>
                        </div>
                    )}
                    {!loading && !error && workspaces.length > 0 && (
                        <div className="space-y-3">
                            {workspaces.map((w) => <WorkspaceCard key={w.id} workspace={w} isDark={isDark} />)}
                        </div>
                    )}
                </div>

                {!loading && !error && workspaces.length > 0 && (
                    <div className={cn('sticky bottom-0 px-6 py-3 border-t', isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200')}>
                        <div className="flex items-center justify-between text-sm">
                            <span className={textCls}>Total: {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}</span>
                            <span className={textCls}>{workspaces.filter(w => w.isOnDedicatedCapacity).length} com capacidade dedicada</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
