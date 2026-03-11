'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useRecoveryForm } from './useRecoveryForm'
import { RecoveryFormFields } from './RecoveryFormFields'

export const RecoveryForm: React.FC = () => {
  const { isDark, isMobile, isLoading, formik } = useRecoveryForm()

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center transition-colors duration-300',
        isMobile ? 'p-4' : 'p-8',
        isDark ? 'bg-slate-950' : 'bg-slate-100'
      )}
      style={{
        backgroundImage: isDark
          ? 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,58,138,0.95) 50%, rgba(15,23,42,0.98) 100%)'
          : 'linear-gradient(135deg, rgba(248,250,252,0.98) 0%, rgba(219,234,254,0.95) 50%, rgba(248,250,252,0.98) 100%)',
      }}
    >
      <div className="relative w-full max-w-md">
        <div
          className={cn(
            'rounded-2xl p-8 backdrop-blur-lg shadow-2xl border transition-all duration-300',
            isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200'
          )}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className={cn('inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg mb-6', isDark ? 'bg-blue-900/40 border border-blue-700/30' : 'bg-white')}>
              <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className={cn('text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
              ALTERAR SENHA
            </h1>
            <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-500')}>
              Defina sua nova senha de acesso
            </p>
          </div>

          <RecoveryFormFields isDark={isDark} isLoading={isLoading} formik={formik} />

          <div className="mt-6 text-center">
            <p className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-400')}>
              Telescope © 2025 - Sistema Administrador
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
