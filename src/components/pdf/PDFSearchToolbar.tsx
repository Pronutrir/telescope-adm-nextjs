'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Search, Grid, List, Layers, RefreshCw, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ViewMode } from '@/types/pdf'

interface PDFSearchToolbarProps {
  isDark: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  isSearching: boolean
  isLoading: boolean
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  isSelectionMode: boolean
  onToggleSelectionMode: () => void
  hasCustomOrder: boolean
  onResetCustomOrder: () => void
}

export const PDFSearchToolbar: React.FC<PDFSearchToolbarProps> = ({
  isDark, searchTerm, onSearchChange, isSearching, isLoading,
  viewMode, onViewModeChange, isSelectionMode, onToggleSelectionMode,
  hasCustomOrder, onResetCustomOrder,
}) => {
  const viewBtn = (mode: ViewMode, Icon: typeof Grid, active: boolean) => (
    <Button
      onClick={() => onViewModeChange(mode)}
      className={cn(
        'p-3',
        active
          ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
          : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      )}
    >
      <Icon className="w-5 h-5" />
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="🔍 Buscar PDFs no SharePoint..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn('pl-10 h-12', isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300')}
          />
          {(isSearching || isLoading) && (
            <Loader2 className="absolute right-3 top-3 w-5 h-5 animate-spin text-blue-500" />
          )}
        </div>

        <div className="flex gap-2">
          {viewBtn('grid', Grid, viewMode === 'grid')}
          {viewBtn('list', List, viewMode === 'list')}
          <Button
            onClick={onToggleSelectionMode}
            className={cn(
              'p-3',
              isSelectionMode
                ? isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            )}
            title="Modo Seleção para Unificar PDFs"
          >
            <Layers className="w-5 h-5" />
          </Button>
          {hasCustomOrder && (
            <Button
              onClick={onResetCustomOrder}
              className={cn('p-3', isDark ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600')}
              title="Resetar Ordem Personalizada"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
