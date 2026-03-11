'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, FolderOpen, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SortableTelescopePDFList } from './SortableTelescopePDFList'
import { PDFItem, ViewMode } from '@/types/pdf'

interface PDFContentAreaProps {
  isDark: boolean
  isLoading: boolean
  pdfs: PDFItem[]
  searchTerm: string
  viewMode: ViewMode
  isSelectionMode: boolean
  selectedForMerge: Set<string>
  selectionOrder: string[]
  formatDate: (dateStr: string) => string
  onUpload: () => void
  onViewPDF: (pdf: PDFItem) => void
  onEditPDF: (pdf: PDFItem) => void
  onSelectPDF: (pdfId: string) => void
  onSortEnd: (sortedPDFs: PDFItem[]) => void
}

export const PDFContentArea: React.FC<PDFContentAreaProps> = ({
  isDark, isLoading, pdfs, searchTerm, viewMode,
  isSelectionMode, selectedForMerge, selectionOrder, formatDate,
  onUpload, onViewPDF, onEditPDF, onSelectPDF, onSortEnd,
}) => {
  if (isLoading && pdfs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
            📡 Carregando PDFs do SharePoint...
          </p>
        </div>
      </div>
    )
  }

  if (pdfs.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <FolderOpen className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-400')} />
        <h3 className={cn('text-lg font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
          {searchTerm ? 'Nenhum PDF encontrado' : 'Nenhum PDF disponível'}
        </h3>
        <p className={cn('text-sm mb-6', isDark ? 'text-gray-500' : 'text-gray-500')}>
          {searchTerm
            ? `Não encontramos PDFs que correspondam a "${searchTerm}"`
            : 'Não há arquivos PDF disponíveis no SharePoint'}
        </p>
        {!searchTerm && (
          <Button
            onClick={onUpload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
          >
            <Upload className="w-5 h-5" /> Fazer Upload de PDF
          </Button>
        )}
      </div>
    )
  }

  return (
    <SortableTelescopePDFList
      items={pdfs}
      onSortEnd={onSortEnd}
      onViewPDF={onViewPDF}
      onEditPDF={onEditPDF}
      onSelectPDF={onSelectPDF}
      isDark={isDark}
      viewMode={viewMode}
      isSelectionMode={isSelectionMode}
      selectedItems={selectedForMerge}
      selectionOrder={selectionOrder}
      formatDate={formatDate}
      animation={200}
      disabled={false}
      gridCols={4}
      className="transition-all duration-300"
    />
  )
}
