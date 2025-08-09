'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '@/contexts/AuthContext'
import Notification from '@/components/auth/Notification'
import type { ILoginForm } from '@/lib/auth-types'

const LoginPage: React.FC = () => {
    const router = useRouter()
    const { login, isLoading, isAuthenticated, notification, clearNotification } = useAuth()
    const [ isDark, setIsDark ] = useState(false)

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

    // Redirecionar se já estiver logado
    React.useEffect(() => {
        if (isAuthenticated) {
            router.push('/admin')
        }
    }, [ isAuthenticated, router ])

    // Background dinâmico baseado no tema
    const getMainBackground = () => {
        if (isDark) {
            // Tema escuro: gradiente sofisticado com outer_space e night
            return 'linear-gradient(135deg, rgba(11, 14, 14, 0.98) 0%, rgba(22, 27, 29, 0.95) 50%, rgba(34, 41, 43, 0.92) 100%)'
        } else {
            // Tema claro: gradiente limpo com tons neutros
            return 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.95) 50%, rgba(226, 232, 240, 0.92) 100%)'
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
            .min(6, 'O usuário deve ter no mínimo 6 caracteres!'),
        Password: Yup.string()
            .required('A senha é obrigatória!')
            .min(6, 'A senha deve ter no mínimo 6 caracteres!')
    })

    const formik = useFormik<ILoginForm>({
        initialValues: {
            User: '',
            Password: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            await login(values.User, values.Password)
        }
    })

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 transition-all duration-300"
            style={{ background: getMainBackground() }}
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
                                    onClick={() => alert("Telescope: Sistema Administrador para todas aplicações destinadas à instituição Pronutrir")}
                                >
                                    <span className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>T</span>
                                </div>
                            )}
                        </div>

                        <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            SISTEMA ADMINISTRADOR
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
                                    placeholder="Usuário"
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
                                    Entrando...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Telescope © 2025 - Sistema Administrador
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification */}
            <Notification
                notification={notification}
                onClose={clearNotification}
            />
        </div >
    )
}

export default LoginPage
