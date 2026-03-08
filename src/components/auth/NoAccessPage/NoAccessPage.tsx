'use client'

import React from 'react'
import { ShieldAlert, LogOut, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useNoAccessPage } from './useNoAccessPage'

export const NoAccessPage: React.FC = () => {
  const { isDark, isMobile, user, handleLogout, handleGoHome } = useNoAccessPage()

  if (!user) return null

  const userName = user.nomeCompleto || user.username
  const hasRoles = user.roles && user.roles.length > 0

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center',
        'bg-gradient-to-br from-red-500 to-orange-600',
        isMobile ? 'p-3' : 'p-4'
      )}
    >
      <div
        className={cn(
          'max-w-md w-full rounded-2xl shadow-2xl text-center',
          isMobile ? 'p-6' : 'p-8',
          isDark
            ? 'bg-gray-900/95 backdrop-blur-lg border border-gray-700'
            : 'bg-white/95 backdrop-blur-lg'
        )}
        role="main"
        aria-labelledby="no-access-title"
      >
        <NoAccessIcon isDark={isDark} />

        <h1
          id="no-access-title"
          className={cn(
            'font-bold mb-4',
            isMobile ? 'text-2xl' : 'text-3xl',
            isDark ? 'text-gray-100' : 'text-gray-800'
          )}
        >
          Acesso Negado
        </h1>

        <p className={cn('mb-2', isDark ? 'text-gray-300' : 'text-gray-600')}>
          Olá,{' '}
          <span className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-800')}>
            {userName}
          </span>
        </p>

        <p className={cn('mb-8', isDark ? 'text-gray-300' : 'text-gray-600')}>
          Sua conta não possui permissões para acessar nenhuma área do sistema.
          Entre em contato com o administrador para solicitar as permissões necessárias.
        </p>

        <div className="space-y-3">
          <Button variant="primary" icon={Home} onClick={handleGoHome} className="w-full">
            Voltar ao Início
          </Button>
          <Button variant="error" icon={LogOut} onClick={handleLogout} className="w-full">
            Sair do Sistema
          </Button>
        </div>

        <RolesBadges roles={user.roles} isDark={isDark} />
      </div>
    </div>
  )
}

// --- Sub-components ---

interface NoAccessIconProps {
  isDark: boolean
}

const NoAccessIcon: React.FC<NoAccessIconProps> = ({ isDark }) => (
  <div
    className={cn(
      'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6',
      isDark ? 'bg-red-900/50' : 'bg-red-100'
    )}
    aria-hidden="true"
  >
    <ShieldAlert
      className={cn('w-12 h-12', isDark ? 'text-red-400' : 'text-red-600')}
    />
  </div>
)

interface Role {
  perfis: { nomePerfil: string }
}

interface RolesBadgesProps {
  roles: Role[] | undefined
  isDark: boolean
}

const RolesBadges: React.FC<RolesBadgesProps> = ({ roles, isDark }) => (
  <div
    className={cn(
      'mt-8 pt-6 border-t',
      isDark ? 'border-gray-700' : 'border-gray-200'
    )}
  >
    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
      Suas permissões atuais:
    </p>
    <div className="mt-2 flex flex-wrap gap-2 justify-center">
      {roles && roles.length > 0 ? (
        roles.map((role, index) => (
          <span
            key={index}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            )}
          >
            {role.perfis.nomePerfil}
          </span>
        ))
      ) : (
        <span
          className={cn('text-sm italic', isDark ? 'text-gray-500' : 'text-gray-400')}
        >
          Nenhuma permissão atribuída
        </span>
      )}
    </div>
  </div>
)
