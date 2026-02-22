'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { FormikProps } from 'formik'
import { PasswordRequirements } from './PasswordRequirements'
import type { IRecoveryValues } from './useRecoveryForm'

interface RecoveryFormFieldsProps {
  isDark: boolean
  isLoading: boolean
  formik: FormikProps<IRecoveryValues>
}

const inputBase = 'block w-full pl-10 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'

const UserIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
)

const LockIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
)

interface FieldProps {
  id: keyof IRecoveryValues
  type: string
  placeholder: string
  autoComplete: string
  icon: React.ReactNode
  isDark: boolean
  hasError: boolean
  formik: FormikProps<IRecoveryValues>
}

const FormField: React.FC<FieldProps> = ({ id, type, placeholder, autoComplete, icon, isDark, hasError, formik }) => (
  <div>
    <label htmlFor={id} className="sr-only">{placeholder}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={formik.values[id]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={cn(
          inputBase,
          isDark
            ? cn('bg-white/10 text-white placeholder-gray-400', hasError ? 'border-red-500' : 'border-white/20 hover:border-white/30')
            : cn('bg-black/5 text-gray-900 placeholder-gray-400', hasError ? 'border-red-500' : 'border-gray-300 hover:border-gray-400')
        )}
      />
    </div>
    {hasError && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-400" role="alert">
        {formik.errors[id]}
      </p>
    )}
  </div>
)

export const RecoveryFormFields: React.FC<RecoveryFormFieldsProps> = ({ isDark, isLoading, formik }) => {
  const router = useRouter()

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
      <FormField id="username" type="text" placeholder="Usuário" autoComplete="username"
        icon={<UserIcon />} isDark={isDark} hasError={!!(formik.errors.username && formik.touched.username)} formik={formik} />

      <FormField id="newPassword" type="password" placeholder="Nova senha" autoComplete="new-password"
        icon={<LockIcon />} isDark={isDark} hasError={!!(formik.errors.newPassword && formik.touched.newPassword)} formik={formik} />

      <FormField id="confirmPassword" type="password" placeholder="Confirmar nova senha" autoComplete="new-password"
        icon={<LockIcon />} isDark={isDark} hasError={!!(formik.errors.confirmPassword && formik.touched.confirmPassword)} formik={formik} />

      <PasswordRequirements isDark={isDark} />

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          aria-label={isLoading ? 'Alterando senha...' : 'Alterar senha'}
          className={cn(
            'w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200',
            'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none',
            isLoading || !formik.isValid
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Alterando...
            </div>
          ) : 'Alterar Senha'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/auth/server-login')}
          aria-label="Voltar para a página de login"
          className={cn(
            'w-full py-3 px-4 rounded-lg font-medium transition-all duration-200',
            'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none',
            isDark
              ? 'text-gray-300 border border-white/20 hover:bg-white/5'
              : 'text-gray-600 border border-gray-300 hover:bg-black/5'
          )}
        >
          Voltar ao Login
        </button>
      </div>
    </form>
  )
}
