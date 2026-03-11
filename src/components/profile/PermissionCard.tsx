'use client'

import React, { useState } from 'react'
import { Shield, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Permission {
    id: string
    name: string
    description?: string
    category?: string
    metadata?: {
        usuario?: string
        roleId?: number
        dataRegistro?: string
        dataAtualizacao?: string
    }
}

export interface PermissionColors {
    light: string
    dark: string
    accent: string
}

interface PermissionCardProps {
    permission: Permission
    colors: PermissionColors
    isDark: boolean
    index: number
}

export const PermissionCard: React.FC<PermissionCardProps> = ({ permission, colors, isDark, index }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'group relative p-5 rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer overflow-visible',
                isDark ? `${colors.dark} hover:shadow-xl` : `bg-gradient-to-br ${colors.light} hover:shadow-xl`,
            )}
        >
            {isHovered && permission.metadata && (
                <div className={cn(
                    'absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-4 rounded-lg shadow-xl border min-w-[280px]',
                    isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800',
                )}>
                    <div className={cn('absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8', isDark ? 'border-l-transparent border-r-transparent border-t-gray-900' : 'border-l-transparent border-r-transparent border-t-white')} />
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-700/30">
                            <Info className="w-4 h-4 text-blue-400" />
                            <span className="font-semibold text-sm">Detalhes do Perfil</span>
                        </div>
                        {permission.metadata.roleId && (
                            <div className="flex justify-between">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>ID do Role:</span>
                                <span className="font-mono font-medium">{permission.metadata.roleId}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>ID do Perfil:</span>
                            <span className="font-mono font-medium">{permission.id}</span>
                        </div>
                        {permission.metadata.usuario && (
                            <div className="flex justify-between">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Atribuído por:</span>
                                <span className="font-medium">{permission.metadata.usuario}</span>
                            </div>
                        )}
                        {permission.metadata.dataAtualizacao && (
                            <div className="flex justify-between">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Atualizado:</span>
                                <span className="font-medium">
                                    {new Date(permission.metadata.dataAtualizacao).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.accent} group-hover:w-2 transition-all duration-200`} />
            <div className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${colors.accent} opacity-10 group-hover:opacity-20`}>
                <Shield className="w-5 h-5 text-white" />
            </div>

            <div className="relative pl-2">
                <h3 className={cn('font-semibold text-lg mb-2 pr-10', isDark ? 'text-white' : 'text-gray-800')}>
                    {permission.name || `Perfil ${index + 1}`}
                </h3>
                {permission.description && (
                    <p className={cn('text-sm mb-3', isDark ? 'text-gray-300' : 'text-gray-600')}>
                        {permission.description}
                    </p>
                )}
                {permission.category && (
                    <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                        permission.category === 'Ativo'
                            ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                            : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'),
                    )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', permission.category === 'Ativo' ? 'bg-green-500' : 'bg-gray-500')} />
                        {permission.category}
                    </span>
                )}
            </div>
        </div>
    )
}
