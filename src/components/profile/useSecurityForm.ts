'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export interface SecurityFormValues {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

interface UseSecurityFormProps {
    onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>
}

const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Senha atual é obrigatória'),
    newPassword: Yup.string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres')
        .matches(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
        .matches(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
        .matches(/[0-9]/, 'Deve conter pelo menos um número')
        .matches(/[@$!%*?&#]/, 'Deve conter pelo menos um caractere especial (@$!%*?&#)')
        .required('Nova senha é obrigatória'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'As senhas não coincidem')
        .required('Confirmação de senha é obrigatória'),
})

export function getPasswordStrength(password: string, isDark: boolean) {
    if (!password) return { strength: 0, label: '', color: '' }
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[@$!%*?&#]/.test(password)) strength++
    if (strength <= 2) return { strength: 25, label: 'Fraca', color: isDark ? 'bg-red-500' : 'bg-red-600' }
    if (strength <= 4) return { strength: 50, label: 'Média', color: isDark ? 'bg-yellow-500' : 'bg-yellow-600' }
    if (strength <= 5) return { strength: 75, label: 'Boa', color: isDark ? 'bg-blue-500' : 'bg-blue-600' }
    return { strength: 100, label: 'Forte', color: isDark ? 'bg-green-500' : 'bg-green-600' }
}

export function useSecurityForm({ onChangePassword }: UseSecurityFormProps) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const formik = useFormik<SecurityFormValues>({
        initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true)
            try {
                await onChangePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })
                resetForm()
            } catch (error) {
                console.error('Erro no formulário:', error)
            } finally {
                setIsLoading(false)
            }
        },
    })

    return {
        formik,
        isLoading,
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword,
        setShowCurrentPassword,
        setShowNewPassword,
        setShowConfirmPassword,
    }
}
