'use client'

import React, { useState, useEffect } from 'react'
import { PageWrapper } from '@/components/layout'
import { UserProfileHeader } from '@/components/profile/UserProfileHeader'
import { UserProfileForm } from '@/components/profile/UserProfileForm'
import { UserPermissionsCard } from '@/components/profile/UserPermissionsCard'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { User } from '@/types/user'
import { IUser } from '@/lib/auth-types'

// Função para converter IUser para User
const convertIUserToUser = (iUser: IUser): User => {
    return {
        id: iUser.id,
        username: iUser.username,
        nomeCompleto: iUser.nomeCompleto,
        cpf: iUser.cpf,
        cnpj: iUser.cnpj,
        email: iUser.email,
        telefone: iUser.telefone,
        celular: iUser.celular,
        endereco: iUser.endereco,
        estabelecimento: iUser.estabelecimento,
        tipoUsuario: iUser.tipoUsuario,
        ativo: iUser.ativo,
        integraApi: iUser.integraApi,
        tempoAcesso: iUser.tempoAcesso,
        roles: iUser.roles?.map(role => role.perfis?.nomePerfil || '') || [],
        createdAt: iUser.dataRegistro,
        updatedAt: iUser.dataAtualizacao
    }
}

const UserProfilePage = () => {
    const { user, isAuthenticated } = useAuth()
    const { isDark } = useTheme()
    const [ isLoading, setIsLoading ] = useState(false)

    // Estado para detectar tema (fallback caso não tenha contexto)
    const [ localIsDark, setLocalIsDark ] = useState(false)

    useEffect(() => {
        const checkTheme = () => {
            setLocalIsDark(document.documentElement.classList.contains('dark'))
        }

        checkTheme()

        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [ 'class' ]
        })

        return () => observer.disconnect()
    }, [])

    const currentTheme = isDark !== undefined ? isDark : localIsDark

    if (!isAuthenticated || !user) {
        return (
            <PageWrapper maxWidth="full" spacing="xl">
                <div className="flex items-center justify-center min-h-screen">
                    <div className={`text-center ${currentTheme ? 'text-white' : 'text-gray-800'}`}>
                        <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
                        <p>Você precisa estar logado para acessar esta página.</p>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper maxWidth="full" spacing="xl">
            {/* Header da página */}
            <UserProfileHeader user={user} isDark={currentTheme} />

            <div className="relative -mt-24 space-y-8">
                {/* Card de Permissões */}
                <div className="flex justify-center">
                    <UserPermissionsCard
                        user={user}
                        isDark={currentTheme}
                        isLoading={isLoading}
                    />
                </div>

                {/* Formulário de Dados do Perfil */}
                <UserProfileForm
                    user={user ? convertIUserToUser(user) : {
                        id: '',
                        username: '',
                        email: '',
                        roles: []
                    }}
                    isDark={currentTheme}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </div>
        </PageWrapper>
    )
}

export default UserProfilePage
