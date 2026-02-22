'use client'

import React from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PasswordField } from './PasswordField'
import { PasswordStrengthBar } from './PasswordStrengthBar'
import { useAlterarSenhaForm } from './useAlterarSenhaForm'

export const AlterarSenhaForm: React.FC = () => {
  const {
    isDark,
    isMobile,
    isLoading,
    savedPassword,
    formik,
    passwordStrength,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    toggleCurrentPassword,
    toggleNewPassword,
    toggleConfirmPassword,
  } = useAlterarSenhaForm()

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center transition-all duration-300',
        'bg-[image:url(/backgrounds/galaxy.webp),image:url(/backgrounds/galaxy.jpg)]',
        'bg-cover bg-center bg-fixed',
        isMobile ? 'p-3' : 'p-4',
        isDark ? 'bg-[rgba(11,14,14,0.6)]' : 'bg-[rgba(248,250,252,0.3)]'
      )}
    >
      <div className="relative w-full max-w-md">
        <div
          className={cn(
            'rounded-2xl transition-all duration-300',
            isMobile ? 'p-6' : 'p-8',
            isDark
              ? 'bg-[rgba(34,41,43,0.85)] backdrop-blur-xl border border-slate-700/30 shadow-2xl'
              : 'bg-white/85 backdrop-blur-xl border border-slate-200/30 shadow-2xl'
          )}
        >
          <FormHeader isDark={isDark} />

          <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
            {!savedPassword && (
              <PasswordField
                id="currentPassword"
                name="currentPassword"
                label="Senha Atual"
                placeholder="Digite sua senha atual"
                autoComplete="current-password"
                value={formik.values.currentPassword}
                showPassword={showCurrentPassword}
                onToggle={toggleCurrentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.currentPassword}
                touched={formik.touched.currentPassword}
                isDark={isDark}
              />
            )}

            <div>
              <PasswordField
                id="newPassword"
                name="newPassword"
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                autoComplete="new-password"
                value={formik.values.newPassword}
                showPassword={showNewPassword}
                onToggle={toggleNewPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.newPassword}
                touched={formik.touched.newPassword}
                isDark={isDark}
              />
              {formik.values.newPassword && (
                <PasswordStrengthBar strength={passwordStrength} isDark={isDark} />
              )}
            </div>

            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Nova Senha"
              placeholder="Confirme sua nova senha"
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              showPassword={showConfirmPassword}
              onToggle={toggleConfirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              isDark={isDark}
            />

            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className={cn(
                'w-full py-3 px-4 rounded-lg font-medium text-white',
                'transition-all duration-200 active:scale-[0.98]',
                'focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2',
                isLoading || !formik.isValid
                  ? 'bg-slate-400/60 cursor-not-allowed'
                  : isDark
                    ? 'bg-green-500/80 hover:bg-green-500 shadow-lg shadow-green-500/30'
                    : 'bg-green-600/90 hover:bg-green-700 shadow-lg shadow-green-600/25'
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Alterando Senha...
                </span>
              ) : (
                'Alterar Senha'
              )}
            </button>
          </form>

          <p
            className={cn(
              'mt-6 text-center text-xs',
              isDark ? 'text-gray-500' : 'text-gray-400'
            )}
          >
            Pronutrir © 2025
          </p>
        </div>
      </div>
    </div>
  )
}

interface FormHeaderProps {
  isDark: boolean
}

const FormHeader: React.FC<FormHeaderProps> = ({ isDark }) => (
  <div className="text-center mb-8">
    <div
      className={cn(
        'inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg mb-6',
        isDark ? 'bg-slate-700/30 border border-slate-600/40' : 'bg-slate-50/80 border border-slate-200/40'
      )}
      aria-hidden="true"
    >
      <Lock className={cn('h-10 w-10', isDark ? 'text-yellow-400' : 'text-yellow-600')} />
    </div>
    <h1 className={cn('text-2xl font-bold mb-2', isDark ? 'text-gray-100' : 'text-gray-900')}>
      Alteração de Senha Obrigatória
    </h1>
    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
      Por segurança, você precisa alterar sua senha antes de continuar.
    </p>
  </div>
)
