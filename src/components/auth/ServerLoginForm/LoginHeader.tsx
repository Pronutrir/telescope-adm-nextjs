'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LoginHeaderProps {
  isDark: boolean
  isLoading: boolean
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ isDark, isLoading }) => (
  <div className="text-center mb-8">
    <div className="mb-6">
      {isLoading ? (
        <div
          className={cn(
            'inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all duration-300',
            isDark ? 'bg-slate-700/30 border border-slate-600/40' : 'bg-gray-50/80 border border-gray-200/40'
          )}
        >
          <div className={cn('animate-spin rounded-full h-10 w-10 border-b-2', isDark ? 'border-blue-400' : 'border-blue-600')} />
        </div>
      ) : (
        <div
          className={cn(
            'inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-105',
            isDark ? 'bg-slate-700/30 border border-slate-600/40' : 'bg-gray-50/80 border border-gray-200/40'
          )}
          role="img"
          aria-label="Telescope - Sistema Administrador"
        >
          <Image
            src="/icons/telescope.svg"
            alt="Telescope Icon"
            width={48}
            height={48}
            className="transition-transform duration-300 hover:rotate-12"
            priority
          />
        </div>
      )}
    </div>

    <h1 className={cn('text-2xl font-bold mb-2 transition-colors duration-300', isDark ? 'text-gray-100' : 'text-gray-900')}>
      TELESCOPE
    </h1>
    <p className={cn('text-sm transition-colors duration-300', isDark ? 'text-gray-400' : 'text-gray-600')}>
      Entre com suas credenciais
    </p>
  </div>
)
