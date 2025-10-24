'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Shield, Eye, X, Info } from 'lucide-react'

interface Permission {
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
    const [ hoveredCard, setHoveredCard ] = useState<string | null>(null)

    // Extrair perfis do usuário (nova estrutura UserShield)
    const perfis = user?.perfis || []
    
    // 🔍 DEBUG: Log para verificar quantos perfis chegaram
    console.log('👤 UserPermissionsCard - Total de perfis recebidos:', perfis.length)
    console.log('📦 UserPermissionsCard - Perfis:', perfis.map((p: any) => p.nomePerfil))
    
    // Mapear TODOS os detalhes de cada perfil/role
    const permissions: Permission[] = perfis.map((perfil: any, index: number) => {
        // Formatar data de registro
        const dataRegistro = perfil.dataRegistro 
            ? new Date(perfil.dataRegistro).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })
            : 'N/A'
        
        return {
            id: perfil.id?.toString() || index.toString(),
            name: perfil.nomePerfil,
            description: `Atribuído em ${dataRegistro}`,
            category: perfil.statusPerfil === 'A' ? 'Ativo' : 'Inativo',
            metadata: {
                usuario: perfil.usuario,
                roleId: perfil.roleId,
                dataRegistro: perfil.dataRegistro,
                dataAtualizacao: perfil.dataAtualizacao
            }
        }
    })
    
    // 🔍 DEBUG: Log para verificar quantos permissions foram mapeados
    console.log('🎭 UserPermissionsCard - Total de permissions mapeados:', permissions.length)
    
    const permissionCount = permissions.length

    // Função para gerar cor baseada no nome do perfil
    const getProfileColor = (name: string) => {
        const colors = [
            { light: 'from-blue-50 to-blue-100 border-blue-200', dark: 'bg-blue-900/20 border-blue-500/30', accent: 'bg-blue-500' },
            { light: 'from-purple-50 to-purple-100 border-purple-200', dark: 'bg-purple-900/20 border-purple-500/30', accent: 'bg-purple-500' },
            { light: 'from-green-50 to-green-100 border-green-200', dark: 'bg-green-900/20 border-green-500/30', accent: 'bg-green-500' },
            { light: 'from-orange-50 to-orange-100 border-orange-200', dark: 'bg-orange-900/20 border-orange-500/30', accent: 'bg-orange-500' },
            { light: 'from-pink-50 to-pink-100 border-pink-200', dark: 'bg-pink-900/20 border-pink-500/30', accent: 'bg-pink-500' },
            { light: 'from-cyan-50 to-cyan-100 border-cyan-200', dark: 'bg-cyan-900/20 border-cyan-500/30', accent: 'bg-cyan-500' },
            { light: 'from-indigo-50 to-indigo-100 border-indigo-200', dark: 'bg-indigo-900/20 border-indigo-500/30', accent: 'bg-indigo-500' },
            { light: 'from-teal-50 to-teal-100 border-teal-200', dark: 'bg-teal-900/20 border-teal-500/30', accent: 'bg-teal-500' },
        ]
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return colors[hash % colors.length]
    }

    // Cores baseadas no número de permissões
    // const getPermissionColor = () => {
    //     if (permissionCount >= 10) return 'success'
    //     if (permissionCount >= 5) return 'warning'
    //     return 'info'
    // }

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
                        >
                            <span className="sr-only">Fechar</span>
                        </Button>
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
            {/* Card Principal com Grid de Perfis */}
            <div className={`
                p-8 rounded-xl border shadow-lg
                ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                Meus Perfis ({permissionCount})
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Perfis de acesso atribuídos ao seu usuário
                            </p>
                        </div>
                    </div>
                    
                    {/* Badge de Status */}
                    <div className={`
                        px-4 py-2 rounded-full text-sm font-medium
                        ${permissionCount >= 10
                            ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                            : permissionCount >= 5
                            ? (isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
                            : (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')
                        }
                    `}>
                        {permissionCount >= 10 ? 'Acesso Completo' : permissionCount >= 5 ? 'Acesso Avançado' : 'Acesso Básico'}
                    </div>
                </div>

                {/* Grid de Perfis */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : permissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {permissions.map((permission, index) => {
                            const colors = getProfileColor(permission.name)
                            const isHovered = hoveredCard === permission.id
                            
                            return (
                                <div
                                    key={permission.id || index}
                                    onMouseEnter={() => setHoveredCard(permission.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className={`
                                        group relative p-5 rounded-lg border transition-all duration-200
                                        hover:shadow-lg cursor-pointer overflow-visible
                                        ${isDark
                                            ? `${colors.dark} hover:shadow-xl`
                                            : `bg-gradient-to-br ${colors.light} hover:shadow-xl`
                                        }
                                    `}
                                >
                                    {/* Tooltip com metadata completa */}
                                    {isHovered && permission.metadata && (
                                        <div className={`
                                            absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2
                                            p-4 rounded-lg shadow-xl border min-w-[280px]
                                            ${isDark 
                                                ? 'bg-gray-900 border-gray-700 text-white' 
                                                : 'bg-white border-gray-200 text-gray-800'
                                            }
                                        `}>
                                            {/* Seta do tooltip */}
                                            <div className={`
                                                absolute top-full left-1/2 transform -translate-x-1/2
                                                w-0 h-0 border-l-8 border-r-8 border-t-8
                                                ${isDark ? 'border-l-transparent border-r-transparent border-t-gray-900' : 'border-l-transparent border-r-transparent border-t-white'}
                                            `} />
                                            
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

                                    {/* Barra lateral colorida */}
                                    <div className={`
                                        absolute left-0 top-0 bottom-0 w-1 ${colors.accent}
                                        group-hover:w-2 transition-all duration-200
                                    `} />

                                    {/* Ícone decorativo no canto */}
                                    <div className={`
                                        absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center
                                        transition-all duration-200 group-hover:scale-110
                                        ${colors.accent} opacity-10 group-hover:opacity-20
                                    `}>
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="relative pl-2">
                                        <h3 className={`
                                            font-semibold text-lg mb-2 pr-10
                                            ${isDark ? 'text-white' : 'text-gray-800'}
                                        `}>
                                            {permission.name || `Perfil ${index + 1}`}
                                        </h3>
                                        
                                        {permission.description && (
                                            <p className={`
                                                text-sm mb-3
                                                ${isDark ? 'text-gray-300' : 'text-gray-600'}
                                            `}>
                                                {permission.description}
                                            </p>
                                        )}
                                        
                                        {/* Badge de Status */}
                                        {permission.category && (
                                            <span className={`
                                                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                                                ${permission.category === 'Ativo'
                                                    ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                                                    : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                                                }
                                            `}>
                                                <span className={`
                                                    w-1.5 h-1.5 rounded-full animate-pulse
                                                    ${permission.category === 'Ativo' ? 'bg-green-500' : 'bg-gray-500'}
                                                `} />
                                                {permission.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Shield className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Nenhum perfil encontrado
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Entre em contato com o administrador para obter acesso.
                        </p>
                    </div>
                )}

                {/* Resumo no rodapé */}
                {permissions.length > 0 && (
                    <div className={`
                        mt-6 pt-6 border-t flex items-center justify-between
                        ${isDark ? 'border-gray-700' : 'border-gray-200'}
                    `}>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Sistema de permissões ativo
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => setShowPermissions(true)}
                            className="flex-shrink-0"
                        >
                            Ver Lista Completa
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <PermissionsModal />
        </>
    )
}
