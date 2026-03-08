'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import {
  useUsuariosPage,
  UsuariosHeader,
  UsuariosToolbar,
  UsuariosList,
  UsuariosModais,
} from '@/components/usuarios'

export default function UsuariosPage() {
  const { isDark } = useTheme()
  const {
    mounted,
    searchTerm, setSearchTerm,
    viewMode, setViewMode,
    usuariosFiltrados,
    loadingUsuarios, errorUsuarios,
    editingUser, isEditModalOpen, handleEditUser, handleCloseEditModal, handleEditSuccess,
    resetPasswordUser, isResetPasswordOpen, handleResetPassword, handleCloseResetPassword,
    isAddUserOpen, setIsAddUserOpen, handleAddUserSuccess,
    deleteUser, isDeleteModalOpen, handleDeleteUser, handleCloseDeleteModal, handleDeleteSuccess,
    handleRefresh,
  } = useUsuariosPage()

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-label="Carregando..." />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
      <UsuariosHeader onAddUser={() => setIsAddUserOpen(true)} />

      <div className={cn(
        'flex-1 flex flex-col mx-4 mb-4 rounded-2xl border overflow-hidden shadow-lg',
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
      )}>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col h-full space-y-4">
            <UsuariosToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              viewMode={viewMode}
              onViewChange={setViewMode}
              totalCount={usuariosFiltrados.length}
              loading={loadingUsuarios}
              onRefresh={handleRefresh}
            />
            <div className="flex-1 overflow-y-auto min-h-0">
              <UsuariosList
                usuarios={usuariosFiltrados}
                loading={loadingUsuarios}
                error={errorUsuarios}
                searchTerm={searchTerm}
                viewMode={viewMode}
                onEdit={handleEditUser}
                onResetPassword={handleResetPassword}
                onDelete={handleDeleteUser}
              />
            </div>
          </div>
        </main>
      </div>

      <UsuariosModais
        editingUser={editingUser}
        isEditModalOpen={isEditModalOpen}
        onCloseEdit={handleCloseEditModal}
        onEditSuccess={handleEditSuccess}
        resetPasswordUser={resetPasswordUser}
        isResetPasswordOpen={isResetPasswordOpen}
        onCloseResetPassword={handleCloseResetPassword}
        isAddUserOpen={isAddUserOpen}
        onCloseAddUser={() => setIsAddUserOpen(false)}
        onAddUserSuccess={handleAddUserSuccess}
        deleteUser={deleteUser}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseDelete={handleCloseDeleteModal}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
