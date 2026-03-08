'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/SelectSimple'
import { User, Clock } from 'lucide-react'
import type { FormikProps } from 'formik'
import type { UserProfileFormValues } from './useProfileForm'

interface UserInfoSectionProps {
    formik: FormikProps<UserProfileFormValues>
    tiposUsuario: Array<{ value: string; label: string }>
    isDark: boolean
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ formik, tiposUsuario, isDark }) => (
    <div>
        <h3 className={`text-lg font-semibold mb-6 pb-2 border-b ${isDark ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
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
                disabled
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
                disabled
                icon={Clock}
            />
            <Select
                label="Status do Usuário"
                name="ativo"
                value={formik.values.ativo ? 'true' : 'false'}
                onChange={(value) => formik.setFieldValue('ativo', value === 'true')}
                error={formik.touched.ativo && formik.errors.ativo}
                disabled
                options={[
                    { value: 'true', label: 'Ativo' },
                    { value: 'false', label: 'Inativo' },
                ]}
            />
            <Select
                label="Perfil do Usuário"
                name="tipoUsuario"
                value={formik.values.tipoUsuario}
                onChange={(value) => formik.setFieldValue('tipoUsuario', value)}
                error={formik.touched.tipoUsuario && formik.errors.tipoUsuario}
                disabled
                options={tiposUsuario}
                placeholder="Selecione o perfil"
            />
            <Select
                label="Integra API"
                name="integraApi"
                value={formik.values.integraApi ? 'true' : 'false'}
                onChange={(value) => formik.setFieldValue('integraApi', value === 'true')}
                error={formik.touched.integraApi && formik.errors.integraApi}
                disabled
                options={[
                    { value: 'true', label: 'SIM' },
                    { value: 'false', label: 'NÃO' },
                ]}
            />
        </div>
    </div>
)
