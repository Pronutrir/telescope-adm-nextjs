'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X, Users, Shield, Package } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getPowerBIWorkspaceUsers } from '@/app/actions/powerbi/embed'
import { UserGroupSection } from './UserGroupSection'
import type { WorkspaceUser } from './types'

interface WorkspaceUsersModalProps {
    isOpen: boolean
    onClose: () => void
}

export const WorkspaceUsersModal: React.FC<WorkspaceUsersModalProps> = ({ isOpen, onClose }) => {
    const { isDark } = useTheme()
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<WorkspaceUser[]>([])
    const [groups, setGroups] = useState<WorkspaceUser[]>([])
    const [apps, setApps] = useState<WorkspaceUser[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) loadUsers()
    }, [isOpen])

    const loadUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await getPowerBIWorkspaceUsers()
            if (result.sucesso) {
                setUsers(result.users)
                setGroups(result.groups)
                setApps(result.apps)
            } else {
                setError(result.erro || 'Erro ao carregar usuários')
            }
        } catch {
            setError('Erro ao carregar usuários do workspace')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const textCls = isDark ? 'text-gray-400' : 'text-gray-600'
    const isEmpty = !loading && !error && users.length === 0 && groups.length === 0 && apps.length === 0

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={cn('relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl', isDark ? 'bg-gray-900' : 'bg-white')}>
                <div className={cn('sticky top-0 z-10 px-6 py-4 border-b', isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200')}>
                    <div className="flex items-center justify-between">
                        <h2 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>👥 Usuários e Grupos do Workspace</h2>
                        <button onClick={onClose} aria-label="Fechar modal"
                            className={cn('p-2 rounded-lg transition-colors', isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900')}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                            <p className={textCls}>Carregando usuários e grupos...</p>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
                            <p className="text-red-800 dark:text-red-300">❌ {error}</p>
                        </div>
                    )}
                    {!loading && !error && (
                        <>
                            <UserGroupSection title="Usuários" icon={<Users className="w-5 h-5 text-blue-500" />} list={users} isDark={isDark} />
                            <UserGroupSection title="Grupos" icon={<Shield className="w-5 h-5 text-green-500" />} list={groups} isDark={isDark} />
                            <UserGroupSection title="Service Principals / Apps" icon={<Package className="w-5 h-5 text-purple-500" />} list={apps} isDark={isDark} />
                            {isEmpty && <div className="text-center py-12"><p className={textCls}>Nenhum usuário ou grupo encontrado no workspace.</p></div>}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
