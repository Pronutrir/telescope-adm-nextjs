'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useUserShield } from '@/hooks/useUserShield'
import { UserShieldUser } from '@/services/userShieldService'

export type ViewMode = 'grid' | 'list'

export const useUsuariosPage = () => {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const [editingUser, setEditingUser] = useState<UserShieldUser | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [resetPasswordUser, setResetPasswordUser] = useState<UserShieldUser | null>(null)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<UserShieldUser | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { usuarios, loadingUsuarios, errorUsuarios, listarUsuarios } = useUserShield()

  useEffect(() => { setMounted(true) }, [])

  const usuariosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return usuarios
    const termo = searchTerm.toLowerCase()
    return usuarios.filter((user: UserShieldUser) =>
      user.name?.toLowerCase().includes(termo) ||
      user.email?.toLowerCase().includes(termo) ||
      user.userName?.toLowerCase().includes(termo) ||
      user.role?.toLowerCase().includes(termo) ||
      user.department?.toLowerCase().includes(termo) ||
      user.perfis?.some(p => p.nomePerfil?.toLowerCase().includes(termo))
    )
  }, [searchTerm, usuarios])

  const handleRefresh = useCallback(async () => {
    await listarUsuarios(true)
  }, [listarUsuarios])

  const handleEditUser = useCallback((user: UserShieldUser) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }, [])

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false)
    setEditingUser(null)
  }, [])

  const handleEditSuccess = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await listarUsuarios(true)
    setIsEditModalOpen(false)
    setEditingUser(null)
  }, [listarUsuarios])

  const handleResetPassword = useCallback((user: UserShieldUser) => {
    setResetPasswordUser(user)
    setIsResetPasswordOpen(true)
  }, [])

  const handleCloseResetPassword = useCallback(() => {
    setIsResetPasswordOpen(false)
    setResetPasswordUser(null)
  }, [])

  const handleDeleteUser = useCallback((user: UserShieldUser) => {
    setDeleteUser(user)
    setIsDeleteModalOpen(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setDeleteUser(null)
  }, [])

  const handleDeleteSuccess = useCallback(async () => {
    await listarUsuarios(true)
    setIsDeleteModalOpen(false)
    setDeleteUser(null)
  }, [listarUsuarios])

  const handleAddUserSuccess = useCallback(async () => {
    await listarUsuarios(true)
  }, [listarUsuarios])

  return {
    mounted,
    searchTerm, setSearchTerm,
    viewMode, setViewMode,
    usuariosFiltrados,
    loadingUsuarios, errorUsuarios,
    editingUser, isEditModalOpen,
    handleEditUser, handleCloseEditModal, handleEditSuccess,
    resetPasswordUser, isResetPasswordOpen,
    handleResetPassword, handleCloseResetPassword,
    isAddUserOpen, setIsAddUserOpen, handleAddUserSuccess,
    deleteUser, isDeleteModalOpen,
    handleDeleteUser, handleCloseDeleteModal, handleDeleteSuccess,
    handleRefresh,
  }
}
