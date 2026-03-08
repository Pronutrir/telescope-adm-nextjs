'use client'

import React from 'react'
import { Search, List, Grid, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { ViewMode } from './useUsuariosPage'

interface UsuariosToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  totalCount: number
  loading: boolean
  onRefresh: () => void
}

export const UsuariosToolbar: React.FC<UsuariosToolbarProps> = ({
  searchTerm, onSearchChange, viewMode, onViewChange,
  totalCount, loading, onRefresh,
}) => {
  const { isDark } = useTheme()

  const viewButtonClass = (active: boolean) => cn(
    'p-2 rounded-lg transition-all border',
    active
      ? 'bg-primary text-primary-foreground border-primary'
      : isDark
        ? 'hover:bg-gray-700 text-gray-400 border-gray-600'
        : 'hover:bg-gray-50 text-gray-600 border-gray-300'
  )

  return (
    <div className="flex flex-col gap-3 shrink-0">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className={cn('text-lg sm:text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
            👥 Usuários Cadastrados
          </h2>
          <p className={cn('text-sm mt-1', isDark ? 'text-gray-300' : 'text-gray-600')}>
            {totalCount} usuários encontrados{searchTerm && ' • Resultados da busca'}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          aria-label="Atualizar lista de usuários"
          className={cn(
            'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shrink-0 transition-all duration-300',
            'bg-gray-100/80 border border-gray-300 hover:bg-gray-200/80',
            'dark:bg-gray-700/80 dark:border-gray-600 dark:hover:bg-gray-600/80',
            'disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-blue-500'
          )}
        >
          <RefreshCw className={cn('w-5 h-5', loading && 'animate-spin')} aria-hidden="true" />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
            isDark ? 'text-gray-400' : 'text-gray-500'
          )} aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar por nome, email, função..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            aria-label="Buscar usuários"
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary transition-all',
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            )}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => onViewChange('list')} className={viewButtonClass(viewMode === 'list')} aria-label="Visualização em lista">
            <List className="w-5 h-5" aria-hidden="true" />
          </button>
          <button onClick={() => onViewChange('grid')} className={viewButtonClass(viewMode === 'grid')} aria-label="Visualização em grade">
            <Grid className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
