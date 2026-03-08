'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useUserProfile, useEstabelecimentos, useTiposUsuario } from '@/hooks/useUserProfile'
import { User as UserType } from '@/types/user'

export interface UserProfileFormValues {
    id: string | number
    username: string
    nomeCompleto: string
    cpf: string
    cnpj: string
    email: string
    telefone: string
    celular: string
    endereco: string
    estabelecimento: string | number
    tipoUsuario: string
    ativo: boolean
    integraApi: boolean
    tempoAcesso: number
}

export interface FormNotificationState {
    show: boolean
    type: 'success' | 'error' | 'warning'
    message: string
}

const validationSchema = Yup.object({
    nomeCompleto: Yup.string()
        .min(10, 'O nome deve conter no mínimo 10 caracteres')
        .max(100, 'O nome deve conter no máximo 100 caracteres')
        .required('É necessário informar o nome completo'),
    email: Yup.string()
        .email('Email inválido')
        .required('É necessário informar o email'),
    telefone: Yup.string().nullable(),
    celular: Yup.string().nullable(),
    endereco: Yup.string().nullable(),
    estabelecimento: Yup.number().required('É necessário selecionar o estabelecimento'),
})

export const useProfileForm = (
    user: UserType,
    setExternalLoading?: (loading: boolean) => void,
) => {
    const { updateUserProfile, isLoading: hookLoading, error: hookError, success } = useUserProfile(user.id)
    const { estabelecimentos } = useEstabelecimentos()
    const { tiposUsuario } = useTiposUsuario()

    const [notification, setNotification] = useState<FormNotificationState>({
        show: false,
        type: 'success',
        message: '',
    })

    const showNotification = (type: FormNotificationState['type'], message: string) => {
        setNotification({ show: true, type, message })
        setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000)
    }

    const formik = useFormik<UserProfileFormValues>({
        initialValues: {
            id: user?.id || '',
            username: user?.username || '',
            nomeCompleto: user?.nomeCompleto || '',
            cpf: user?.cpf || '',
            cnpj: user?.cnpj || '',
            email: user?.email || '',
            telefone: user?.telefone || '',
            celular: user?.celular || '',
            endereco: user?.endereco || '',
            estabelecimento: user?.estabelecimento || '',
            tipoUsuario: user?.tipoUsuario || '',
            ativo: user?.ativo ?? true,
            integraApi: user?.integraApi ?? false,
            tempoAcesso: user?.tempoAcesso || 0,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const hasChanges =
                values.nomeCompleto !== user?.nomeCompleto ||
                values.cpf !== user?.cpf ||
                values.cnpj !== user?.cnpj ||
                values.email !== user?.email ||
                values.telefone !== user?.telefone ||
                values.celular !== user?.celular ||
                values.endereco !== user?.endereco

            if (!hasChanges) {
                showNotification('warning', 'É obrigatório realizar alguma modificação sobre seus dados!')
                return
            }

            if (setExternalLoading) setExternalLoading(true)
            try {
                await updateUserProfile({
                    nomeCompleto: values.nomeCompleto,
                    cpf: values.cpf,
                    cnpj: values.cnpj,
                    estabelecimento: values.estabelecimento,
                    email: values.email,
                    telefone: values.telefone,
                    celular: values.celular,
                    endereco: values.endereco,
                })
                showNotification('success', 'Os dados foram atualizados com sucesso!')
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Erro ao atualizar dados.'
                showNotification('error', hookError || message)
            } finally {
                if (setExternalLoading) setExternalLoading(false)
            }
        },
    })

    const getNotificationIcon = () => {
        switch (notification.type) {
            case 'success': return CheckCircle
            case 'error':
            case 'warning': return AlertCircle
            default: return AlertCircle
        }
    }

    const getNotificationColor = (isDark: boolean) => {
        switch (notification.type) {
            case 'success': return isDark ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-green-600 bg-green-50 border-green-200'
            case 'error': return isDark ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-red-600 bg-red-50 border-red-200'
            case 'warning': return isDark ? 'text-yellow-400 bg-yellow-900/20 border-yellow-800' : 'text-yellow-600 bg-yellow-50 border-yellow-200'
            default: return isDark ? 'text-blue-400 bg-blue-900/20 border-blue-800' : 'text-blue-600 bg-blue-50 border-blue-200'
        }
    }

    return {
        formik,
        notification,
        hookError,
        success,
        isLoading: hookLoading,
        estabelecimentos,
        tiposUsuario,
        getNotificationIcon,
        getNotificationColor,
    }
}
