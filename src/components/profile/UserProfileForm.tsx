'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/SelectSimple'
import { Textarea } from '@/components/ui/Textarea'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Save,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle,
    Clock,
    Shield
} from 'lucide-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useUserProfile, useEstabelecimentos, useTiposUsuario } from '@/hooks/useUserProfile'
import { User as UserType } from '@/types/user'

interface UserProfileFormProps {
    user: UserType
    isDark?: boolean
    isLoading?: boolean
    setIsLoading?: (loading: boolean) => void
}

// Schema de validação
const validationSchema = Yup.object({
    nomeCompleto: Yup
        .string()
        .min(10, 'O nome deve conter no mínimo 10 caracteres')
        .max(100, 'O nome deve conter no máximo 100 caracteres')
        .required('É necessário informar o nome completo'),
    email: Yup
        .string()
        .email('Email inválido')
        .required('É necessário informar o email'),
    telefone: Yup
        .string()
        .nullable(),
    celular: Yup
        .string()
        .nullable(),
    endereco: Yup
        .string()
        .nullable(),
    estabelecimento: Yup
        .number()
        .required('É necessário selecionar o estabelecimento')
})

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
    user,
    isDark = false,
    isLoading: externalLoading = false,
    setIsLoading: setExternalLoading
}) => {
    const { updateUserProfile, isLoading: hookLoading, error: hookError, success } = useUserProfile(user.id)
    const { estabelecimentos } = useEstabelecimentos()
    const { tiposUsuario } = useTiposUsuario()

    const [ notification, setNotification ] = useState<{
        show: boolean
        type: 'success' | 'error' | 'warning'
        message: string
    }>({ show: false, type: 'success', message: '' })

    const isLoading = externalLoading || hookLoading

    const formik = useFormik({
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
            tempoAcesso: user?.tempoAcesso || 0
        },
        validationSchema,
        onSubmit: async (values) => {
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

                setNotification({
                    show: true,
                    type: 'success',
                    message: 'Dados atualizados com sucesso!'
                })

                // Ocultar notificação após 5 segundos
                setTimeout(() => {
                    setNotification(prev => ({ ...prev, show: false }))
                }, 5000)

            } catch (error) {
                setNotification({
                    show: true,
                    type: 'error',
                    message: hookError || 'Erro ao atualizar dados. Tente novamente.'
                })

                setTimeout(() => {
                    setNotification(prev => ({ ...prev, show: false }))
                }, 5000)
            } finally {
                if (setExternalLoading) setExternalLoading(false)
            }
        }
    })

    const getNotificationIcon = () => {
        switch (notification.type) {
            case 'success': return CheckCircle
            case 'error': return AlertCircle
            case 'warning': return AlertCircle
            default: return AlertCircle
        }
    }

    const getNotificationColor = () => {
        switch (notification.type) {
            case 'success': return isDark ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-green-600 bg-green-50 border-green-200'
            case 'error': return isDark ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-red-600 bg-red-50 border-red-200'
            case 'warning': return isDark ? 'text-yellow-400 bg-yellow-900/20 border-yellow-800' : 'text-yellow-600 bg-yellow-50 border-yellow-200'
            default: return isDark ? 'text-blue-400 bg-blue-900/20 border-blue-800' : 'text-blue-600 bg-blue-50 border-blue-200'
        }
    }

    return (
        <div className={`
            p-8 rounded-xl border shadow-lg
            ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}
        `}>
            {/* Notificação */}
            {(notification.show || hookError) && (
                <div className={`
                    flex items-center gap-3 p-4 mb-6 rounded-lg border
                    ${hookError
                        ? (isDark ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-red-600 bg-red-50 border-red-200')
                        : getNotificationColor()
                    }
                `}>
                    {React.createElement(getNotificationIcon(), { className: "h-5 w-5 flex-shrink-0" })}
                    <p className="text-sm font-medium">
                        {hookError || notification.message}
                    </p>
                </div>
            )}

            {success && (
                <div className={`
                    flex items-center gap-3 p-4 mb-6 rounded-lg border
                    ${isDark ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-green-600 bg-green-50 border-green-200'}
                `}>
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">Dados atualizados com sucesso!</p>
                </div>
            )}

            {/* Header do Card */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <User className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Dados do seu Perfil
                        </h2>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Mantenha suas informações sempre atualizadas
                        </p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    icon={Save}
                    onClick={() => formik.handleSubmit()}
                    disabled={isLoading || !formik.isValid}
                    loading={isLoading}
                    className="min-w-[120px]"
                >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className={`
                    flex items-center justify-center gap-3 p-4 mb-6 rounded-lg border
                    ${isDark ? 'bg-blue-900/20 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}
                `}>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    <span className="text-sm font-medium">Atualizando seus dados...</span>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-8">
                {/* Seção: Informações do Usuário */}
                <div>
                    <h3 className={`
                        text-lg font-semibold mb-6 pb-2 border-b
                        ${isDark ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}
                    `}>
                        Informações do Usuário
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Input
                            label="Username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && formik.errors.username}
                            disabled={true}
                            icon={User}
                            placeholder="Seu username"
                            required
                        />

                        <Input
                            label="Nome Completo"
                            name="nomeCompleto"
                            value={formik.values.nomeCompleto}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nomeCompleto && formik.errors.nomeCompleto}
                            icon={User}
                            placeholder="Seu nome completo"
                            required
                        />

                        <Input
                            label="CPF"
                            name="cpf"
                            value={formik.values.cpf}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.cpf && formik.errors.cpf}
                            placeholder="000.000.000-00"
                        />

                        <Input
                            label="CNPJ"
                            name="cnpj"
                            value={formik.values.cnpj}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.cnpj && formik.errors.cnpj}
                            placeholder="00.000.000/0000-00"
                        />

                        <Input
                            label="Tempo de Acesso (minutos)"
                            name="tempoAcesso"
                            type="number"
                            value={formik.values.tempoAcesso}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.tempoAcesso && formik.errors.tempoAcesso}
                            disabled={true}
                            icon={Clock}
                        />

                        <Select
                            label="Status do Usuário"
                            name="ativo"
                            value={formik.values.ativo}
                            onChange={(value) => formik.setFieldValue('ativo', value)}
                            error={formik.touched.ativo && formik.errors.ativo}
                            disabled={true}
                            options={[
                                { value: true, label: 'Ativo' },
                                { value: false, label: 'Inativo' }
                            ]}
                        />

                        <Select
                            label="Perfil do Usuário"
                            name="tipoUsuario"
                            value={formik.values.tipoUsuario}
                            onChange={(value) => formik.setFieldValue('tipoUsuario', value)}
                            error={formik.touched.tipoUsuario && formik.errors.tipoUsuario}
                            disabled={true}
                            options={tiposUsuario}
                            placeholder="Selecione o perfil"
                        />

                        <Select
                            label="Integra API"
                            name="integraApi"
                            value={formik.values.integraApi}
                            onChange={(value) => formik.setFieldValue('integraApi', value)}
                            error={formik.touched.integraApi && formik.errors.integraApi}
                            disabled={true}
                            options={[
                                { value: true, label: 'SIM' },
                                { value: false, label: 'NÃO' }
                            ]}
                        />
                    </div>
                </div>

                {/* Seção: Informações de Contato */}
                <div>
                    <h3 className={`
                        text-lg font-semibold mb-6 pb-2 border-b
                        ${isDark ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}
                    `}>
                        Informações de Contato
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-2">
                            <Textarea
                                label="Endereço"
                                name="endereco"
                                value={formik.values.endereco}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.endereco && formik.errors.endereco}
                                icon={MapPin}
                                placeholder="Seu endereço completo"
                                rows={3}
                            />
                        </div>

                        <Select
                            label="Estabelecimento - Pronutrir"
                            name="estabelecimento"
                            value={formik.values.estabelecimento}
                            onChange={(value) => formik.setFieldValue('estabelecimento', value)}
                            error={formik.touched.estabelecimento && formik.errors.estabelecimento}
                            disabled={true}
                            options={estabelecimentos}
                            placeholder="Selecione o estabelecimento"
                            required
                        />

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && formik.errors.email}
                            icon={Mail}
                            placeholder="seu@email.com"
                            required
                        />

                        <Input
                            label="Celular"
                            name="celular"
                            value={formik.values.celular}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.celular && formik.errors.celular}
                            icon={Phone}
                            placeholder="(00) 00000-0000"
                        />

                        <Input
                            label="Telefone"
                            name="telefone"
                            value={formik.values.telefone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.telefone && formik.errors.telefone}
                            icon={Phone}
                            placeholder="(00) 0000-0000"
                        />
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="submit"
                        variant="primary"
                        icon={Save}
                        disabled={isLoading || !formik.isValid}
                        loading={isLoading}
                        className="min-w-[140px]"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
