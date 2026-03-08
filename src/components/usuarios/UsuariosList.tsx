'use client'

import React from 'react'
import { AlertCircle, Loader2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { UserShieldUser } from '@/services/userShieldService'
import { UsuarioCard } from './UsuarioCard'
import { ViewMode } from './useUsuariosPage'

interface UsuariosListProps {
  usuarios: UserShieldUser[]
  loading: boolean
  error: string | null
  searchTerm: string
  viewMode: ViewMode
  onEdit: (user: UserShieldUser) => void
  onResetPassword: (user: UserShieldUser) => void
  onDelete: (user: UserShieldUser) => void
}

export const UsuariosList: React.FC<UsuariosListProps> = ({
  usuarios, loading, error, searchTerm, viewMode,
  onEdit, onResetPassword, onDelete,
}) => {
  const { isDark } = useTheme()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-label="Carregando..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-4 rounded-lg border shrink-0',
        isDark ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-700'
      )} role="alert">
        <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">Erro ao carregar usuários</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    )
  }

  if (usuarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className={cn('w-16 h-16 mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} aria-hidden="true" />
        <p className={cn('text-lg font-medium', isDark ? 'text-gray-300' : 'text-gray-600')}>
          {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
        </p>
        {searchTerm && (
          <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
            Tente ajustar os termos de busca
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'grid gap-3 pb-4',
      viewMode === 'grid' && 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    )}>
      {usuarios.map(user => (
        <UsuarioCard
          key={user.id}
          user={user}
          viewMode={viewMode}
          onEdit={onEdit}
          onResetPassword={onResetPassword}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
