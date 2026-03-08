'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Lock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSecurityForm, getPasswordStrength } from './useSecurityForm'
import { PasswordField } from './PasswordField'
import { PasswordStrengthBar } from './PasswordStrengthBar'
import { PasswordRequirements } from './PasswordRequirements'

interface UserSecuritySettingsProps {
    onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>
    user: { id: number; email: string }
    isDark?: boolean
}

export const UserSecuritySettings: React.FC<UserSecuritySettingsProps> = ({ onChangePassword, user: _user, isDark = false }) => {
    const {
        formik, isLoading,
        showCurrentPassword, showNewPassword, showConfirmPassword,
        setShowCurrentPassword, setShowNewPassword, setShowConfirmPassword,
    } = useSecurityForm({ onChangePassword })

    const passwordStrength = getPasswordStrength(formik.values.newPassword, isDark)

    return (
        <div className={cn('p-8 rounded-xl border shadow-lg', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200')}>
            <div className="flex items-center gap-3 mb-8">
                <Shield className="w-8 h-8 profile-header-icon" />
                <div>
                    <h2 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-800')}>Segurança</h2>
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                        Altere sua senha regularmente para manter sua conta segura
                    </p>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <PasswordField
                    label="Senha Atual"
                    name="currentPassword"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.currentPassword && formik.errors.currentPassword}
                    isDark={isDark}
                    show={showCurrentPassword}
                    onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
                    placeholder="Digite sua senha atual"
                />

                <div className="space-y-2">
                    <PasswordField
                        label="Nova Senha"
                        name="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.newPassword && formik.errors.newPassword}
                        isDark={isDark}
                        show={showNewPassword}
                        onToggleShow={() => setShowNewPassword(!showNewPassword)}
                        placeholder="Digite sua nova senha"
                    />
                    {formik.values.newPassword && <PasswordStrengthBar {...passwordStrength} isDark={isDark} />}
                </div>

                <PasswordField
                    label="Confirmar Nova Senha"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    isDark={isDark}
                    show={showConfirmPassword}
                    onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                    placeholder="Confirme sua nova senha"
                />

                <PasswordRequirements isDark={isDark} />

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="submit"
                        variant="primary"
                        icon={Lock}
                        disabled={isLoading || !formik.isValid || !formik.dirty}
                        loading={isLoading}
                        className="min-w-[140px]"
                    >
                        {isLoading ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

