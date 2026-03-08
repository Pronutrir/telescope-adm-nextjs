'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/SelectSimple'
import { Textarea } from '@/components/ui/Textarea'
import { Mail, Phone, MapPin } from 'lucide-react'
import type { FormikProps } from 'formik'
import type { UserProfileFormValues } from './useProfileForm'

interface ContactSectionProps {
    formik: FormikProps<UserProfileFormValues>
    estabelecimentos: Array<{ value: string | number; label: string }>
    isDark: boolean
}

export const ContactSection: React.FC<ContactSectionProps> = ({ formik, estabelecimentos, isDark }) => (
    <div>
        <h3 className={`text-lg font-semibold mb-6 pb-2 border-b ${isDark ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'}`}>
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
                disabled
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
)
