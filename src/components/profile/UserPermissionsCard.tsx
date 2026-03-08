'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Shield, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PermissionCard, Permission, PermissionColors } from './PermissionCard'
import { PermissionsModal } from './PermissionsModal'

interface UserPermissionsCardProps {
    user: { perfis?: unknown[] } | null
    isDark?: boolean
    isLoading?: boolean
}

const PERMISSION_COLORS: PermissionColors[] = [
    { light: 'from-blue-50 to-blue-100 border-blue-200', dark: 'bg-blue-900/20 border-blue-500/30', accent: 'bg-blue-500' },
    { light: 'from-purple-50 to-purple-100 border-purple-200', dark: 'bg-purple-900/20 border-purple-500/30', accent: 'bg-purple-500' },
    { light: 'from-green-50 to-green-100 border-green-200', dark: 'bg-green-900/20 border-green-500/30', accent: 'bg-green-500' },
    { light: 'from-orange-50 to-orange-100 border-orange-200', dark: 'bg-orange-900/20 border-orange-500/30', accent: 'bg-orange-500' },
    { light: 'from-pink-50 to-pink-100 border-pink-200', dark: 'bg-pink-900/20 border-pink-500/30', accent: 'bg-pink-500' },
    { light: 'from-cyan-50 to-cyan-100 border-cyan-200', dark: 'bg-cyan-900/20 border-cyan-500/30', accent: 'bg-cyan-500' },
    { light: 'from-indigo-50 to-indigo-100 border-indigo-200', dark: 'bg-indigo-900/20 border-indigo-500/30', accent: 'bg-indigo-500' },
    { light: 'from-teal-50 to-teal-100 border-teal-200', dark: 'bg-teal-900/20 border-teal-500/30', accent: 'bg-teal-500' },
]

function getProfileColor(name: string): PermissionColors {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return PERMISSION_COLORS[hash % PERMISSION_COLORS.length]
}

function mapPerfisToPermissions(perfis: unknown[]): Permission[] {
    return perfis.map((perfil: unknown, index: number) => {
        const p = perfil as Record<string, unknown>
        const dataRegistro = p.dataRegistro
            ? new Date(p.dataRegistro as string).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A'
        return {
            id: p.id?.toString() ?? index.toString(),
            name: p.nomePerfil as string,
            description: `Atribuído em ${dataRegistro}`,
            category: p.statusPerfil === 'A' ? 'Ativo' : 'Inativo',
            metadata: {
                usuario: p.usuario as string | undefined,
                roleId: p.roleId as number | undefined,
                dataRegistro: p.dataRegistro as string | undefined,
                dataAtualizacao: p.dataAtualizacao as string | undefined,
            },
        }
    })
}

export const UserPermissionsCard: React.FC<UserPermissionsCardProps> = ({ user, isDark = false, isLoading = false }) => {
    const [showPermissions, setShowPermissions] = useState(false)
    const permissions = mapPerfisToPermissions(user?.perfis ?? [])
    const count = permissions.length

    const accessLabel = count >= 10 ? 'Acesso Completo' : count >= 5 ? 'Acesso Avançado' : 'Acesso Básico'
    const badgeClass = count >= 10
        ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
        : count >= 5
        ? (isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
        : (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')

    return (
        <>
            <div className={cn('p-8 rounded-xl border shadow-lg', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200')}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className={cn('w-8 h-8', isDark ? 'text-blue-400' : 'text-blue-600')} />
                        <div>
                            <h2 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-800')}>
                                Meus Perfis ({count})
                            </h2>
                            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                Perfis de acesso atribuídos ao seu usuário
                            </p>
                        </div>
                    </div>
                    <div className={cn('px-4 py-2 rounded-full text-sm font-medium', badgeClass)}>{accessLabel}</div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                ) : permissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {permissions.map((permission, index) => (
                            <PermissionCard
                                key={permission.id}
                                permission={permission}
                                colors={getProfileColor(permission.name)}
                                isDark={isDark}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Shield className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-gray-400' : 'text-gray-500')} />
                        <p className={cn('text-lg font-medium mb-2', isDark ? 'text-white' : 'text-gray-800')}>Nenhum perfil encontrado</p>
                        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
                            Entre em contato com o administrador para obter acesso.
                        </p>
                    </div>
                )}

                {permissions.length > 0 && (
                    <div className={cn('mt-6 pt-6 border-t flex items-center justify-between', isDark ? 'border-gray-700' : 'border-gray-200')}>
                        <div className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>Sistema de permissões ativo</div>
                        <Button variant="ghost" size="sm" icon={Eye} onClick={() => setShowPermissions(true)}>
                            Ver Lista Completa
                        </Button>
                    </div>
                )}
            </div>

            <PermissionsModal
                show={showPermissions}
                onClose={() => setShowPermissions(false)}
                permissions={permissions}
                isDark={isDark}
            />
        </>
    )
}

