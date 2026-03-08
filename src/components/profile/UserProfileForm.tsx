'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Save, User } from 'lucide-react'
import { User as UserType } from '@/types/user'
import { useProfileForm } from './useProfileForm'
import { ProfileFormNotification } from './ProfileFormNotification'
import { UserInfoSection } from './UserInfoSection'
import { ContactSection } from './ContactSection'

interface UserProfileFormProps {
    user: UserType
    isDark?: boolean
    isLoading?: boolean
    setIsLoading?: (loading: boolean) => void
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
    user,
    isDark = false,
    isLoading: externalLoading = false,
    setIsLoading: setExternalLoading,
}) => {
    const {
        formik,
        notification,
        hookError,
        success,
        isLoading: hookLoading,
        estabelecimentos,
        tiposUsuario,
        getNotificationIcon,
        getNotificationColor,
    } = useProfileForm(user, setExternalLoading)

    const isLoading = externalLoading || hookLoading

    return (
        <div className={`p-8 rounded-xl border shadow-lg ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
            {(notification.show || hookError) && (
                <ProfileFormNotification
                    message={hookError || notification.message}
                    colorClass={hookError
                        ? (isDark ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-red-600 bg-red-50 border-red-200')
                        : getNotificationColor(isDark)
                    }
                    Icon={getNotificationIcon()}
                />
            )}
            {success && (
                <ProfileFormNotification
                    message="Dados atualizados com sucesso!"
                    colorClass={isDark ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-green-600 bg-green-50 border-green-200'}
                    Icon={CheckCircle}
                />
            )}

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <User className="w-8 h-8 profile-header-icon" />
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

            {isLoading && (
                <div className={`flex items-center justify-center gap-3 p-4 mb-6 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    <span className="text-sm font-medium">Atualizando seus dados...</span>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-8">
                <UserInfoSection formik={formik} tiposUsuario={tiposUsuario} isDark={isDark} />
                <ContactSection formik={formik} estabelecimentos={estabelecimentos} isDark={isDark} />

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


