'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PDFItem } from '@/types/pdf'
import { useGerenciadorPDFs } from './useGerenciadorPDFs'
import { usePDFSelection } from './usePDFSelection'
import { usePDFMerge, type NomeComposicao } from './usePDFMerge'
import { usePDFEdit } from './usePDFEdit'
import { PDFPageHeader } from './PDFPageHeader'
import { PDFSearchToolbar } from './PDFSearchToolbar'
import { MergeProgressBanner } from './MergeProgressBanner'
import { PDFSelectionPanel } from './PDFSelectionPanel'
import { PDFContentArea } from './PDFContentArea'
import { PDFEditModal } from './PDFEditModal'
import { PDFMergeModal } from './PDFMergeModal'

export const GerenciadorPDFsClient: React.FC = () => {
  const { isDark } = useTheme()
  const { showSuccess, showError, showWarning } = useNotifications()

  const page = useGerenciadorPDFs()
  const selection = usePDFSelection()
  const merge = usePDFMerge({
    filteredPdfs: page.filteredPdfs,
    selectedForMerge: selection.selectedForMerge,
    selectionOrder: selection.selectionOrder,
    disableSelectionMode: selection.disableSelectionMode,
    showSuccess, showError, showWarning,
  })
  const edit = usePDFEdit({ refreshPDFs: page.refreshPDFs, showSuccess, showError })

  const handleViewPDF = (pdf: PDFItem) => {
    if (!pdf.url || pdf.url === '#') {
      showError('URL do PDF não está disponível para visualização.')
      return
    }
    window.open(pdf.url, '_blank', 'noopener,noreferrer')
  }

  const handlePDFSort = (sortedPDFs: PDFItem[]) => {
    page.setCustomPDFOrder(sortedPDFs.map(p => p.id))
    selection.updateSelectionOrder(
      sortedPDFs.filter(p => selection.selectedForMerge.has(p.id)).map(p => p.id)
    )
  }

  const handleFileNameChange = (value: string) => {
    edit.setEditState(prev => ({ ...prev, form: { ...prev.form, fileName: value } }))
  }

  const handleNomeChange = (field: keyof NomeComposicao, value: string) => {
    merge.setNomeComposicao(prev => ({ ...prev, [field]: value }))
  }

  if (!page.mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  const uniquePdfs = page.filteredPdfs.filter((pdf, i, arr) => arr.findIndex(p => p.id === pdf.id) === i)
  const orderedPdfs = page.getOrderedPDFs(uniquePdfs)

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full h-full flex flex-col px-3 sm:px-4 py-4 gap-4 overflow-hidden">
        <PDFPageHeader
          isDark={isDark} totalItems={page.totalItems} currentPage={page.currentPage}
          totalPages={page.totalPages} isLoading={page.isLoading}
          onUpload={page.handleUpload} onUnifiedPDFs={page.handleUnifiedPDFs} onRefresh={page.refreshPDFs}
        />

        {page.error && !page.error.includes('demonstração') && !page.error.includes('indisponível') && (
          <div className={cn('p-4 rounded-lg border-l-4 border-red-500', isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700')}>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">❌ Erro de Conexão</span>
            </div>
            <p className="mt-1 text-sm">{page.error}</p>
            <Button onClick={page.clearError} className="mt-2 text-sm underline opacity-80 hover:opacity-100">Tentar novamente</Button>
          </div>
        )}

        <MergeProgressBanner isDark={isDark} mergeProgress={merge.mergeProgress} isMerging={merge.isMerging} />

        <PDFSearchToolbar
          isDark={isDark} searchTerm={page.searchTerm} onSearchChange={page.setSearchTerm}
          isSearching={page.isSearching} isLoading={page.isLoading} viewMode={page.viewMode}
          onViewModeChange={page.setViewMode} isSelectionMode={selection.isSelectionMode}
          onToggleSelectionMode={selection.toggleSelectionMode}
          hasCustomOrder={page.customPDFOrder.length > 0} onResetCustomOrder={page.resetCustomOrder}
        />

        <div className="flex-1 min-h-0 overflow-hidden">
          {selection.isSelectionMode && (
            <PDFSelectionPanel
              isDark={isDark} selectedForMerge={selection.selectedForMerge}
              selectionOrder={selection.selectionOrder} filteredPdfs={page.filteredPdfs}
              isMerging={merge.isMerging} formatDate={page.formatDate}
              onClearSelections={selection.clearSelections} onMergePDFs={merge.handleMergePDFs}
            />
          )}
          <PDFContentArea
            isDark={isDark} isLoading={page.isLoading} pdfs={orderedPdfs}
            searchTerm={page.searchTerm} viewMode={page.viewMode}
            isSelectionMode={selection.isSelectionMode} selectedForMerge={selection.selectedForMerge}
            selectionOrder={selection.selectionOrder} formatDate={page.formatDate}
            onUpload={page.handleUpload} onViewPDF={handleViewPDF}
            onEditPDF={(pdf) => edit.openEditModal(pdf)} onSelectPDF={selection.togglePDFSelection}
            onSortEnd={handlePDFSort}
          />
        </div>
      </div>

      <PDFEditModal
        isDark={isDark} editState={edit.editState} onClose={edit.closeEditModal}
        onSaveEdit={edit.handleSaveEdit} onTogglePage={edit.togglePageSelection}
        onToggleAllPages={edit.toggleAllPages} onFileNameChange={handleFileNameChange}
      />

      <PDFMergeModal
        isDark={isDark} isOpen={merge.showCompositionModal}
        nomeComposicao={merge.nomeComposicao} isMerging={merge.isMerging}
        onNomeChange={handleNomeChange} onConfirm={merge.handleConfirmMerge}
        onClose={() => merge.setShowCompositionModal(false)}
      />
    </div>
  )
}
