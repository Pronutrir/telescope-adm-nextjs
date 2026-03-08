'use client'

import React from 'react'
import { Mail, Edit3, Key, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { UserShieldUser } from '@/services/userShieldService'
import { ViewMode } from './useUsuariosPage'

interface UsuarioCardProps {
  user: UserShieldUser
  viewMode: ViewMode
  onEdit: (user: UserShieldUser) => void
  onResetPassword: (user: UserShieldUser) => void
  onDelete: (user: UserShieldUser) => void
}

const UserAvatar = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) => (
  <div className={cn(
    'rounded-full flex items-center justify-center font-bold bg-blue-600 text-white shrink-0',
    size === 'md' ? 'w-12 h-12 text-lg' : 'w-16 h-16 text-2xl'
  )}>
    {name?.charAt(0).toUpperCase() || '?'}
  </div>
)

const PerfilBadges = ({ perfis, isDark }: { perfis: NonNullable<UserShieldUser['perfis']>; isDark: boolean }) => (
  <div className="flex flex-wrap gap-1">
    {perfis.slice(0, 3).map(perfil => (
      <span key={perfil.id} className={cn(
        'px-2 py-1 text-xs rounded-md',
        isDark ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-50 text-blue-700'
      )}>
        {perfil.nomePerfil}
      </span>
    ))}
    {perfis.length > 3 && (
      <span className={cn('px-2 py-1 text-xs rounded-md', isDark ? 'text-gray-400' : 'text-gray-500')}>
        +{perfis.length - 3}
      </span>
    )}
  </div>
)

export const UsuarioCard: React.FC<UsuarioCardProps> = ({ user, viewMode, onEdit, onResetPassword, onDelete }) => {
  const { isDark } = useTheme()

  const cardClass = cn(
    'rounded-lg border transition-all hover:shadow-md',
    isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50',
    viewMode === 'list' ? 'flex flex-col sm:flex-row sm:items-center gap-4 p-4' : 'flex flex-col p-4'
  )

  const actionBtnClass = (color: 'blue' | 'yellow' | 'red') => cn(
    'p-2 rounded-lg transition-all focus-visible:ring-2',
    viewMode === 'grid' && 'flex-1 flex items-center justify-center gap-2',
    color === 'blue' && (isDark ? 'hover:bg-blue-900/50 text-blue-400 focus-visible:ring-blue-400' : 'hover:bg-blue-50 text-blue-600 focus-visible:ring-blue-500'),
    color === 'yellow' && (isDark ? 'hover:bg-yellow-900/50 text-yellow-400 focus-visible:ring-yellow-400' : 'hover:bg-yellow-50 text-yellow-600 focus-visible:ring-yellow-500'),
    color === 'red' && (isDark ? 'hover:bg-red-900/50 text-red-400 focus-visible:ring-red-400' : 'hover:bg-red-50 text-red-600 focus-visible:ring-red-500'),
  )

  return (
    <div className={cardClass}>
      <div className={cn('flex gap-3 flex-1 min-w-0', viewMode === 'grid' && 'flex-col items-center text-center mb-3')}>
        <UserAvatar name={user.name} size={viewMode === 'grid' ? 'md' : 'sm'} />
        <div className="flex-1 min-w-0">
          <h3 className={cn('font-semibold truncate', isDark ? 'text-white' : 'text-gray-900')}>
            {user.name || 'Nome não disponível'}
          </h3>
          <div className={cn('flex items-center gap-2 mt-1', viewMode === 'grid' && 'justify-center')}>
            <Mail className={cn('w-4 h-4 shrink-0', isDark ? 'text-gray-400' : 'text-gray-500')} aria-hidden="true" />
            <p className={cn('text-sm truncate', isDark ? 'text-gray-300' : 'text-gray-600')}>
              {user.email || 'Email não disponível'}
            </p>
          </div>
          {user.userName && (
            <p className={cn('text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
              @{user.userName}
            </p>
          )}
        </div>
      </div>

      {user.perfis && user.perfis.length > 0 && (
        <div className={cn(viewMode === 'list' ? 'sm:max-w-[200px]' : 'mb-3')}>
          {viewMode === 'grid' && <p className={cn('text-xs font-medium mb-1', isDark ? 'text-gray-400' : 'text-gray-500')}>Perfis:</p>}
          <PerfilBadges perfis={user.perfis} isDark={isDark} />
        </div>
      )}

      <div className={cn('flex gap-2', viewMode === 'list' ? 'sm:ml-auto' : 'pt-3 border-t border-border')}>
        <button onClick={() => onEdit(user)} aria-label={`Editar ${user.name}`} className={actionBtnClass('blue')}>
          <Edit3 className="w-5 h-5" aria-hidden="true" />
          {viewMode === 'grid' && <span className="text-xs font-medium">Editar</span>}
        </button>
        <button onClick={() => onResetPassword(user)} aria-label={`Resetar senha de ${user.name}`} className={actionBtnClass('yellow')}>
          <Key className="w-5 h-5" aria-hidden="true" />
          {viewMode === 'grid' && <span className="text-xs font-medium">Resetar</span>}
        </button>
        <button onClick={() => onDelete(user)} aria-label={`Excluir ${user.name}`} className={actionBtnClass('red')}>
          <Trash2 className="w-5 h-5" aria-hidden="true" />
          {viewMode === 'grid' && <span className="text-xs font-medium">Excluir</span>}
        </button>
      </div>
    </div>
  )
}
