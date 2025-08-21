'use client'

import { useState } from 'react'

interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void | Promise<void>
  isLoading: boolean
  variant: 'danger' | 'warning' | 'info'
}

export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm: () => {},
    isLoading: false,
    variant: 'info'
  })

  const openDialog = ({
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    variant = 'info'
  }: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void | Promise<void>
    variant?: 'danger' | 'warning' | 'info'
  }) => {
    setDialog({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      isLoading: false,
      variant
    })
  }

  const closeDialog = () => {
    setDialog(prev => ({
      ...prev,
      isOpen: false
    }))
  }

  const handleConfirm = async () => {
    try {
      setDialog(prev => ({ ...prev, isLoading: true }))
      await dialog.onConfirm()
      closeDialog()
    } catch (error) {
      console.error('Erro na confirmação:', error)
      setDialog(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  return {
    dialog,
    openDialog,
    closeDialog,
    handleConfirm
  }
}
