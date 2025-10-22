'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import { useNotifications } from '@/contexts/NotificationContext'

// 🎨 Detecção de Tema (Dark/Light) - igual ao server-login
const useThemeDetection = () => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }

        checkTheme()
        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })

        return () => observer.disconnect()
    }, [])

    return isDark
}

// 🔐 Schema de Validação
const passwordSchema = Yup.object({
    currentPassword: Yup.string(),  // Opcional - usado se não tiver senha salva
    newPassword: Yup.string()
        .required('Nova senha é obrigatória')
        .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
        .matches(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
        .matches(/[0-9]/, 'Deve conter pelo menos um número')
        .matches(/[@$!%*?&#]/, 'Deve conter pelo menos um caractere especial (@$!%*?&#)'),
    confirmPassword: Yup.string()
        .required('Confirmação de senha é obrigatória')
        .oneOf([Yup.ref('newPassword')], 'As senhas não coincidem')
})

const AlterarSenhaPage: React.FC = () => {
    const router = useRouter()
    const isDark = useThemeDetection()
    const [isLoading, setIsLoading] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { showSuccess, showError } = useNotifications()
    const [savedPassword, setSavedPassword] = useState<string>('')
    const [hasCheckedPassword, setHasCheckedPassword] = useState(false)

    // Recuperar senha do sessionStorage ao carregar (executa apenas uma vez)
    useEffect(() => {
        // Evitar execuções múltiplas
        if (hasCheckedPassword) return
        
        const password = sessionStorage.getItem('temp_password')
        console.log('🔍 Verificando senha salva no sessionStorage:', password ? 'Encontrada' : 'Não encontrada')
        
        if (password) {
            console.log('✅ Senha recuperada com sucesso')
            setSavedPassword(password)
            // Limpar após recuperar por segurança
            sessionStorage.removeItem('temp_password')
        } else {
            console.warn('⚠️ Nenhuma senha encontrada no sessionStorage')
            console.warn('⚠️ O usuário pode ter recarregado a página ou acessado diretamente')
            // Não mostra erro aqui, apenas avisa no console
            // O erro será mostrado se tentar submeter sem senha
        }
        
        setHasCheckedPassword(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 🎨 Estilos dinâmicos baseados no tema (igual ao server-login)
    const getBackgroundStyles = () => {
        const baseImage = `url(/backgrounds/galaxy.jpg)`

        if (isDark) {
            // Tema escuro: galaxy visível com overlay escuro suave
            return {
                backgroundImage: `${baseImage}, linear-gradient(135deg, rgba(11, 14, 14, 0.6) 0%, rgba(22, 27, 29, 0.7) 50%, rgba(34, 41, 43, 0.8) 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }
        } else {
            // Tema claro: galaxy com overlay claro para legibilidade
            return {
                backgroundImage: `${baseImage}, linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(241, 245, 249, 0.4) 50%, rgba(226, 232, 240, 0.5) 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }
        }
    }

    const getCardStyles = () => {
        if (isDark) {
            return {
                backgroundColor: 'rgba(34, 41, 43, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(57, 69, 72, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
            }
        } else {
            return {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(203, 213, 225, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
            }
        }
    }

    const getInputStyles = (hasError: boolean) => {
        if (hasError) {
            return {
                backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(254, 242, 242, 0.8)',
                borderColor: '#ef4444',
                color: isDark ? '#f1f5f9' : '#1e293b'
            }
        }

        return {
            backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 0.8)',
            borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(203, 213, 225, 0.4)',
            color: isDark ? '#f1f5f9' : '#1e293b'
        }
    }

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: passwordSchema,
        onSubmit: async (values) => {
            setIsLoading(true)

            try {
                console.log('🔐 Alterando senha obrigatória...')
                console.log('📦 Senha atual salva:', savedPassword ? 'Sim' : 'Não')
                console.log('📦 Nova senha:', values.newPassword ? 'Fornecida' : 'Não fornecida')

                // Validação: usar senha salva OU senha digitada
                const currentPassword = savedPassword || values.currentPassword
                
                if (!currentPassword) {
                    console.error('❌ Senha atual não fornecida')
                    setIsLoading(false)
                    
                    showError(
                        'Por favor, digite sua senha atual.',
                        {
                            title: 'Senha Atual Necessária',
                            duration: 0
                        }
                    )
                    return
                }

                const requestBody = {
                    password: currentPassword,
                    newPassword: values.newPassword
                }
                console.log('📤 Body da requisição:', {
                    password: '***',
                    newPassword: '***'
                })

                const response = await fetch('/api/auth/update-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                })

                console.log('📡 Status da resposta:', response.status)
                console.log('📡 Status OK?:', response.ok)

                const data = await response.json()
                console.log('📦 Dados retornados:', data)

                if (response.ok && data.success) {
                    console.log('✅ Senha alterada com sucesso!')

                    showSuccess('Senha alterada com sucesso! Redirecionando...', {
                        title: 'Sucesso',
                        duration: 2000
                    })

                    // Redirecionar para dashboard após alteração
                    setTimeout(() => {
                        window.location.href = '/admin/gerenciador-pdfs'
                    }, 500)
                } else {
                    console.error('❌ Erro ao alterar senha:', data)
                    console.error('❌ Mensagem:', data.message)

                    showError(data.message || 'Erro ao alterar senha. Verifique sua senha atual.', {
                        title: 'Erro na Alteração',
                        duration: 0
                    })
                }
            } catch (error) {
                console.error('❌ Erro na requisição:', error)

                showError('Erro de conexão com o servidor. Tente novamente.', {
                    title: 'Erro de Conexão',
                    duration: 0
                })
            } finally {
                setIsLoading(false)
            }
        }
    })

    // 🎨 Indicador de força da senha
    const getPasswordStrength = (password: string) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (password.match(/[A-Z]/)) strength++
        if (password.match(/[a-z]/)) strength++
        if (password.match(/[0-9]/)) strength++
        if (password.match(/[@$!%*?&#]/)) strength++

        return {
            value: strength,
            label: ['Muito Fraca', 'Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte'][strength] || 'Muito Fraca',
            color: ['#ef4444', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'][strength] || '#ef4444'
        }
    }

    const passwordStrength = getPasswordStrength(formik.values.newPassword)

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 transition-all duration-300"
            style={getBackgroundStyles()}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent ${isDark ? 'text-gray-400' : 'text-gray-600'}`}></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div
                    className="rounded-2xl p-8 transition-all duration-300"
                    style={getCardStyles()}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            <div
                                className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg"
                                style={{
                                    backgroundColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                                    border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(203, 213, 225, 0.4)'}`
                                }}
                            >
                                <svg className={`h-10 w-10 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            Alteração de Senha Obrigatória
                        </h1>
                        <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Por segurança, você precisa alterar sua senha antes de continuar.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Current Password Field - Só aparece se não houver senha salva */}
                        {!savedPassword && (
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Senha Atual
                                </label>
                                <div className="relative">
                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="Digite sua senha atual"
                                        value={formik.values.currentPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="block w-full pl-3 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                        style={getInputStyles(!!(formik.errors.currentPassword && formik.touched.currentPassword))}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className={`absolute top-0 right-0 h-full flex items-center justify-center w-12 rounded-r-lg cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${isDark ? 'text-gray-400 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        {showCurrentPassword ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {formik.errors.currentPassword && formik.touched.currentPassword && (
                                    <p className="mt-1 text-sm text-red-500">{formik.errors.currentPassword}</p>
                                )}
                            </div>
                        )}
                        
                        {/* New Password Field */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Nova Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Digite sua nova senha"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full pl-3 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                    style={getInputStyles(!!(formik.errors.newPassword && formik.touched.newPassword))}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className={`absolute top-0 right-0 h-full flex items-center justify-center w-12 rounded-r-lg cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${isDark ? 'text-gray-400 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {showNewPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {formik.errors.newPassword && formik.touched.newPassword && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.newPassword}</p>
                            )}

                            {/* Password Strength Indicator */}
                            {formik.values.newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label}
                                        </span>
                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {passwordStrength.value}/5
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-300 rounded-full"
                                            style={{
                                                width: `${(passwordStrength.value / 5) * 100}%`,
                                                backgroundColor: passwordStrength.color
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Confirmar Nova Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="Confirme sua nova senha"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full pl-3 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                    style={getInputStyles(!!(formik.errors.confirmPassword && formik.touched.confirmPassword))}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={`absolute top-0 right-0 h-full flex items-center justify-center w-12 rounded-r-lg cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${isDark ? 'text-gray-400 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {showConfirmPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !formik.isValid}
                            className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform active:scale-[0.98]"
                            style={{
                                backgroundColor: isLoading || !formik.isValid
                                    ? (isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(156, 163, 175, 0.6)')
                                    : (isDark ? 'rgba(34, 197, 94, 0.8)' : 'rgba(22, 163, 74, 0.9)'),
                                cursor: isLoading || !formik.isValid ? 'not-allowed' : 'pointer',
                                boxShadow: isLoading || !formik.isValid
                                    ? 'none'
                                    : (isDark
                                        ? '0 10px 25px -5px rgba(34, 197, 94, 0.3)'
                                        : '0 10px 25px -5px rgba(22, 163, 74, 0.25)')
                            }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Alterando Senha...
                                </div>
                            ) : (
                                'Alterar Senha'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Pronutrir © 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlterarSenhaPage
