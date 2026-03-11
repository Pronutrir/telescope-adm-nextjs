'use client'

import React from 'react'
import { UserShieldUser } from '@/services/userShieldService'
import EditUserModal from '@/components/usuarios/EditUserModal'
import ResetPasswordModal from '@/components/usuarios/ResetPasswordModal'
import AddUserModal from '@/components/usuarios/AddUserModal'
import DeleteUserModal from '@/components/usuarios/DeleteUserModal'

interface UsuariosModaisProps {
  editingUser: UserShieldUser | null
  isEditModalOpen: boolean
  onCloseEdit: () => void
  onEditSuccess: () => void

  resetPasswordUser: UserShieldUser | null
  isResetPasswordOpen: boolean
  onCloseResetPassword: () => void

  isAddUserOpen: boolean
  onCloseAddUser: () => void
  onAddUserSuccess: () => void

  deleteUser: UserShieldUser | null
  isDeleteModalOpen: boolean
  onCloseDelete: () => void
  onDeleteSuccess: () => void
}

export const UsuariosModais: React.FC<UsuariosModaisProps> = ({
  editingUser, isEditModalOpen, onCloseEdit, onEditSuccess,
  resetPasswordUser, isResetPasswordOpen, onCloseResetPassword,
  isAddUserOpen, onCloseAddUser, onAddUserSuccess,
  deleteUser, isDeleteModalOpen, onCloseDelete, onDeleteSuccess,
}) => (
  <>
    {editingUser && (
      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={onCloseEdit}
        onSuccess={onEditSuccess}
      />
    )}

    {resetPasswordUser && (
      <ResetPasswordModal
        user={{
          id: resetPasswordUser.id,
          name: resetPasswordUser.name || 'Usuário',
          userName: resetPasswordUser.userName || 'usuario',
          email: resetPasswordUser.email,
        }}
        isOpen={isResetPasswordOpen}
        onClose={onCloseResetPassword}
        onSuccess={() => {}}
      />
    )}

    <AddUserModal
      isOpen={isAddUserOpen}
      onClose={onCloseAddUser}
      onSuccess={onAddUserSuccess}
    />

    <DeleteUserModal
      isOpen={isDeleteModalOpen}
      onClose={onCloseDelete}
      onSuccess={onDeleteSuccess}
      user={deleteUser}
    />
  </>
)
