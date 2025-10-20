'use client'

import React from 'react'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Building2,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react'

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
                    label="Nome de Usuário"
                    value={user?.username}
                />

                <InfoRow
                    icon={Mail}
                    label="Email"
                    value={user?.email}
                />

                <InfoRow
                    icon={Phone}
                    label="Celular"
                    value={user?.celular}
                />

                <InfoRow
                    icon={Phone}
                    label="Telefone"
                    value={user?.telefone}
                />

                <InfoRow
                    icon={Building2}
                    label="Estabelecimento"
                    value={user?.estabelecimento}
                />

                <InfoRow
                    icon={Shield}
                    label="Tipo de Usuário"
                    value={user?.tipoUsuario}
                />

                <InfoRow
                    icon={Clock}
                    label="Tempo de Acesso"
                    value={`${user?.tempoAcesso || 0} minutos`}
                />

                <InfoRow
                    icon={user?.ativo ? CheckCircle : XCircle}
                    label="Status da Conta"
                    value={user?.ativo ? 'Ativa' : 'Inativa'}
                    badge={{
                        text: user?.ativo ? 'Ativo' : 'Inativo',
                        color: user?.ativo
                            ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                            : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700')
                    }}
                />

                <div className="md:col-span-2">
                    <InfoRow
                        icon={MapPin}
                        label="Endereço"
                        value={user?.endereco}
                    />
                </div>

                <InfoRow
                    icon={Calendar}
                    label="CPF"
                    value={user?.cpf}
                />

                <InfoRow
                    icon={Calendar}
                    label="CNPJ"
                    value={user?.cnpj}
                />

                <InfoRow
                    icon={Calendar}
                    label="Membro desde"
                    value={formatDate(user?.createdAt)}
                />

                <InfoRow
                    icon={CheckCircle}
                    label="Integração API"
                    value={user?.integraApi ? 'Habilitada' : 'Desabilitada'}
                    badge={{
                        text: user?.integraApi ? 'SIM' : 'NÃO',
                        color: user?.integraApi
                            ? (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')
                            : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                    }}
                />
            </div>
        </div>
    )
}
