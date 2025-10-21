'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '@/contexts/ThemeContext'
import {
    X,
    Shield,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Save,
    User
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { userShieldService, UserShieldProfile } from '@/services/userShieldService'

interface EditUserModalProps {
    user: {
        id: string  // ID vem como string da API UserShield
        name: string
        email: string
        userName: string
        perfis?: {
            id: number  // Alinhado com UserShieldUser
            nomePerfil: string
        }[]
    }
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
    const { isDark } = useTheme()
    const [availableProfiles, setAvailableProfiles] = useState<UserShieldProfile[]>([])
    const [selectedProfiles, setSelectedProfiles] = useState<number[]>([])
    const [initialProfiles, setInitialProfiles] = useState<number[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [mounted, setMounted] = useState(false)

    // Garantir que está no cliente
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            loadData()
        }
    }, [isOpen, user.id])

    const loadData = async () => {
        try {
            setLoading(true)
            setMessage(null)

            // Carregar perfis disponíveis e perfis do usuário
            // Converter user.id de string para number
            const userId = parseInt(user.id)
            console.log('🔍 [EditUserModal] Carregando dados para usuário ID:', userId)
            console.log('🔍 [EditUserModal] user.id original:', user.id, 'tipo:', typeof user.id)
            
            // Timeout de 25 segundos para a operação completa
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout ao carregar dados. Tente novamente.')), 25000)
            )
            
            const dataPromise = Promise.all([
                userShieldService.listarPerfis(),
                userShieldService.obterPerfisUsuario(userId)
            ])
            
            const [profiles, userProfiles] = await Promise.race([
                dataPromise,
                timeoutPromise
            ]) as [any[], any[]]

            console.log('✅ [EditUserModal] Perfis disponíveis:', profiles.length)
            console.log('✅ [EditUserModal] Perfis do usuário:', userProfiles.length)

            setAvailableProfiles(profiles)
            
            // profile.id já é number, não precisa converter
            const profileIds = userProfiles.map(p => p.id)
            setSelectedProfiles(profileIds)
            setInitialProfiles(profileIds)
        } catch (error: any) {
            console.error('❌ [EditUserModal] Erro ao carregar dados:', error)
            console.error('❌ [EditUserModal] Error message:', error?.message)
            console.error('❌ [EditUserModal] Error stack:', error?.stack)
            
            const errorMessage = error?.message?.includes('Timeout') 
                ? 'Tempo esgotado ao carregar dados. Por favor, tente novamente.'
                : error?.message || 'Erro ao carregar dados'
            
            setMessage({
                type: 'error',
                text: errorMessage
            })
        } finally {
            setLoading(false)
        }
    }

    const handleToggleProfile = (profileId: number) => {
        setSelectedProfiles(prev => {
            if (prev.includes(profileId)) {
                return prev.filter(id => id !== profileId)
            } else {
                return [...prev, profileId]
            }
        })
    }

    const handleSave = async () => {
        // Validação: deve ter pelo menos 1 perfil
        if (selectedProfiles.length === 0) {
            setMessage({
                type: 'error',
                text: 'Usuário deve ter pelo menos um perfil.'
            })
            return
        }

        try {
            setSaving(true)
            setMessage(null)

            // Converter id de string para number
            const userId = parseInt(user.id)
            await userShieldService.atualizarPerfisUsuario(userId, selectedProfiles)

            setMessage({
                type: 'success',
                text: 'Perfis atualizados com sucesso!'
            })

            // Atualizar perfis iniciais
            setInitialProfiles(selectedProfiles)

            // Chamar callback de sucesso
            onSuccess?.()

            // Fechar modal após 1.5s
            setTimeout(() => {
                onClose()
            }, 1500)

        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Erro ao atualizar perfis'
            })
        } finally {
            setSaving(false)
        }
    }

    const hasChanges = () => {
        const currentIds = [...initialProfiles].sort()
        const selectedIds = [...selectedProfiles].sort()
        return JSON.stringify(currentIds) !== JSON.stringify(selectedIds)
    }

    if (!isOpen || !mounted) return null

    const modalContent = (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={(e) => {
                // Fechar ao clicar no backdrop (fora do modal)
                if (e.target === e.currentTarget && !saving) {
                    onClose()
                }
            }}
        >
            <div 
                className={twMerge(
                    'w-full max-w-2xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col',
                    'animate-in zoom-in-95 slide-in-from-bottom-4 duration-200',
                    isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={twMerge(
                    'flex items-center justify-between p-6 border-b',
                    isDark ? 'border-gray-700' : 'border-gray-200'
                )}>
                    <div className="flex items-center gap-3">
                        <div className={twMerge(
                            'p-2 rounded-lg',
                            isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                        )}>
                            <User className={twMerge(
                                'w-5 h-5',
                                isDark ? 'text-blue-400' : 'text-blue-600'
                            )} />
                        </div>
                        <div>
                            <h2 className={twMerge(
                                'text-xl font-bold',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                Editar Usuário
                            </h2>
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                {user.name} • @{user.userName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className={twMerge(
                            'p-2 rounded-lg transition-all',
                            isDark
                                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        )}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Message */}
                    {message && (
                        <div className={twMerge(
                            'flex flex-col gap-3 p-4 rounded-lg border',
                            message.type === 'success'
                                ? isDark
                                    ? 'bg-green-900/20 border-green-800 text-green-200'
                                    : 'bg-green-50 border-green-200 text-green-700'
                                : isDark
                                    ? 'bg-red-900/20 border-red-800 text-red-200'
                                    : 'bg-red-50 border-red-200 text-red-700'
                        )}>
                            <div className="flex items-center gap-3">
                                {message.type === 'success' ? (
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                )}
                                <p className="text-sm font-medium flex-1">{message.text}</p>
                            </div>
                            {message.type === 'error' && (
                                <button
                                    onClick={loadData}
                                    disabled={loading}
                                    className={twMerge(
                                        'text-sm font-medium px-4 py-2 rounded-lg transition-all',
                                        isDark
                                            ? 'bg-red-800 hover:bg-red-700 text-white'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    )}
                                >
                                    Tentar Novamente
                                </button>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <div className="text-center">
                                <p className={twMerge(
                                    'text-sm font-medium',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Carregando perfis do usuário...
                                </p>
                                <p className={twMerge(
                                    'text-xs mt-1',
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                )}>
                                    Isso pode levar alguns segundos
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Perfis Atuais */}
                            <div>
                                <h3 className={twMerge(
                                    'text-sm font-semibold mb-3 flex items-center gap-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    <Shield className="w-4 h-4" />
                                    Perfis Atuais
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {initialProfiles.length > 0 ? (
                                        initialProfiles
                                            .map(profileId => availableProfiles.find(p => p.id === profileId))
                                            .filter(profile => profile !== undefined)
                                            .map(profile => (
                                                <span
                                                    key={profile.id}
                                                    className={twMerge(
                                                        'px-3 py-1.5 text-sm font-medium rounded-full',
                                                        isDark
                                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    )}
                                                >
                                                    {profile.nomePerfil}
                                                </span>
                                            ))
                                    ) : (
                                        <p className={twMerge(
                                            'text-sm',
                                            isDark ? 'text-gray-500' : 'text-gray-500'
                                        )}>
                                            Nenhum perfil atribuído
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Perfis Disponíveis */}
                            <div>
                                <h3 className={twMerge(
                                    'text-sm font-semibold mb-3',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Selecionar Perfis
                                </h3>
                                <div className="space-y-2">
                                    {availableProfiles.map(profile => (
                                        <label
                                            key={profile.id}
                                            className={twMerge(
                                                'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                                                selectedProfiles.includes(profile.id)
                                                    ? isDark
                                                        ? 'bg-blue-500/10 border-blue-500/30'
                                                        : 'bg-blue-50 border-blue-200'
                                                    : isDark
                                                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedProfiles.includes(profile.id)}
                                                onChange={() => handleToggleProfile(profile.id)}
                                                disabled={saving}
                                                className={twMerge(
                                                    'mt-0.5 w-4 h-4 rounded border-2 transition-all',
                                                    'checked:bg-primary checked:border-primary',
                                                    isDark ? 'border-gray-600' : 'border-gray-300'
                                                )}
                                            />
                                            <div className="flex-1">
                                                <div className={twMerge(
                                                    'font-medium text-sm',
                                                    isDark ? 'text-white' : 'text-gray-900'
                                                )}>
                                                    {profile.nomePerfil}
                                                </div>
                                                {profile.descricao && (
                                                    <div className={twMerge(
                                                        'text-xs mt-1',
                                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                                    )}>
                                                        {profile.descricao}
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className={twMerge(
                    'flex items-center justify-end gap-3 p-6 border-t',
                    isDark ? 'border-gray-700' : 'border-gray-200'
                )}>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className={twMerge(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            isDark
                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || loading || !hasChanges()}
                        className={twMerge(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            'bg-primary text-primary-foreground hover:bg-primary/90',
                            (saving || loading || !hasChanges()) && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )

    // Renderizar usando portal no body
    return createPortal(modalContent, document.body)
}
