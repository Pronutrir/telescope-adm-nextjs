'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { FormikProps } from 'formik'
import type { IServerLoginValues } from './useServerLoginForm'

interface LoginFormFieldsProps {
  isDark: boolean
  isLoading: boolean
  formik: FormikProps<IServerLoginValues>
}

const UserIcon = ({ isDark }: { isDark: boolean }) => (
  <svg className={cn('h-5 w-5', isDark ? 'text-gray-400' : 'text-gray-500')} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
)

const LockIcon = ({ isDark }: { isDark: boolean }) => (
  <svg className={cn('h-5 w-5', isDark ? 'text-gray-400' : 'text-gray-500')} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
)

const inputBase = 'block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({ isDark, isLoading, formik }) => {
  const inputClass = (hasError: boolean) => cn(
    inputBase,
    isDark
      ? hasError ? 'bg-red-900/10 border-red-500/50 text-slate-100' : 'bg-slate-900/60 border-slate-600/30 text-slate-100'
      : hasError ? 'bg-red-50/50 border-red-400/40 text-gray-900' : 'bg-gray-50/80 border-gray-200/40 text-gray-900'
  )

  const userHasError = !!(formik.errors.User && formik.touched.User)
  const passHasError = !!(formik.errors.Password && formik.touched.Password)

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
      {/* Usuário */}
      <div>
        <label htmlFor="User" className="sr-only">Usuário ou Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon isDark={isDark} />
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
            aria-invalid={userHasError}
            aria-describedby={userHasError ? 'user-error' : undefined}
            className={inputClass(userHasError)}
          />
        </div>
        {userHasError && (
          <p id="user-error" className="mt-1 text-sm text-red-500" role="alert">
            {formik.errors.User}
          </p>
        )}
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="Password" className="sr-only">Senha</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockIcon isDark={isDark} />
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
            aria-invalid={passHasError}
            aria-describedby={passHasError ? 'password-error' : undefined}
            className={inputClass(passHasError)}
          />
        </div>
        {passHasError && (
          <p id="password-error" className="mt-1 text-sm text-red-500" role="alert">
            {formik.errors.Password}
          </p>
        )}
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={isLoading || !formik.isValid}
        aria-label={isLoading ? 'Autenticando...' : 'Entrar no sistema'}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 active:scale-[0.98]',
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none',
          isLoading || !formik.isValid
            ? cn('cursor-not-allowed', isDark ? 'bg-slate-700/40 text-gray-400' : 'bg-gray-300/60 text-gray-500')
            : cn('cursor-pointer text-white hover:-translate-y-px', isDark ? 'bg-blue-500/80 hover:bg-blue-500/90' : 'bg-blue-600/90 hover:bg-blue-700')
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Autenticando...
          </div>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  )
}
