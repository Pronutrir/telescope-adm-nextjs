'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '@/contexts/AuthContext'
import Notification from '@/components/auth/Notification'
import type { IRecoveryForm } from '@/lib/auth-types'

// Componente interno que usa useSearchParams
const RecoveryFormContent: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { updatePassword, isLoading, notification, clearNotification } = useAuth()

    const username = searchParams.get('username') || ''

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Usuário é obrigatório!')
            .min(6, 'O usuário deve ter no mínimo 6 caracteres!'),
        newPassword: Yup.string()
            .required('Nova senha é obrigatória!')
            .min(6, 'A senha deve ter no mínimo 6 caracteres!')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'A senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número'
            ),
        confirmPassword: Yup.string()
            .required('Confirmação de senha é obrigatória!')
            .oneOf([ Yup.ref('newPassword') ], 'As senhas devem ser iguais!')
    })

    const formik = useFormik<IRecoveryForm>({
        initialValues: {
            username: username,
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            await updatePassword(values.username, values.newPassword)
        },
        enableReinitialize: true
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Recovery Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg">
                                <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">
                            ALTERAR SENHA
                        </h1>
                        <p className="text-gray-300 text-sm">
                            Defina sua nova senha de acesso
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="Usuário"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`
                    block w-full pl-10 pr-3 py-3 
                    bg-white/10 backdrop-blur-sm
                    border rounded-lg
                    text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200
                    ${formik.errors.username && formik.touched.username
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-white/20 hover:border-white/30'
                                        }
                  `}
                                />
                            </div>
                            {formik.errors.username && formik.touched.username && (
                                <p className="mt-1 text-sm text-red-400">{formik.errors.username}</p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Nova senha"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`
                    block w-full pl-10 pr-3 py-3 
                    bg-white/10 backdrop-blur-sm
                    border rounded-lg
                    text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200
                    ${formik.errors.newPassword && formik.touched.newPassword
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-white/20 hover:border-white/30'
                                        }
                  `}
                                />
                            </div>
                            {formik.errors.newPassword && formik.touched.newPassword && (
                                <p className="mt-1 text-sm text-red-400">{formik.errors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Confirmar nova senha"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`
                    block w-full pl-10 pr-3 py-3 
                    bg-white/10 backdrop-blur-sm
                    border rounded-lg
                    text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200
                    ${formik.errors.confirmPassword && formik.touched.confirmPassword
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-white/20 hover:border-white/30'
                                        }
                  `}
                                />
                            </div>
                            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                <p className="mt-1 text-sm text-red-400">{formik.errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-white/5 rounded-lg p-3 text-xs text-gray-300">
                            <p className="font-medium mb-1">A senha deve conter:</p>
                            <ul className="space-y-1">
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Mínimo 6 caracteres
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Pelo menos 1 letra minúscula
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Pelo menos 1 letra maiúscula
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Pelo menos 1 número
                                </li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={isLoading || !formik.isValid}
                                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-white
                  transition-all duration-200 transform
                  ${isLoading || !formik.isValid
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25'
                                    }
                `}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Alterando...
                                    </div>
                                ) : (
                                    'Alterar Senha'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/auth/login')}
                                className="w-full py-3 px-4 rounded-lg font-medium text-gray-300 border border-white/20 hover:bg-white/5 transition-all duration-200"
                            >
                                Voltar ao Login
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
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
        </div>
    )
}

// Loading component para o Suspense
const LoadingFallback = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
    </div>
)

// Componente principal com Suspense
const RecoveryPage: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <RecoveryFormContent />
        </Suspense>
    )
}

export default RecoveryPage
