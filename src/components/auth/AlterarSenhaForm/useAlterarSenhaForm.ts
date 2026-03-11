'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { useNotifications } from '@/contexts/NotificationContext'

const passwordSchema = Yup.object({
  currentPassword: Yup.string(),
  newPassword: Yup.string()
    .required('Nova senha é obrigatória')
    .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
    .matches(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .matches(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .matches(/[0-9]/, 'Deve conter pelo menos um número')
    .matches(/[@$!%*?&#]/, 'Deve conter pelo menos um caractere especial (@$!%*?&#)'),
  confirmPassword: Yup.string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([Yup.ref('newPassword')], 'As senhas não coincidem'),
})

export type PasswordStrength = {
  value: number
  label: string
  color: string
}

const STRENGTH_LABELS = ['Muito Fraca', 'Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte']
const STRENGTH_COLORS = ['#ef4444', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981']

export const getPasswordStrength = (password: string): PasswordStrength => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.match(/[A-Z]/)) strength++
  if (password.match(/[a-z]/)) strength++
  if (password.match(/[0-9]/)) strength++
  if (password.match(/[@$!%*?&#]/)) strength++

  return {
    value: strength,
    label: STRENGTH_LABELS[strength] ?? 'Muito Fraca',
    color: STRENGTH_COLORS[strength] ?? '#ef4444',
  }
}

export const useAlterarSenhaForm = () => {
  const { isDark } = useTheme()
  const { isMobile } = useLayout()
  const router = useRouter()
  const { showSuccess, showError } = useNotifications()

  const [isLoading, setIsLoading] = useState(false)
  const [savedPassword, setSavedPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const password = sessionStorage.getItem('temp_password')
    if (password) {
      setSavedPassword(password)
      sessionStorage.removeItem('temp_password')
    }
  }, [])

  const toggleCurrentPassword = useCallback(() => setShowCurrentPassword(v => !v), [])
  const toggleNewPassword = useCallback(() => setShowNewPassword(v => !v), [])
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword(v => !v), [])

  const formik = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const currentPassword = savedPassword || values.currentPassword
        if (!currentPassword) {
          showError('Por favor, digite sua senha atual.', {
            title: 'Senha Atual Necessária',
            duration: 0,
          })
          return
        }

        const response = await fetch('/api/auth/update-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: currentPassword, newPassword: values.newPassword }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          showSuccess('Senha alterada com sucesso! Redirecionando...', {
            title: 'Sucesso',
            duration: 2000,
          })
          setTimeout(() => router.push('/admin/gerenciador-pdfs'), 500)
        } else {
          showError(data.message || 'Erro ao alterar senha. Verifique sua senha atual.', {
            title: 'Erro na Alteração',
            duration: 0,
          })
        }
      } catch {
        showError('Erro de conexão com o servidor. Tente novamente.', {
          title: 'Erro de Conexão',
          duration: 0,
        })
      } finally {
        setIsLoading(false)
      }
    },
  })

  const passwordStrength = getPasswordStrength(formik.values.newPassword)

  return {
    isDark,
    isMobile,
    isLoading,
    savedPassword,
    formik,
    passwordStrength,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    toggleCurrentPassword,
    toggleNewPassword,
    toggleConfirmPassword,
  }
}
