'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Shield, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Permission } from './PermissionCard'

interface PermissionsModalProps {
    show: boolean
    onClose: () => void
    permissions: Permission[]
    isDark: boolean
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ show, onClose, permissions, isDark }) => {
    if (!show) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={cn(
                'max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl border shadow-2xl',
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
            )}>
                <div className={cn('flex items-center justify-between p-6 border-b', isDark ? 'border-gray-700' : 'border-gray-200')}>
                    <div className="flex items-center gap-3">
                        <Shield className={cn('w-6 h-6', isDark ? 'text-blue-400' : 'text-blue-600')} />
                        <h3 className={cn('text-xl font-semibold', isDark ? 'text-white' : 'text-gray-800')}>
                            Suas Permissões ({permissions.length})
                        </h3>
                    </div>
                    <Button variant="ghost" size="sm" icon={X} onClick={onClose} className="flex-shrink-0">
                        <span className="sr-only">Fechar</span>
                    </Button>
                </div>

                <div className="p-6">
                    {permissions.length > 0 ? (
                        <div className="space-y-3">
                            {permissions.map((permission, index) => (
                                <div
                                    key={permission.id || index}
                                    className={cn(
                                        'p-4 rounded-lg border transition-all duration-200',
                                        isDark
                                            ? 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-700'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100',
                                    )}
                                >
                                    <h4 className={cn('font-medium', isDark ? 'text-white' : 'text-gray-800')}>
                                        {permission.name || `Permissão ${index + 1}`}
                                    </h4>
                                    {permission.description && (
                                        <p className={cn('text-sm mt-1', isDark ? 'text-gray-300' : 'text-gray-600')}>
                                            {permission.description}
                                        </p>
                                    )}
                                    {permission.category && (
                                        <span className={cn(
                                            'inline-block px-2 py-1 rounded-full text-xs font-medium mt-2',
                                            isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800',
                                        )}>
                                            {permission.category}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Shield className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-gray-400' : 'text-gray-500')} />
                            <p className={cn('text-lg font-medium', isDark ? 'text-white' : 'text-gray-800')}>
                                Nenhuma permissão encontrada
                            </p>
                            <p className={cn('text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
                                Entre em contato com o administrador para obter acesso.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
