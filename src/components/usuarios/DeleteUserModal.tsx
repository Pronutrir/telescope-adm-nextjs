'use client'

import React, { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { UserShieldUser } from '@/services/userShieldService'

interface DeleteUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    user: UserShieldUser | null
}

/**
 * Modal de Confirmação de Exclusão de Usuário
 * 
 * @description
 * Modal com confirmação dupla (digitação do nome do usuário) para excluir usuários.
 * Faz DELETE na API /api/usershield/usuarios/[id]
 */
export default function DeleteUserModal({ isOpen, onClose, onSuccess, user }: DeleteUserModalProps) {
    const { isDark } = useTheme()
    const { showSuccess, showError } = useNotifications()
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmText, setConfirmText] = useState('')

    if (!isOpen || !user) return null

    const canDelete = confirmText.toLowerCase() === user.name?.toLowerCase()

    const handleDelete = async () => {
        if (!canDelete) return

        setIsDeleting(true)

        try {
            const response = await fetch(`/api/usershield/usuarios/${user.id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao excluir usuário')
            }

            showSuccess('Usuário excluído com sucesso')
            onSuccess()
            handleClose()
        } catch (error: any) {
            console.error('❌ Erro ao excluir usuário:', error)
            showError(error.message || 'Erro ao excluir usuário')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleClose = () => {
        setConfirmText('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className={twMerge(
                    'w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden',
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                )}
            >
                {/* Header */}
                <div className={twMerge(
                    'flex items-center justify-between p-6 border-b',
                    isDark ? 'border-gray-700 bg-red-900/20' : 'border-gray-200 bg-red-50'
                )}>
                    <div className="flex items-center gap-3">
                        <div className={twMerge(
                            'p-2 rounded-lg',
                            isDark ? 'bg-red-900/50' : 'bg-red-100'
                        )}>
                            <AlertTriangle className={twMerge(
                                'w-6 h-6',
                                isDark ? 'text-red-400' : 'text-red-600'
                            )} />
                        </div>
                        <h2 className={twMerge(
                            'text-xl font-bold',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            Excluir Usuário
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isDeleting}
                        className={twMerge(
                            'p-2 rounded-lg transition-all',
                            isDark
                                ? 'hover:bg-gray-700 text-gray-400'
                                : 'hover:bg-gray-100 text-gray-500'
                        )}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Aviso */}
                    <div className={twMerge(
                        'p-4 rounded-lg border-l-4',
                        isDark
                            ? 'bg-red-900/20 border-red-500'
                            : 'bg-red-50 border-red-500'
                    )}>
                        <p className={twMerge(
                            'font-semibold mb-2',
                            isDark ? 'text-red-300' : 'text-red-700'
                        )}>
                            ⚠️ Ação Irreversível
                        </p>
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-red-200' : 'text-red-600'
                        )}>
                            Esta ação não pode ser desfeita. Todos os dados do usuário serão permanentemente removidos do sistema.
                        </p>
                    </div>

                    {/* User Info */}
                    <div className={twMerge(
                        'p-4 rounded-lg border',
                        isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={twMerge(
                                'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg',
                                isDark ? 'bg-red-600' : 'bg-red-500'
                            )}>
                                {user.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={twMerge(
                                    'font-semibold truncate',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    {user.name}
                                </h3>
                                <p className={twMerge(
                                    'text-sm truncate',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        {user.userName && (
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                <span className="font-medium">Username:</span> @{user.userName}
                            </p>
                        )}
                    </div>

                    {/* Confirmation Input */}
                    <div className="space-y-2">
                        <label className={twMerge(
                            'block text-sm font-medium',
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Para confirmar, digite o nome do usuário:
                        </label>
                        <p className={twMerge(
                            'text-sm font-mono p-2 rounded border',
                            isDark
                                ? 'bg-gray-900/50 border-gray-700 text-gray-300'
                                : 'bg-gray-50 border-gray-300 text-gray-700'
                        )}>
                            {user.name}
                        </p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Digite o nome aqui"
                            disabled={isDeleting}
                            className={twMerge(
                                'w-full px-4 py-2 rounded-lg border transition-all',
                                isDark
                                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
                                'focus:outline-none focus:ring-2',
                                isDark ? 'focus:ring-red-500' : 'focus:ring-red-400',
                                isDeleting && 'opacity-50 cursor-not-allowed'
                            )}
                        />
                        {confirmText && !canDelete && (
                            <p className={twMerge(
                                'text-xs',
                                isDark ? 'text-red-400' : 'text-red-500'
                            )}>
                                O nome digitado não corresponde
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={twMerge(
                    'flex gap-3 p-6 border-t',
                    isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
                )}>
                    <button
                        onClick={handleClose}
                        disabled={isDeleting}
                        className={twMerge(
                            'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all',
                            isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                            isDeleting && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={!canDelete || isDeleting}
                        className={twMerge(
                            'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
                            canDelete && !isDeleting
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-50'
                        )}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Excluindo...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Excluir Usuário
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
