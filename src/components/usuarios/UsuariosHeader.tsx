'use client'

import React from 'react'
import { UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

interface UsuariosHeaderProps {
  onAddUser: () => void
}

export const UsuariosHeader: React.FC<UsuariosHeaderProps> = ({ onAddUser }) => {
  const { isDark } = useTheme()

  return (
    <div className="w-full shrink-0 px-4 pt-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className={cn(
            'text-xl sm:text-2xl font-bold truncate',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            👥 Gerenciamento de Usuários
          </h1>
          <p className={cn('mt-1 text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
            Sistema completo de gerenciamento de usuários e permissões
          </p>
        </div>
        <button
          onClick={onAddUser}
          aria-label="Adicionar novo usuário"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <UserPlus className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Adicionar Usuário</span>
          <span className="sm:hidden">Adicionar</span>
        </button>
      </div>
    </div>
  )
}
