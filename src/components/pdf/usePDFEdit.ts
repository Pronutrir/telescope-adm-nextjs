'use client'

import { useState, useCallback } from 'react'
import { PDFItem } from '@/types/pdf'
import PDFManagerService from '@/services/pdfManager/pdfManagerService'

export interface EditState {
  isOpen: boolean
  selectedPdf: PDFItem | null
  form: { fileName: string }
  pages: Array<{ pageNumber: number; selected: boolean; thumbnail?: string }>
  isLoading: boolean
  isLoadingPages: boolean
}

interface UsePDFEditParams {
  refreshPDFs: () => Promise<void>
  showSuccess: (msg: string) => void
  showError: (msg: string) => void
}

const INITIAL_STATE: EditState = {
  isOpen: false,
  selectedPdf: null,
  form: { fileName: '' },
  pages: [],
  isLoading: false,
  isLoadingPages: false,
}

export const usePDFEdit = ({ refreshPDFs, showSuccess, showError }: UsePDFEditParams) => {
  const [editState, setEditState] = useState<EditState>(INITIAL_STATE)

  const openEditModal = useCallback(async (pdf: PDFItem) => {
    setEditState({
      isOpen: true,
      selectedPdf: pdf,
      form: { fileName: pdf.fileName },
      pages: [],
      isLoading: false,
      isLoadingPages: true,
    })

    try {
      const response = await fetch(`/api/pdfs/details/${encodeURIComponent(pdf.id)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error(`Erro na API: ${response.status} ${response.statusText}`)

      const pdfDetails = await response.json()
      const realPages = Array.from({ length: pdfDetails.pageCount }, (_, i) => ({
        pageNumber: i + 1,
        selected: true,
        thumbnail: undefined,
      }))

      setEditState(prev => ({ ...prev, pages: realPages, isLoadingPages: false }))
    } catch (error) {
      setEditState(prev => ({
        ...prev,
        pages: [{ pageNumber: 1, selected: true, thumbnail: undefined }],
        isLoadingPages: false,
      }))
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      showError(`Erro ao carregar detalhes do PDF: ${msg}`)
    }
  }, [showError])

  const closeEditModal = useCallback(() => setEditState(INITIAL_STATE), [])

  const togglePageSelection = useCallback((pageNumber: number) => {
    setEditState(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p
      ),
    }))
  }, [])

  const toggleAllPages = useCallback(() => {
    setEditState(prev => {
      const allSelected = prev.pages.every(p => p.selected)
      return { ...prev, pages: prev.pages.map(p => ({ ...p, selected: !allSelected })) }
    })
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editState.selectedPdf || !editState.form.fileName.trim()) return

    setEditState(prev => ({ ...prev, isLoading: true }))

    try {
      const pagesToRemove = editState.pages.filter(p => !p.selected).map(p => p.pageNumber)

      const response = await PDFManagerService.editarPdf({
        pdfId: editState.selectedPdf.id,
        pagesToRemove,
        outputFileName: editState.form.fileName,
      })

      if (response.ok) {
        showSuccess('PDF editado com sucesso!')
        closeEditModal()
        refreshPDFs()
      } else {
        throw new Error('Falha na edição do PDF')
      }
    } catch {
      showError('Erro ao salvar as alterações. Tente novamente.')
    } finally {
      setEditState(prev => ({ ...prev, isLoading: false }))
    }
  }, [editState.selectedPdf, editState.form.fileName, editState.pages, showSuccess, showError, closeEditModal, refreshPDFs])

  return {
    editState,
    setEditState,
    openEditModal,
    closeEditModal,
    togglePageSelection,
    toggleAllPages,
    handleSaveEdit,
  }
}
