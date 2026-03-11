'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PasswordRequirementsProps {
  isDark: boolean
}

const requirements = [
  'Mínimo 6 caracteres',
  'Pelo menos 1 letra minúscula',
  'Pelo menos 1 letra maiúscula',
  'Pelo menos 1 número',
]

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ isDark }) => (
  <div className={cn('rounded-lg p-3 text-xs', isDark ? 'bg-white/5 text-gray-300' : 'bg-black/5 text-gray-600')}>
    <p className="font-medium mb-1">A senha deve conter:</p>
    <ul className="space-y-1">
      {requirements.map((req) => (
        <li key={req} className="flex items-center gap-2">
          <span aria-hidden="true">•</span>
          {req}
        </li>
      ))}
    </ul>
  </div>
)
