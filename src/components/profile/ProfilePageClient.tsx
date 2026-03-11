'use client'

import React from 'react'
import { PageWrapper } from '@/components/layout'
import {
    UserProfileHeader,
    UserProfileForm,
    UserPermissionsCard,
    UserSecuritySettings,
    UserActivityLog,
    UserInfoCard,
    UserAvatarUpload,
} from '@/components/profile'
import { HomePageSelector } from '@/components/profile/HomePageSelector'
import { ProfileTabs } from './ProfileTabs'
import { useProfilePage } from './useProfilePage'

export const ProfilePageClient: React.FC = () => {
    const {
        user,
        authLoading,
        isDark,
        isMobile,
        isLoading,
        setIsLoading,
        activeTab,
        setActiveTab,
        activities,
        tabs,
        handleAvatarUpload,
        handleChangePassword,
    } = useProfilePage()

    if (authLoading || !user) {
        return (
            <PageWrapper maxWidth="full" spacing="xl">
                <div className={`flex items-center justify-center min-h-96 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        <p>Carregando perfil...</p>
                        {!authLoading && !user && (
                            <p className="text-sm text-red-500">
                                Usuário não encontrado. Redirecionando...
                            </p>
                        )}
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper maxWidth="full" spacing="xl">
            <UserProfileHeader user={user} isDark={isDark} />

            <div className="relative -mt-24 space-y-8">
                <ProfileTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isDark={isDark}
                    isMobile={isMobile}
                />

                <div className="space-y-8">
                    {activeTab === 'profile' && (
                        <UserProfileForm
                            user={user}
                            isDark={isDark}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    )}
                    {activeTab === 'avatar' && (
                        <UserAvatarUpload
                            currentAvatar={user?.avatar}
                            userName={user?.nomeCompleto || user?.username}
                            onUpload={handleAvatarUpload}
                            isDark={isDark}
                        />
                    )}
                    {activeTab === 'info' && (
                        <UserInfoCard user={user} isDark={isDark} />
                    )}
                    {activeTab === 'permissions' && (
                        <UserPermissionsCard user={user} isDark={isDark} isLoading={isLoading} />
                    )}
                    {activeTab === 'preferences' && (
                        <HomePageSelector />
                    )}
                    {activeTab === 'security' && (
                        <UserSecuritySettings
                            onChangePassword={handleChangePassword}
                            user={{ id: user.id, email: user.email }}
                            isDark={isDark}
                        />
                    )}
                    {activeTab === 'activity' && (
                        <UserActivityLog activities={activities} isDark={isDark} />
                    )}
                </div>
            </div>
        </PageWrapper>
    )
}
