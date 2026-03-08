'use client'

import { useState, useCallback, startTransition } from 'react'

export const usePDFSelection = () => {
  const [selectionOrder, setSelectionOrder] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedForMerge, setSelectedForMerge] = useState<Set<string>>(new Set())
  const [isToggling, setIsToggling] = useState(false)

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => !prev)
    setSelectedForMerge(new Set())
    setSelectionOrder([])
  }, [])

  const disableSelectionMode = useCallback(() => {
    setIsSelectionMode(false)
    setSelectedForMerge(new Set())
    setSelectionOrder([])
  }, [])

  const togglePDFSelection = useCallback((pdfId: string) => {
    if (!isSelectionMode || isToggling) return

    setIsToggling(true)
    setTimeout(() => setIsToggling(false), 300)

    startTransition(() => {
      setSelectedForMerge(prev => {
        const next = new Set(prev)
        if (next.has(pdfId)) next.delete(pdfId)
        else next.add(pdfId)
        return next
      })
      setSelectionOrder(prev =>
        prev.includes(pdfId) ? prev.filter(id => id !== pdfId) : [...prev, pdfId]
      )
    })
  }, [isSelectionMode, isToggling])

  const clearSelections = useCallback(() => {
    setSelectedForMerge(new Set())
    setSelectionOrder([])
  }, [])

  const updateSelectionOrder = useCallback((newOrder: string[]) => {
    setSelectionOrder(newOrder)
  }, [])

  return {
    selectionOrder,
    isSelectionMode,
    selectedForMerge,
    toggleSelectionMode,
    togglePDFSelection,
    clearSelections,
    disableSelectionMode,
    updateSelectionOrder,
  }
}
