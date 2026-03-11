'use client'

import { useState, useCallback } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotify } from '@/contexts/NotificationContext'

export interface IServerLoginValues {
  User: string
  Password: string
}

const validationSchema = Yup.object().shape({
  User: Yup.string()
    .required('Usuário é obrigatório!')
    .min(3, 'O usuário deve ter no mínimo 3 caracteres!')
    .max(50, 'O usuário deve ter no máximo 50 caracteres!'),
  Password: Yup.string()
    .required('A senha é obrigatória!')
    .min(3, 'A senha deve ter no mínimo 3 caracteres!')
    .max(100, 'A senha deve ter no máximo 100 caracteres!'),
})

function classifyError(message: string): string {
  if (message.includes('usuário') || message.includes('user')) return 'Usuário não encontrado. O usuário informado não existe no sistema.'
  if (message.includes('senha') || message.includes('password')) return 'Senha incorreta. A senha informada está incorreta.'
  if (message.includes('bloqueado') || message.includes('blocked')) return 'Usuário bloqueado. Contate o administrador.'
  if (message.includes('expirado') || message.includes('expired')) return 'Sessão expirada. Faça login novamente.'
  return `${message}. Verifique seu usuário e senha.`
}

function classifyConnectionError(error: unknown): string {
  if (error instanceof TypeError && error.message.includes('fetch')) return 'Servidor indisponível. Tente novamente em alguns minutos.'
  if (error instanceof Error && error.message.includes('timeout')) return 'Timeout na conexão. A requisição demorou muito para responder.'
  if (error instanceof Error && error.message.includes('network')) return 'Erro de rede. Verifique sua conexão com a internet.'
  return 'Erro de conexão com o servidor. Verifique sua conexão.'
}

export const useServerLoginForm = () => {
  const { isDark } = useTheme()
  const notify = useNotify()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (values: IServerLoginValues) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.User, password: values.Password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.requiresPasswordChange === true) {
          sessionStorage.setItem('temp_password', values.Password)
          notify.warning('Você precisa alterar sua senha antes de continuar.', {
            title: 'Alteração de Senha Obrigatória',
            duration: 2000,
          })
          setTimeout(() => { window.location.href = '/auth/alterar-senha' }, 500)
          return
        }

        notify.success('Login realizado com sucesso! Redirecionando...', {
          title: 'Sucesso',
          duration: 3000,
        })

        const preferredPage = data.preferredHomePage || '/admin/dashboard'
        setTimeout(() => { window.location.href = preferredPage }, 1500)
      } else {
        const message = classifyError(data.message || 'Credenciais inválidas')
        notify.error(message, {
          title: 'Falha na Autenticação',
          duration: 0,
          actions: [{ label: 'Tentar novamente', onClick: () => formik.resetForm(), variant: 'primary' }],
        })
      }
    } catch (error) {
      notify.error(classifyConnectionError(error), {
        title: 'Problema de Conectividade',
        duration: 0,
        actions: [{ label: 'Tentar novamente', onClick: () => formik.handleSubmit(), variant: 'primary' }],
      })
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notify])

  const formik = useFormik<IServerLoginValues>({
    initialValues: { User: '', Password: '' },
    validationSchema,
    onSubmit: handleSubmit,
  })

  return { isDark, isLoading, formik }
}
