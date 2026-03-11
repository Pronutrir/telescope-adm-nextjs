'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PDFItem, ViewMode } from '@/types/pdf'
import { usePDFManager } from '@/hooks/usePDFManager'
import PDFManagerService from '@/services/pdfManager/pdfManagerService'

export const useGerenciadorPDFs = () => {
  const router = useRouter()
  const {
    pdfs, filteredPdfs, isLoading, error, totalItems,
    currentPage, totalPages, loadPDFs, searchPDFs, refreshPDFs, clearError,
  } = usePDFManager()

  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [customPDFOrder, setCustomPDFOrder] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
    loadPDFs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = useCallback(async (term: string) => {
    setIsSearching(true)
    try {
      if (term.trim() === '') await loadPDFs()
      else await searchPDFs(term)
    } finally {
      setIsSearching(false)
    }
  }, [loadPDFs, searchPDFs])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.length >= 3 || searchTerm.length === 0) handleSearch(searchTerm)
    }, 500)
    return () => clearTimeout(timeout)
  }, [searchTerm, handleSearch])

  useEffect(() => {
    if (filteredPdfs.length > 0 && customPDFOrder.length > 0) {
      const currentIds = new Set(filteredPdfs.map(p => p.id))
      const kept = customPDFOrder.filter(id => currentIds.has(id))
      if (kept.length < customPDFOrder.length * 0.7) setCustomPDFOrder([])
    }
  }, [filteredPdfs, customPDFOrder])

  const handleUpload = useCallback(() => {
    window.location.href = '/admin/gerenciador-pdfs/upload'
  }, [])

  const handleUnifiedPDFs = useCallback(() => {
    router.push('/admin/gerenciador-pdfs/unificados')
  }, [router])

  const getOrderedPDFs = useCallback((items: PDFItem[]): PDFItem[] => {
    if (customPDFOrder.length === 0) return items
    const map = new Map(items.map(p => [p.id, p]))
    const ordered: PDFItem[] = []
    const used = new Set<string>()
    customPDFOrder.forEach(id => {
      const pdf = map.get(id)
      if (pdf) { ordered.push(pdf); used.add(id) }
    })
    items.forEach(p => { if (!used.has(p.id)) ordered.push(p) })
    return ordered
  }, [customPDFOrder])

  const resetCustomOrder = useCallback(() => setCustomPDFOrder([]), [])

  const formatDate = useCallback((dateStr: string) => {
    try { return PDFManagerService.formatDate(dateStr) }
    catch { return 'Data inválida' }
  }, [])

  return {
    pdfs, filteredPdfs, isLoading, error, totalItems,
    currentPage, totalPages, loadPDFs, refreshPDFs, clearError,
    mounted, searchTerm, setSearchTerm, isSearching,
    viewMode, setViewMode, customPDFOrder, setCustomPDFOrder,
    handleUpload, handleUnifiedPDFs, getOrderedPDFs, resetCustomOrder, formatDate,
  }
}
