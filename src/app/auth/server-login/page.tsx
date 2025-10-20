'use client'

/**
 * 🔐 SERVER-SIDE LOGIN PAGE
 * 
 * Página de login com design idêntico à original, mas usando autenticação server-side com Redis
 */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNotify } from '@/contexts/NotificationContext'
import Image from 'next/image'

interface IServerLoginForm {
    User: string
    Password: string
}

const ServerSideLoginPage: React.FC = () => {
    const router = useRouter()
    const [ isLoading, setIsLoading ] = useState(false)
    const [ isDark, setIsDark ] = useState(false)
    const notify = useNotify()

    // Detectar tema atual
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }

        checkTheme()

        // Observer para mudanças no tema
        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [ 'class' ]
        })

        return () => observer.disconnect()
    }, [])

    // Background dinâmico com imagem galaxy baseado no tema
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

    // Estilo do card de login
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
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(203, 213, 225, 0.4)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
            }
        }
    }

    // Estilo dos inputs
    const getInputStyles = (hasError: boolean) => {
        const baseStyles = {
            transition: 'all 0.2s ease-in-out'
        }

        if (isDark) {
            return {
                ...baseStyles,
                backgroundColor: hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                borderColor: hasError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(71, 85, 105, 0.3)',
                color: '#f1f5f9'
            }
        } else {
            return {
                ...baseStyles,
                backgroundColor: hasError ? 'rgba(239, 68, 68, 0.05)' : 'rgba(248, 250, 252, 0.8)',
                borderColor: hasError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(203, 213, 225, 0.4)',
                color: '#1e293b'
            }
        }
    }

    const validationSchema = Yup.object().shape({
        User: Yup.string()
            .required('Usuário é obrigatório!')
            .min(3, 'O usuário deve ter no mínimo 3 caracteres!')
            .max(50, 'O usuário deve ter no máximo 50 caracteres!')
            .matches(/^[a-zA-Z0-9._@-]+$/, 'Usuário contém caracteres inválidos'),
        Password: Yup.string()
            .required('A senha é obrigatória!')
            .min(3, 'A senha deve ter no mínimo 3 caracteres!')
            .max(100, 'A senha deve ter no máximo 100 caracteres!')
    })

    const formik = useFormik<IServerLoginForm>({
        initialValues: {
            User: '',
            Password: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            // Validar campos antes de enviar
            const errors = await formik.validateForm()
            if (Object.keys(errors).length > 0) {
                const firstErrorKey = Object.keys(errors)[ 0 ] as keyof IServerLoginForm
                const firstError = errors[ firstErrorKey ]

                notify.error(`${firstError}`, {
                    title: 'Erro de Validação',
                    duration: 4000,
                    actions: [
                        {
                            label: 'OK',
                            onClick: () => { },
                            variant: 'ghost'
                        }
                    ]
                })
                return
            }

            setIsLoading(true)

            try {
                console.log('🔐 Tentando login server-side...')

                const response = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: values.User,
                        password: values.Password
                    }),
                })

                const data = await response.json()

                if (response.ok && data.success) {
                    console.log('✅ Login server-side bem-sucedido!')
                    console.log('👤 Usuário:', data.user)

                    // Usar o sistema global de notificações
                    notify.success('Login realizado com sucesso! Redirecionando...', {
                        title: 'Sucesso',
                        duration: 3000
                    })

                    // ✅ Usar window.location.href para forçar reload completo
                    // Isso garante que o cookie session_id seja lido corretamente
                    setTimeout(() => {
                        window.location.href = '/admin/gerenciador-pdfs'
                    }, 1500)
                } else {
                    console.error('❌ Erro no login:', data)

                    // Determinar mensagem de erro mais específica
                    let errorMessage = 'Credenciais inválidas'
                    let errorDetails = 'Verifique seu usuário e senha e tente novamente.'

                    if (data.message) {
                        if (data.message.includes('usuário') || data.message.includes('user')) {
                            errorMessage = 'Usuário não encontrado'
                            errorDetails = 'O usuário informado não existe no sistema.'
                        } else if (data.message.includes('senha') || data.message.includes('password')) {
                            errorMessage = 'Senha incorreta'
                            errorDetails = 'A senha informada está incorreta.'
                        } else if (data.message.includes('bloqueado') || data.message.includes('blocked')) {
                            errorMessage = 'Usuário bloqueado'
                            errorDetails = 'Sua conta está temporariamente bloqueada. Contate o administrador.'
                        } else if (data.message.includes('expirado') || data.message.includes('expired')) {
                            errorMessage = 'Sessão expirada'
                            errorDetails = 'Sua sessão expirou. Faça login novamente.'
                        } else {
                            errorMessage = data.message
                        }
                    }

                    // Usar notificação de erro global
                    notify.error(`${errorMessage}. ${errorDetails}`, {
                        title: 'Falha na Autenticação',
                        duration: 0, // Não auto-hide para erros
                        actions: [
                            {
                                label: 'Tentar novamente',
                                onClick: () => formik.resetForm(),
                                variant: 'primary'
                            }
                        ]
                    })
                }
            } catch (error) {
                console.error('❌ Erro na requisição:', error)

                // Determinar tipo de erro de conexão
                let connectionError = 'Erro de conexão com o servidor'
                let errorDetails = 'Verifique sua conexão com a internet e tente novamente.'

                if (error instanceof TypeError && error.message.includes('fetch')) {
                    connectionError = 'Servidor indisponível'
                    errorDetails = 'O servidor está temporariamente indisponível. Tente novamente em alguns minutos.'
                } else if (error instanceof Error) {
                    if (error.message.includes('timeout')) {
                        connectionError = 'Timeout na conexão'
                        errorDetails = 'A requisição demorou muito para responder. Tente novamente.'
                    } else if (error.message.includes('network')) {
                        connectionError = 'Erro de rede'
                        errorDetails = 'Verifique sua conexão com a internet.'
                    }
                }

                // Notificação de erro de conexão
                notify.error(`${connectionError}. ${errorDetails}`, {
                    title: 'Problema de Conectividade',
                    duration: 0,
                    actions: [
                        {
                            label: 'Tentar novamente',
                            onClick: () => formik.handleSubmit(),
                            variant: 'primary'
                        }
                    ]
                })
            } finally {
                setIsLoading(false)
            }
        }
    })

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
                {/* Login Card */}
                <div
                    className="rounded-2xl p-8 transition-all duration-300"
                    style={getCardStyles()}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            {isLoading ? (
                                <div
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all duration-300"
                                    style={{
                                        backgroundColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                                        border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(203, 213, 225, 0.4)'}`
                                    }}
                                >
                                    <div className={`animate-spin rounded-full h-10 w-10 border-b-2 ${isDark ? 'border-blue-400' : 'border-blue-600'}`}></div>
                                </div>
                            ) : (
                                <div
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
                                    style={{
                                        backgroundColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                                        border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(203, 213, 225, 0.4)'}`
                                    }}
                                    onClick={() => alert("Telescope: Sistema Administrador SERVER-SIDE com Redis - Máxima segurança com dados 100% server-side")}
                                >
                                    <Image
                                        src="/icons/telescope.svg"
                                        alt="Telescope Icon"
                                        width={48}
                                        height={48}
                                        className="transition-transform duration-300 hover:rotate-12"
                                        priority
                                    />
                                </div>
                            )}
                        </div>

                        <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            TELESCOPE
                        </h1>
                        <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Entre com suas credenciais
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`h-5 w-5 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="User"
                                    name="User"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Usuário ou Email"
                                    value={formik.values.User}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                    style={{
                                        ...getInputStyles(!!(formik.errors.User && formik.touched.User)),
                                        '--tw-ring-color': isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'
                                    } as React.CSSProperties}
                                />
                            </div>
                            {formik.errors.User && formik.touched.User && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.User}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`h-5 w-5 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="Password"
                                    name="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Senha"
                                    value={formik.values.Password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                    style={{
                                        ...getInputStyles(!!(formik.errors.Password && formik.touched.Password)),
                                        '--tw-ring-color': isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'
                                    } as React.CSSProperties}
                                />
                            </div>
                            {formik.errors.Password && formik.touched.Password && (
                                <p className="mt-1 text-sm text-red-500">{formik.errors.Password}</p>
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
                                    : (isDark ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.9)'),
                                cursor: isLoading || !formik.isValid ? 'not-allowed' : 'pointer',
                                boxShadow: isLoading || !formik.isValid
                                    ? 'none'
                                    : (isDark
                                        ? '0 10px 25px -5px rgba(59, 130, 246, 0.3)'
                                        : '0 10px 25px -5px rgba(37, 99, 235, 0.25)'),
                                transform: isLoading || !formik.isValid ? 'none' : 'translateY(0)',
                                color: isLoading || !formik.isValid
                                    ? (isDark ? 'rgba(156, 163, 175, 0.8)' : 'rgba(107, 114, 128, 0.8)')
                                    : '#ffffff'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading && formik.isValid) {
                                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.9)' : 'rgba(29, 78, 216, 0.95)'
                                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading && formik.isValid) {
                                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.9)'
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                                }
                            }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Autenticando...
                                </div>
                            ) : (
                                'Entrar'
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
        </div >
    )
}

export default ServerSideLoginPage
