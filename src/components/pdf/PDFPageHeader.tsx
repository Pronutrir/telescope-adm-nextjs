'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Upload, Layers, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PDFPageHeaderProps {
  isDark: boolean
  totalItems: number
  currentPage: number
  totalPages: number
  isLoading: boolean
  onUpload: () => void
  onUnifiedPDFs: () => void
  onRefresh: () => Promise<void>
}

export const PDFPageHeader: React.FC<PDFPageHeaderProps> = ({
  isDark, totalItems, currentPage, totalPages,
  isLoading, onUpload, onUnifiedPDFs, onRefresh,
}) => (
  <div className="w-full shrink-0">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h1 className={cn('text-xl sm:text-2xl font-bold truncate', isDark ? 'text-white' : 'text-gray-900')}>
          📁 Gerenciador de PDFs
        </h1>
        <p className={cn('mt-1 text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
          Sistema avançado de gerenciamento de documentos PDF via SharePoint
        </p>
        {totalItems > 0 && (
          <p className={cn('mt-2 text-sm font-medium', isDark ? 'text-blue-400' : 'text-blue-600')}>
            📊 {totalItems} PDFs encontrados
            {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Upload className="w-5 h-5" />
          📤 Upload
        </Button>
        <Button
          onClick={onUnifiedPDFs}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Layers className="w-5 h-5" />
          📚 PDFs Unificados
        </Button>
        <Button
          onClick={onRefresh}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-white shadow-lg hover:shadow-xl transform hover:scale-105',
            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'
          )}
          disabled={isLoading}
        >
          <RefreshCw className={cn('w-5 h-5', isLoading && 'animate-spin')} />
          🔄 Atualizar
        </Button>
      </div>
    </div>
  </div>
)
