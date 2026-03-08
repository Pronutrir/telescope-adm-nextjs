'use client'

import React from 'react'
import { User, Mail, Calendar, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileInfoRow } from './ProfileInfoRow'

interface Perfil {
    nomePerfil: string
    dataRegistro: string
}

interface UserInfoCardUser {
    id?: number
    nomeCompleto?: string
    email?: string
    perfis?: Perfil[]
}

interface UserInfoCardProps {
    user: UserInfoCardUser | null
    isDark?: boolean
}

function formatDate(dateString: string): string {
    if (!dateString) return 'Não informado'
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ user, isDark = false }) => {
    const perfis = user?.perfis ?? []
    const perfisCount = perfis.length

    const accessBadge = {
        text: perfisCount >= 10 ? 'ADMIN' : perfisCount >= 5 ? 'AVANÇADO' : 'BÁSICO',
        color: perfisCount >= 10
            ? (isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700')
            : perfisCount >= 5
            ? (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')
            : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'),
    }

    const oldest = perfis.length > 0 ? perfis.reduce((a, b) => new Date(a.dataRegistro) < new Date(b.dataRegistro) ? a : b) : null
    const newest = perfis.length > 0 ? perfis.reduce((a, b) => new Date(a.dataRegistro) > new Date(b.dataRegistro) ? a : b) : null

    return (
        <div className={cn('p-8 rounded-xl border shadow-lg', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200')}>
            <div className="flex items-center gap-3 mb-8">
                <User className="w-8 h-8 profile-header-icon" />
                <div>
                    <h2 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-800')}>Informações da Conta</h2>
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Detalhes completos do seu perfil</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileInfoRow icon={User} label="ID do Usuário" value={`#${user?.id ?? 'N/A'}`} isDark={isDark} />
                <ProfileInfoRow icon={User} label="Nome Completo" value={user?.nomeCompleto ?? 'Não informado'} isDark={isDark} />
                <div className="md:col-span-2">
                    <ProfileInfoRow icon={Mail} label="Email" value={user?.email ?? 'Não informado'} isDark={isDark} />
                </div>
                <ProfileInfoRow
                    icon={Shield} label="Total de Perfis" value={perfisCount}
                    badge={{ text: `${perfisCount} perfis`, color: perfisCount >= 5 ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700') : (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700') }}
                    isDark={isDark}
                />
                <ProfileInfoRow
                    icon={Shield} label="Nível de Acesso"
                    value={perfisCount >= 10 ? 'Acesso Completo' : perfisCount >= 5 ? 'Acesso Avançado' : 'Acesso Básico'}
                    badge={accessBadge} isDark={isDark}
                />

                {perfis.length > 0 && (
                    <div className={cn('md:col-span-2 flex items-start gap-4 p-4 rounded-lg border transition-all duration-200', isDark ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')}>
                        <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600')}>
                            <Shield className="w-5 h-5 info-card-icon" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={cn('text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600')}>Perfis Atribuídos</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {perfis.slice(0, 5).map((perfil, index) => (
                                    <span key={index} className={cn('px-3 py-1 rounded-full text-xs font-medium', isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')}>
                                        {perfil.nomePerfil}
                                    </span>
                                ))}
                                {perfis.length > 5 && (
                                    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}>
                                        +{perfis.length - 5} mais
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {oldest && <ProfileInfoRow icon={Calendar} label="Primeiro Perfil Atribuído" value={formatDate(oldest.dataRegistro)} isDark={isDark} />}
                {newest && <ProfileInfoRow icon={Calendar} label="Último Perfil Atribuído" value={formatDate(newest.dataRegistro)} isDark={isDark} />}
            </div>
        </div>
    )
}
