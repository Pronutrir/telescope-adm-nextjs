'use client'

import React from 'react'

interface UserProfileHeaderProps {
    user: any
    isDark?: boolean
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
    user,
    isDark = false
}) => {
    // Background dinâmico baseado no tema
    const getHeaderBackground = () => {
        if (isDark) {
            return 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)'
        } else {
            return 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(99, 102, 241, 0.95) 100%)'
        }
    }

    return (
        <div
            className="relative flex items-center min-h-[400px] px-6 py-16"
            style={{
                background: getHeaderBackground(),
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay para melhor legibilidade */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: isDark
                        ? 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
                        : 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%)'
                }}
            />

            <div className="relative w-full max-w-7xl mx-auto">
                <div className="max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Olá, {user?.nomeCompleto || user?.username || 'Usuário'}!
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                        Utilize esta seção do sistema para gerenciar seus dados pessoais,
                        visualizar suas permissões e manter suas informações atualizadas.
                    </p>
                </div>
            </div>
        </div>
    )
}
