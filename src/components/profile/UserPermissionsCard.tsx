'use client'

import React, { useState } from 'react'
import { StatsCard } from '@/components/ui/StatsCard'
import { Button } from '@/components/ui/Button'
import { Shield, Eye, X } from 'lucide-react'

interface Permission {
    id: string
    name: string
    description?: string
    category?: string
}

interface UserPermissionsCardProps {
    user: any
    isDark?: boolean
    isLoading?: boolean
}

export const UserPermissionsCard: React.FC<UserPermissionsCardProps> = ({
    user,
    isDark = false,
    isLoading = false
}) => {
    const [ showPermissions, setShowPermissions ] = useState(false)

    // Extrair permissões do usuário
    const permissions: Permission[] = user?.roles || []
    const permissionCount = permissions.length

    // Cores baseadas no número de permissões
    const getPermissionColor = () => {
        if (permissionCount >= 10) return 'success'
        if (permissionCount >= 5) return 'warning'
        return 'info'
    }

    // Modal de permissões
    const PermissionsModal = () => {
        if (!showPermissions) return null

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className={`
                    max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl border shadow-2xl
                    ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                `}>
                    {/* Header do Modal */}
                    <div className={`
                        flex items-center justify-between p-6 border-b
                        ${isDark ? 'border-gray-700' : 'border-gray-200'}
                    `}>
                        <div className="flex items-center gap-3">
                            <Shield className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Suas Permissões ({permissionCount})
                            </h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={X}
                            onClick={() => setShowPermissions(false)}
                            className="flex-shrink-0"
                        />
                    </div>

                    {/* Conteúdo do Modal */}
                    <div className="p-6">
                        {permissions.length > 0 ? (
                            <div className="space-y-3">
                                {permissions.map((permission, index) => (
                                    <div
                                        key={permission.id || index}
                                        className={`
                                            p-4 rounded-lg border transition-all duration-200
                                            ${isDark
                                                ? 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-700'
                                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                                    {permission.name || `Permissão ${index + 1}`}
                                                </h4>
                                                {permission.description && (
                                                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {permission.description}
                                                    </p>
                                                )}
                                                {permission.category && (
                                                    <span className={`
                                                        inline-block px-2 py-1 rounded-full text-xs font-medium mt-2
                                                        ${isDark
                                                            ? 'bg-blue-900/30 text-blue-300'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }
                                                    `}>
                                                        {permission.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Shield className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    Nenhuma permissão encontrada
                                </p>
                                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Entre em contato com o administrador para obter acesso.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="w-full max-w-md">
                <StatsCard
                    title="Permissões Totais"
                    value={isLoading ? '...' : permissionCount.toString()}
                    icon={Shield}
                    iconColor={getPermissionColor()}
                    trend={{
                        value: 'Sistema de permissões ativo',
                        isPositive: true
                    }}
                    description="Total de permissões concedidas"
                    variant="telescope"
                    isDark={isDark}
                    className={`
                        transform hover:scale-105 transition-all duration-300 cursor-pointer
                        ${isLoading ? 'opacity-75' : ''}
                    `}
                    onClick={() => setShowPermissions(true)}
                />

                {/* Botão para ver detalhes */}
                <div className="mt-4 text-center">
                    <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => setShowPermissions(true)}
                        disabled={isLoading || permissionCount === 0}
                        className="min-w-[160px]"
                    >
                        Ver Detalhes
                    </Button>
                </div>
            </div>

            {/* Modal */}
            <PermissionsModal />
        </>
    )
}
