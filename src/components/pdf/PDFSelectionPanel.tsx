'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Layers, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PDFItem } from '@/types/pdf'

interface PDFSelectionPanelProps {
  isDark: boolean
  selectedForMerge: Set<string>
  selectionOrder: string[]
  filteredPdfs: PDFItem[]
  isMerging: boolean
  formatDate: (dateStr: string) => string
  onClearSelections: () => void
  onMergePDFs: () => void
}

export const PDFSelectionPanel: React.FC<PDFSelectionPanelProps> = ({
  isDark, selectedForMerge, selectionOrder, filteredPdfs,
  isMerging, formatDate, onClearSelections, onMergePDFs,
}) => {
  if (selectedForMerge.size === 0) return null

  return (
    <div className={cn('mb-4 p-4 rounded-lg border', isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50 border-blue-200')}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-gray-900')}>
            📋 PDFs Selecionados para Unificação
          </h3>
          <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
            {selectedForMerge.size} documento{selectedForMerge.size > 1 ? 's' : ''} selecionado{selectedForMerge.size > 1 ? 's' : ''} • Ordem de unificação:
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onClearSelections} className="text-xs">
            Limpar Seleção
          </Button>
          <Button
            size="sm"
            onClick={onMergePDFs}
            disabled={selectedForMerge.size < 2 || isMerging}
            className={cn(
              'inline-flex items-center gap-2 text-xs transition-all',
              selectedForMerge.size >= 2 && !isMerging
                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                : 'opacity-50 cursor-not-allowed'
            )}
          >
            {isMerging ? <Loader2 className="w-3 h-3 animate-spin" /> : <Layers className="w-3 h-3" />}
            {isMerging ? 'Unificando...' : 'Unificar PDFs'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...new Set(selectionOrder)].map((pdfId, index) => {
          const pdf = filteredPdfs.find(p => p.id === pdfId)
          if (!pdf) return null
          return (
            <div
              key={`sel-${pdfId}`}
              className={cn('flex items-center gap-3 p-3 rounded-lg border', isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200')}
            >
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={cn('font-medium text-sm truncate', isDark ? 'text-white' : 'text-gray-900')}>{pdf.fileName}</h4>
                <p className={cn('text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-500')}>
                  {pdf.size} • {formatDate(pdf.uploadDate)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
