'use client'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { useAuth } from '@/contexts/AuthContext'

export interface IRecoveryValues {
  username: string
  newPassword: string
  confirmPassword: string
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Usuário é obrigatório!')
    .min(6, 'O usuário deve ter no mínimo 6 caracteres!'),
  newPassword: Yup.string()
    .required('Nova senha é obrigatória!')
    .min(6, 'A senha deve ter no mínimo 6 caracteres!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'A senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número'
    ),
  confirmPassword: Yup.string()
    .required('Confirmação de senha é obrigatória!')
    .oneOf([Yup.ref('newPassword')], 'As senhas devem ser iguais!'),
})

export const useRecoveryForm = () => {
  const { isDark } = useTheme()
  const { isMobile } = useLayout()
  const { updatePassword, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const username = searchParams.get('username') ?? ''

  const handleSubmit = useCallback(async (values: IRecoveryValues) => {
    await updatePassword(values.username, values.newPassword)
  }, [updatePassword])

  const formik = useFormik<IRecoveryValues>({
    initialValues: { username, newPassword: '', confirmPassword: '' },
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  })

  return { isDark, isMobile, isLoading, formik }
}
