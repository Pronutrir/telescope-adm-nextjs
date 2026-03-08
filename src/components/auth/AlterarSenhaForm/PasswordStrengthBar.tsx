'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { type PasswordStrength } from './useAlterarSenhaForm'

interface PasswordStrengthBarProps {
  strength: PasswordStrength
  isDark: boolean
}

export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ strength, isDark }) => (
  <div className="mt-2" aria-live="polite" aria-label={`Força da senha: ${strength.label}`}>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-medium" style={{ color: strength.color }}>
        {strength.label}
      </span>
      <span className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>
        {strength.value}/5
      </span>
    </div>
    <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
      <div
        className="h-full transition-all duration-300 rounded-full"
        style={{
          width: `${(strength.value / 5) * 100}%`,
          backgroundColor: strength.color,
        }}
        role="progressbar"
        aria-valuenow={strength.value}
        aria-valuemin={0}
        aria-valuemax={5}
      />
    </div>
  </div>
)
