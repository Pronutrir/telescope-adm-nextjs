'use client'

import React from 'react'
import {
    User,
    Mail,
    Calendar,
    Shield
} from 'lucide-react'

/**
 * Card de Informações do Usuário
 * 
 * @component
 * @description
 * Exibe informações detalhadas do perfil do usuário obtidas da API UserShield:
 * - ID do usuário (usado para alteração de senha)
 * - Nome completo e email (username para autenticação)
 * - Perfis atribuídos (permissões)
 * - Nível de acesso baseado em quantidade de perfis
 * - Histórico de atribuição de perfis
 * 
 * @datasource API UserShield via /api/usershield/usuarios
 * @session Dados mantidos em Redis (session_id cookie)
 */
interface UserInfoCardProps {
    user: any
    isDark?: boolean
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
    user,
    isDark = false
}) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Não informado'
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    const InfoRow = ({ 
        icon: Icon, 
        label, 
        value, 
        badge 
    }: { 
        icon: any
        label: string
        value: string | number
        badge?: { text: string; color: string }
    }) => (
        <div className={`
            flex items-start gap-4 p-4 rounded-lg border transition-all duration-200
            ${isDark 
                ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }
        `}>
            <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}
            `}>
                <Icon className="w-5 h-5 info-card-icon" />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {label}
                </p>
                <p className={`text-base font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {value || 'Não informado'}
                </p>
            </div>
            {badge && (
                <span className={`
                    flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium
                    ${badge.color}
                `}>
                    {badge.text}
                </span>
            )}
        </div>
    )

    return (
        <div className={`
            p-8 rounded-xl border shadow-lg
            ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}
        `}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <User className="w-8 h-8 profile-header-icon" />
                <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Informações da Conta
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Detalhes completos do seu perfil
                    </p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow
                    icon={User}
                    label="ID do Usuário"
                    value={`#${user?.id || 'N/A'}`}
                />

                <InfoRow
                    icon={User}
                    label="Nome Completo"
                    value={user?.nomeCompleto}
                />

                <div className="md:col-span-2">
                    <InfoRow
                        icon={Mail}
                        label="Email"
                        value={user?.email}
                    />
                </div>

                <InfoRow
                    icon={Shield}
                    label="Total de Perfis"
                    value={user?.perfis?.length || 0}
                    badge={{
                        text: `${user?.perfis?.length || 0} perfis`,
                        color: (user?.perfis?.length || 0) >= 5
                            ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                            : (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')
                    }}
                />

                <InfoRow
                    icon={Shield}
                    label="Nível de Acesso"
                    value={(user?.perfis?.length || 0) >= 10 ? 'Acesso Completo' : (user?.perfis?.length || 0) >= 5 ? 'Acesso Avançado' : 'Acesso Básico'}
                    badge={{
                        text: (user?.perfis?.length || 0) >= 10 ? 'ADMIN' : (user?.perfis?.length || 0) >= 5 ? 'AVANÇADO' : 'BÁSICO',
                        color: (user?.perfis?.length || 0) >= 10
                            ? (isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700')
                            : (user?.perfis?.length || 0) >= 5
                            ? (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')
                            : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                    }}
                />

                {/* Mostrar alguns perfis principais */}
                {user?.perfis && user.perfis.length > 0 && (
                    <div className="md:col-span-2">
                        <div className={`
                            flex items-start gap-4 p-4 rounded-lg border transition-all duration-200
                            ${isDark 
                                ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' 
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }
                        `}>
                            <div className={`
                                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                                ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}
                            `}>
                                <Shield className="w-5 h-5 info-card-icon" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Perfis Atribuídos
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {user.perfis.slice(0, 5).map((perfil: any, index: number) => (
                                        <span
                                            key={index}
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}
                                            `}
                                        >
                                            {perfil.nomePerfil}
                                        </span>
                                    ))}
                                    {user.perfis.length > 5 && (
                                        <span
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-medium
                                                ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}
                                            `}
                                        >
                                            +{user.perfis.length - 5} mais
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Perfil mais antigo */}
                {user?.perfis && user.perfis.length > 0 && (
                    <InfoRow
                        icon={Calendar}
                        label="Primeiro Perfil Atribuído"
                        value={formatDate(
                            user.perfis.reduce((oldest: any, current: any) => {
                                return new Date(current.dataRegistro) < new Date(oldest.dataRegistro) ? current : oldest
                            }).dataRegistro
                        )}
                    />
                )}

                {/* Perfil mais recente */}
                {user?.perfis && user.perfis.length > 0 && (
                    <InfoRow
                        icon={Calendar}
                        label="Último Perfil Atribuído"
                        value={formatDate(
                            user.perfis.reduce((newest: any, current: any) => {
                                return new Date(current.dataRegistro) > new Date(newest.dataRegistro) ? current : newest
                            }).dataRegistro
                        )}
                    />
                )}
            </div>
        </div>
    )
}
