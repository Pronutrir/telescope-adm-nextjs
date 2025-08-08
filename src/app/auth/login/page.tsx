'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '@/contexts/AuthContext'
import Notification from '@/components/auth/Notification'
import type { ILoginForm } from '@/lib/auth-types'

const LoginPage: React.FC = () => {
    const router = useRouter()
    const { login, isLoading, isAuthenticated, notification, clearNotification } = useAuth()

    // Redirecionar se já estiver logado
    React.useEffect(() => {
        if (isAuthenticated) {
            router.push('/admin')
        }
    }, [ isAuthenticated, router ])

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
        <div className="min-h-screen bg-gradient-to-br from-background via-primary-950 to-background flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Login Card */}
                <div className="glass-theme rounded-2xl shadow-theme-xl border border-theme/20 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            {isLoading ? (
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-card rounded-full shadow-theme">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                                </div>
                            ) : (
                                <div
                                    className="inline-flex items-center justify-center w-20 h-20 bg-card rounded-full shadow-theme cursor-pointer transition-transform hover:scale-105"
                                    onClick={() => alert("Telescope: Sistema Administrador para todas aplicações destinadas à instituição Pronutrir")}
                                >
                                    <span className="text-2xl font-bold text-primary-600">T</span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            SISTEMA ADMINISTRADOR
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Entre com suas credenciais
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
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
                                    className={`
                    block w-full pl-10 pr-3 py-3 
                    glass-secondary
                    border rounded-lg
                    text-foreground placeholder-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                    ${formik.errors.User && formik.touched.User
                                            ? 'border-destructive focus:ring-destructive'
                                            : 'border-theme/20 hover:border-theme/30'
                                        }
                  `}
                                />
                            </div>
                            {formik.errors.User && formik.touched.User && (
                                <p className="mt-1 text-sm text-destructive">{formik.errors.User}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
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
                                    className={`
                    block w-full pl-10 pr-3 py-3 
                    glass-secondary
                    border rounded-lg
                    text-foreground placeholder-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                    ${formik.errors.Password && formik.touched.Password
                                            ? 'border-destructive focus:ring-destructive'
                                            : 'border-theme/20 hover:border-theme/30'
                                        }
                  `}
                                />
                            </div>
                            {formik.errors.Password && formik.touched.Password && (
                                <p className="mt-1 text-sm text-destructive">{formik.errors.Password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !formik.isValid}
                            className={`
                w-full py-3 px-4 rounded-lg font-medium text-white
                transition-all duration-200 transform
                ${isLoading || !formik.isValid
                                    ? 'bg-muted cursor-not-allowed text-muted-foreground'
                                    : 'bg-primary-600 hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] shadow-theme hover:shadow-primary-500/25'
                                }
              `}
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
                        <p className="text-xs text-muted-foreground">
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
