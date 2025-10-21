'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotifications } from '@/contexts/NotificationContext'
import {
    X,
    User,
    Mail,
    Key,
    Loader2,
    Shield,
    Eye,
    EyeOff,
    UserPlus
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface AddUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const { isDark } = useTheme()
    const notify = useNotifications()
    
    const [mounted, setMounted] = useState(false)
    const [creating, setCreating] = useState(false)
    
    // Dados do formulário
    const [name, setName] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [ativo, setAtivo] = useState(true)
    const [integraApi, setIntegraApi] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Resetar formulário quando modal abre
    useEffect(() => {
        if (isOpen) {
            setName('')
            setUserName('')
            setEmail('')
            setPassword('')
            setConfirmPassword('')
            setShowPassword(false)
            setShowConfirm(false)
            setAtivo(true)
            setIntegraApi(false)
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

        return {
            valid: errors.length === 0,
            errors
        }
    }

    const handleCreate = async () => {
        try {
            setCreating(true)

            // Validações
            if (!name.trim()) {
                notify.showError('Nome é obrigatório', {
                    title: 'Validação',
                    duration: 5000
                })
                return
            }

            if (!userName.trim()) {
                notify.showError('Nome de usuário é obrigatório', {
                    title: 'Validação',
                    duration: 5000
                })
                return
            }

            if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                notify.showError('Email válido é obrigatório', {
                    title: 'Validação',
                    duration: 5000
                })
                return
            }

            // Validar senha
            const validation = validatePassword(password)
            if (!validation.valid) {
                notify.showError(`Senha inválida: ${validation.errors.join(', ')}`, {
                    title: 'Validação de Senha',
                    duration: 5000
                })
                return
            }

            // Verificar se senhas conferem
            if (password !== confirmPassword) {
                notify.showError('As senhas não conferem', {
                    title: 'Validação de Senha',
                    duration: 5000
                })
                return
            }

            // Chamar API para criar usuário
            const response = await fetch('/api/usershield/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    userName,
                    email,
                    password,
                    ativo,
                    integraApi
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Erro ao criar usuário')
            }

            notify.showSuccess('Usuário criado com sucesso!', {
                title: 'Sucesso',
                duration: 3000
            })

            // Chamar callback de sucesso
            onSuccess?.()

            // Fechar modal
            setTimeout(() => {
                onClose()
            }, 1000)

        } catch (error: any) {
            console.error('❌ [AddUser] Erro:', error)
            notify.showError(error.message || 'Erro ao criar usuário', {
                title: 'Erro',
                duration: 0,
                actions: [
                    {
                        label: 'Tentar novamente',
                        onClick: () => handleCreate(),
                        variant: 'primary'
                    }
                ]
            })
        } finally {
            setCreating(false)
        }
    }

    if (!isOpen || !mounted) return null

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={(e) => {
                if (e.target === e.currentTarget && !creating) {
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
                            <UserPlus className={twMerge(
                                'w-5 h-5',
                                isDark ? 'text-blue-400' : 'text-blue-600'
                            )} />
                        </div>
                        <div>
                            <h2 className={twMerge(
                                'text-xl font-bold',
                                isDark ? 'text-white' : 'text-gray-900'
                            )}>
                                Adicionar Usuário
                            </h2>
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                Criar novo usuário no sistema
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={creating}
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
                    {/* Warning */}
                    <div className={twMerge(
                        'flex items-start gap-3 p-4 rounded-lg border',
                        isDark
                            ? 'bg-blue-900/10 border-blue-800/30 text-blue-200'
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                    )}>
                        <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium mb-1">Informações importantes:</p>
                            <p className="opacity-90">
                                O usuário receberá um email com as credenciais de acesso. Certifique-se de que o email está correto.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome */}
                        <div className="md:col-span-2">
                            <label className={twMerge(
                                'block text-sm font-semibold mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Nome Completo *
                            </label>
                            <div className="relative">
                                <User className={twMerge(
                                    'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={creating}
                                    placeholder="Ex: João Silva"
                                    className={twMerge(
                                        'w-full pl-10 pr-4 py-3 rounded-lg border transition-all',
                                        'focus:outline-none focus:ring-2',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500/50'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50'
                                    )}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className={twMerge(
                                'block text-sm font-semibold mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Nome de Usuário *
                            </label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                disabled={creating}
                                placeholder="Ex: joao.silva"
                                className={twMerge(
                                    'w-full px-4 py-3 rounded-lg border transition-all',
                                    'focus:outline-none focus:ring-2',
                                    isDark
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500/50'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50'
                                )}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className={twMerge(
                                'block text-sm font-semibold mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className={twMerge(
                                    'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={creating}
                                    placeholder="Ex: joao@email.com"
                                    className={twMerge(
                                        'w-full pl-10 pr-4 py-3 rounded-lg border transition-all',
                                        'focus:outline-none focus:ring-2',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500/50'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50'
                                    )}
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div>
                            <label className={twMerge(
                                'block text-sm font-semibold mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Senha *
                            </label>
                            <div className="relative">
                                <Key className={twMerge(
                                    'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={creating}
                                    placeholder="Digite a senha"
                                    className={twMerge(
                                        'w-full pl-10 pr-12 py-3 rounded-lg border transition-all',
                                        'focus:outline-none focus:ring-2',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500/50'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50'
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-700/50"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                            <label className={twMerge(
                                'block text-sm font-semibold mb-2',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}>
                                Confirmar Senha *
                            </label>
                            <div className="relative">
                                <Key className={twMerge(
                                    'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )} />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={creating}
                                    placeholder="Confirme a senha"
                                    className={twMerge(
                                        'w-full pl-10 pr-12 py-3 rounded-lg border transition-all',
                                        'focus:outline-none focus:ring-2',
                                        isDark
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500/50'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50'
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-700/50"
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
                            'md:col-span-2 p-3 rounded-lg text-xs',
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
                                    <span className={password.length >= 6 ? 'text-green-500' : ''}>
                                        {password.length >= 6 ? '✓' : '•'}
                                    </span>
                                    Mínimo 6 caracteres
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={/\d/.test(password) ? 'text-green-500' : ''}>
                                        {/\d/.test(password) ? '✓' : '•'}
                                    </span>
                                    Pelo menos 1 número
                                </li>
                            </ul>
                        </div>

                        {/* Opções */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={ativo}
                                    onChange={(e) => setAtivo(e.target.checked)}
                                    disabled={creating}
                                    className="w-4 h-4 rounded"
                                />
                                <span className={twMerge(
                                    'text-sm',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Usuário ativo (pode fazer login)
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={integraApi}
                                    onChange={(e) => setIntegraApi(e.target.checked)}
                                    disabled={creating}
                                    className="w-4 h-4 rounded"
                                />
                                <span className={twMerge(
                                    'text-sm',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Integra com API externa
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={twMerge(
                    'flex items-center justify-end gap-3 p-6 border-t',
                    isDark ? 'border-gray-700' : 'border-gray-200'
                )}>
                    <button
                        onClick={onClose}
                        disabled={creating}
                        className={twMerge(
                            'px-6 py-2.5 rounded-lg font-medium transition-all',
                            isDark
                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className={twMerge(
                            'px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2',
                            'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                        )}
                    >
                        {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                        {creating ? 'Criando...' : 'Criar Usuário'}
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}

export default AddUserModal
