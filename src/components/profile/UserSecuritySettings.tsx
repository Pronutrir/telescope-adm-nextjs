'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

/**
 * Componente de Configurações de Segurança do Usuário
 * 
 * Gerencia a alteração de senha do usuário através da API UserShield.
 * 
 * @component
 * @description
 * - Valida senha atual, nova senha e confirmação
 * - Mostra indicador de força da senha
 * - Integra com API proxy /api/auth/update-password
 * - API proxy adiciona automaticamente o username (email) do usuário autenticado
 * - Utiliza sessão Redis para obter dados do usuário
 * - Token de admin é gerenciado automaticamente pela API com cache Redis
 * 
 * @endpoint POST /api/auth/update-password
 * @payload { idUsuario: number, password: string, newPassword: string }
 * @auth session_id cookie (Redis session)
 */
interface UserSecuritySettingsProps {
    onChangePassword: (data: {
        currentPassword: string
        newPassword: string
    }) => Promise<void>
    user: {
        id: number
        email: string
    }
    isDark?: boolean
}

const validationSchema = Yup.object({
    currentPassword: Yup
        .string()
        .required('Senha atual é obrigatória'),
    newPassword: Yup
        .string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres')
        .matches(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
        .matches(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
        .matches(/[0-9]/, 'Deve conter pelo menos um número')
        .matches(/[@$!%*?&#]/, 'Deve conter pelo menos um caractere especial (@$!%*?&#)')
        .required('Nova senha é obrigatória'),
    confirmPassword: Yup
        .string()
        .oneOf([Yup.ref('newPassword')], 'As senhas não coincidem')
        .required('Confirmação de senha é obrigatória')
})

export const UserSecuritySettings: React.FC<UserSecuritySettingsProps> = ({
    onChangePassword,
    user,
    isDark = false
}) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true)

            try {
                await onChangePassword({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                })
                
                // Limpar formulário em caso de sucesso
                resetForm()
                
            } catch (error: any) {
                // Erro já é tratado pela página com notificação global
                console.error('Erro no formulário:', error)
            } finally {
                setIsLoading(false)
            }
        }
    })

    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: '', color: '' }
        
        let strength = 0
        if (password.length >= 8) strength++
        if (password.length >= 12) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[@$!%*?&#]/.test(password)) strength++

        if (strength <= 2) {
            return { 
                strength: 25, 
                label: 'Fraca', 
                color: isDark ? 'bg-red-500' : 'bg-red-600' 
            }
        } else if (strength <= 4) {
            return { 
                strength: 50, 
                label: 'Média', 
                color: isDark ? 'bg-yellow-500' : 'bg-yellow-600' 
            }
        } else if (strength <= 5) {
            return { 
                strength: 75, 
                label: 'Boa', 
                color: isDark ? 'bg-blue-500' : 'bg-blue-600' 
            }
        } else {
            return { 
                strength: 100, 
                label: 'Forte', 
                color: isDark ? 'bg-green-500' : 'bg-green-600' 
            }
        }
    }

    const passwordStrength = getPasswordStrength(formik.values.newPassword)

    return (
        <div className={`
            p-8 rounded-xl border shadow-lg
            ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}
        `}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Shield className="w-8 h-8 profile-header-icon" />
                <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Segurança
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Altere sua senha regularmente para manter sua conta segura
                    </p>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Senha Atual */}
                <div className="space-y-2">
                    <Input
                        label="Senha Atual"
                        name="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.currentPassword && formik.errors.currentPassword}
                        icon={Lock}
                        placeholder="Digite sua senha atual"
                        required
                        isDark={isDark}
                    />
                    <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className={`
                            text-sm flex items-center gap-2 p-2
                            ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}
                        `}
                    >
                        {showCurrentPassword ? (
                            <><EyeOff className="w-4 h-4 text-button-icon" /> Ocultar senha</>
                        ) : (
                            <><Eye className="w-4 h-4 text-button-icon" /> Mostrar senha</>
                        )}
                    </button>
                </div>

                {/* Nova Senha */}
                <div className="space-y-2">
                    <Input
                        label="Nova Senha"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.newPassword && formik.errors.newPassword}
                        icon={Lock}
                        placeholder="Digite sua nova senha"
                        required
                        isDark={isDark}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className={`
                            text-sm flex items-center gap-2 p-2
                            ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}
                        `}
                    >
                        {showNewPassword ? (
                            <><EyeOff className="w-4 h-4 text-button-icon" /> Ocultar senha</>
                        ) : (
                            <><Eye className="w-4 h-4 text-button-icon" /> Mostrar senha</>
                        )}
                    </button>

                    {/* Password Strength Indicator */}
                    {formik.values.newPassword && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    Força da senha:
                                </span>
                                <span className={`font-medium ${
                                    passwordStrength.strength === 100 ? (isDark ? 'text-green-400' : 'text-green-600') :
                                    passwordStrength.strength === 75 ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                                    passwordStrength.strength === 50 ? (isDark ? 'text-yellow-400' : 'text-yellow-600') :
                                    (isDark ? 'text-red-400' : 'text-red-600')
                                }`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{ width: `${passwordStrength.strength}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                    <Input
                        label="Confirmar Nova Senha"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        icon={Lock}
                        placeholder="Confirme sua nova senha"
                        required
                        isDark={isDark}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`
                            text-sm flex items-center gap-2 p-2
                            ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}
                        `}
                    >
                        {showConfirmPassword ? (
                            <><EyeOff className="w-4 h-4 text-button-icon" /> Ocultar senha</>
                        ) : (
                            <><Eye className="w-4 h-4 text-button-icon" /> Mostrar senha</>
                        )}
                    </button>
                </div>

                {/* Requisitos de Senha */}
                <div className={`
                    p-4 rounded-lg border
                    ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}
                `}>
                    <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Requisitos de senha:
                    </h4>
                    <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>• Mínimo de 8 caracteres</li>
                        <li>• Pelo menos uma letra maiúscula</li>
                        <li>• Pelo menos uma letra minúscula</li>
                        <li>• Pelo menos um número</li>
                        <li>• Pelo menos um caractere especial (@$!%*?&#)</li>
                    </ul>
                </div>

                {/* Botões */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="submit"
                        variant="primary"
                        icon={Lock}
                        disabled={isLoading || !formik.isValid || !formik.dirty}
                        loading={isLoading}
                        className="min-w-[140px]"
                    >
                        {isLoading ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
