'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotifications } from '@/contexts/NotificationContext'
import {
    X,
    Key,
    Loader2,
    Shield,
    Eye,
    EyeOff,
    RefreshCw
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface ResetPasswordModalProps {
    user: {
        id: string | number
        name: string
        userName: string
        email?: string
    }
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

type ResetMode = 'default' | 'custom'

export default function ResetPasswordModal({ user, isOpen, onClose, onSuccess }: ResetPasswordModalProps) {
    const { isDark } = useTheme()
    const notify = useNotifications()
    const [resetMode, setResetMode] = useState<ResetMode>('default')
    const [customPassword, setCustomPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [resetting, setResetting] = useState(false)
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    // Garantir que está no cliente
    useEffect(() => {
        setMounted(true)
    }, [])

    // Resetar estado quando modal abre
    useEffect(() => {
        if (isOpen) {
            setResetMode('default')
            setCustomPassword('')
            setConfirmPassword('')
            setShowPassword(false)
            setShowConfirm(false)
            setGeneratedPassword(null)
        }
    }, [isOpen])

    const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
        const errors: string[] = []

        if (password.length < 6) {
            errors.push('Mínimo de 6 caracteres')
        }
        if (!/\d/.test(password)) {
            errors.push('Pelo menos 1 número')
        }

        return { valid: errors.length === 0, errors }
    }

    const generateDefaultPassword = (): string => {
        // Gera senha padrão: Pronutrir@{ano vigente}
        const currentYear = new Date().getFullYear()
        return `Pronutrir@${currentYear}`
    }

    const handleReset = async () => {
        try {
            setResetting(true)

            let newPassword: string

            if (resetMode === 'default') {
                newPassword = generateDefaultPassword()
            } else {
                // Validar senha customizada
                const validation = validatePassword(customPassword)
                if (!validation.valid) {
                    notify.showError(`Senha inválida: ${validation.errors.join(', ')}`, {
                        title: 'Validação de Senha',
                        duration: 5000
                    })
                    return
                }

                // Verificar se senhas conferem
                if (customPassword !== confirmPassword) {
                    notify.showError('As senhas não conferem', {
                        title: 'Validação de Senha',
                        duration: 5000
                    })
                    return
                }

                newPassword = customPassword
            }

            // Chamar API de reset
            const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id
            const response = await fetch(`/api/usershield/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword,
                    ativo: true,
                    integraApi: true
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao resetar senha')
            }

            // Guardar senha gerada para mostrar no modal
            if (resetMode === 'default') {
                setGeneratedPassword(newPassword)
                
                notify.showSuccess(`Senha resetada com sucesso!\n\nNova senha: ${newPassword}\n\nCopie a senha e compartilhe com segurança.`, {
                    title: 'Reset de Senha',
                    duration: 0,
                    actions: [
                        {
                            label: 'Copiar Senha',
                            onClick: () => {
                                navigator.clipboard.writeText(newPassword)
                                notify.showSuccess('Senha copiada!', {
                                    title: 'Área de Transferência',
                                    duration: 3000
                                })
                            },
                            variant: 'primary'
                        },
                        {
                            label: 'Fechar',
                            onClick: () => onClose(),
                            variant: 'ghost'
                        }
                    ]
                })
            } else {
                notify.showSuccess('Senha resetada com sucesso!', {
                    title: 'Reset de Senha',
                    duration: 3000
                })
                
                setTimeout(() => {
                    onClose()
                }, 2000)
            }

            // Chamar callback de sucesso
            onSuccess?.()

        } catch (error: any) {
            console.error('❌ [ResetPassword] Erro:', error)
            notify.showError(error.message || 'Erro ao resetar senha', {
                title: 'Erro no Reset',
                duration: 0,
                actions: [
                    {
                        label: 'Tentar novamente',
                        onClick: () => handleReset(),
                        variant: 'primary'
                    }
                ]
            })
        } finally {
            setResetting(false)
        }
    }

    if (!isOpen || !mounted) return null

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={(e) => {
                if (e.target === e.currentTarget && !resetting) {
                    onClose()
                }
            }}
        >
            <div
                className={twMerge(
                    'w-full max-w-md max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col',
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
                            isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
                        )}>
                            <Key className={twMerge(
                                'w-6 h-6 usuarios-key-icon',
                                isDark ? 'text-blue-400' : 'text-blue-600'
                            )} />
                        </div>
                        <div>
                            <h2 className={twMerge(
                                'text-xl font-bold',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                Resetar Senha
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
                        disabled={resetting}
                        className={twMerge(
                            'p-2 rounded-lg transition-all',
                            isDark
                                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        )}
                    >
                        <X className="w-5 h-5 usuarios-close-icon" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Warning */}
                    <div className={twMerge(
                        'flex items-start gap-3 p-4 rounded-lg border',
                        isDark
                            ? 'bg-yellow-900/10 border-yellow-800/30 text-yellow-200'
                            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    )}>
                        <Shield className="w-5 h-5 shrink-0 mt-0.5 usuarios-shield-icon" />
                        <div className="text-sm">
                            <p className="font-medium mb-1">Atenção:</p>
                            <p className="opacity-90">
                                Ao resetar a senha, o usuário será notificado e deverá usar a nova senha no próximo login.
                            </p>
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div>
                        <label className={twMerge(
                            'block text-sm font-semibold mb-3',
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Tipo de Reset
                        </label>
                        <div className="space-y-2">
                            <label className={twMerge(
                                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                                resetMode === 'default'
                                    ? isDark
                                        ? 'bg-blue-500/10 border-blue-500/30'
                                        : 'bg-blue-50 border-blue-200'
                                    : isDark
                                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                            )}>
                                <input
                                    type="radio"
                                    name="resetMode"
                                    value="default"
                                    checked={resetMode === 'default'}
                                    onChange={(e) => setResetMode(e.target.value as ResetMode)}
                                    disabled={resetting}
                                    className="w-4 h-4"
                                />
                                <div className="flex-1">
                                    <div className={twMerge(
                                        'font-medium text-sm',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        <RefreshCw className="w-4 h-4 inline mr-2 usuarios-refresh-icon" />
                                        Senha Padrão (Recomendado)
                                    </div>
                                    <div className={twMerge(
                                        'text-xs mt-1',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        Pronutrir@{new Date().getFullYear()}
                                    </div>
                                </div>
                            </label>

                            <label className={twMerge(
                                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                                resetMode === 'custom'
                                    ? isDark
                                        ? 'bg-blue-500/10 border-blue-500/30'
                                        : 'bg-blue-50 border-blue-200'
                                    : isDark
                                        ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                            )}>
                                <input
                                    type="radio"
                                    name="resetMode"
                                    value="custom"
                                    checked={resetMode === 'custom'}
                                    onChange={(e) => setResetMode(e.target.value as ResetMode)}
                                    disabled={resetting}
                                    className="w-4 h-4"
                                />
                                <div className="flex-1">
                                    <div className={twMerge(
                                        'font-medium text-sm',
                                        isDark ? 'text-white' : 'text-gray-900'
                                    )}>
                                        <Key className="w-4 h-4 inline mr-2 usuarios-key-icon" />
                                        Senha Personalizada
                                    </div>
                                    <div className={twMerge(
                                        'text-xs mt-1',
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                    )}>
                                        Definir senha manualmente
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Custom Password Fields */}
                    {resetMode === 'custom' && (
                        <div className="space-y-4">
                            {/* New Password */}
                            <div>
                                <label className={twMerge(
                                    'block text-sm font-medium mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Nova Senha
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={customPassword}
                                        onChange={(e) => setCustomPassword(e.target.value)}
                                        disabled={resetting}
                                        className={twMerge(
                                            'w-full px-3 py-2 pr-10 rounded-lg border transition-all',
                                            isDark
                                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500',
                                            'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                                        )}
                                        placeholder="Digite a nova senha"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-700/50"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className={twMerge(
                                    'block text-sm font-medium mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Confirmar Senha
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={resetting}
                                        className={twMerge(
                                            'w-full px-3 py-2 pr-10 rounded-lg border transition-all',
                                            isDark
                                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500',
                                            'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                                        )}
                                        placeholder="Confirme a nova senha"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-700/50"
                                    >
                                        {showConfirm ? (
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className={twMerge(
                                'p-3 rounded-lg text-xs',
                                isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                            )}>
                                <p className={twMerge(
                                    'font-medium mb-2',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    A senha deve conter:
                                </p>
                                <ul className={twMerge(
                                    'space-y-1',
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                )}>
                                    <li className="flex items-center gap-2">
                                        <span className={customPassword.length >= 6 ? 'text-green-500' : ''}>
                                            {customPassword.length >= 6 ? '✓' : '•'}
                                        </span>
                                        Mínimo 6 caracteres
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className={/\d/.test(customPassword) ? 'text-green-500' : ''}>
                                            {/\d/.test(customPassword) ? '✓' : '•'}
                                        </span>
                                        Pelo menos 1 número
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={twMerge(
                    'flex items-center justify-end gap-3 p-6 border-t',
                    isDark ? 'border-gray-700' : 'border-gray-200'
                )}>
                    <button
                        onClick={onClose}
                        disabled={resetting}
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
                        onClick={handleReset}
                        disabled={resetting || (resetMode === 'custom' && (!customPassword || !confirmPassword))}
                        className={twMerge(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            'bg-yellow-600 text-white hover:bg-yellow-700',
                            (resetting || (resetMode === 'custom' && (!customPassword || !confirmPassword))) && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        {resetting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin usuarios-loader-icon" />
                                Resetando...
                            </>
                        ) : (
                            <>
                                <Key className="w-4 h-4 usuarios-key-icon" />
                                Resetar Senha
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
