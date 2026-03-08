'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useServerLoginForm } from './useServerLoginForm'
import { LoginBackground } from './LoginBackground'
import { LoginHeader } from './LoginHeader'
import { LoginFormFields } from './LoginFormFields'

export const ServerLoginForm: React.FC = () => {
  const { isDark, isLoading, formik } = useServerLoginForm()

  return (
    <LoginBackground isDark={isDark}>
      <div
        className={cn(
          'rounded-2xl p-8 transition-all duration-300 backdrop-blur-xl',
          isDark
            ? 'bg-[rgba(34,41,43,0.4)] border border-[rgba(57,69,72,0.3)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]'
            : 'bg-[rgba(255,255,255,0.9)] border border-[rgba(203,213,225,0.4)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]'
        )}
      >
        <LoginHeader isDark={isDark} isLoading={isLoading} />
        <LoginFormFields isDark={isDark} isLoading={isLoading} formik={formik} />

        <div className="mt-6 text-center">
          <p className={cn('text-xs transition-colors duration-300', isDark ? 'text-gray-500' : 'text-gray-400')}>
            Pronutrir © 2025
          </p>
        </div>
      </div>
    </LoginBackground>
  )
}
