'use client'

import React from 'react'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface Props {
    isDark: boolean
    isMobile: boolean
    sidebarOpen: boolean
    mounted: boolean
    theme: string
    toggleTheme: () => void
}

const InfoRow: React.FC<{ isDark: boolean; label: string; value: string }> = ({ isDark, label, value }) => (
    <div className="flex justify-between">
        <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>{label}:</span>
        <span className={cn('text-sm font-medium', isDark ? 'text-white' : 'text-gray-900')}>{value}</span>
    </div>
)

export const ContextInfoSection: React.FC<Props> = ({ isDark, isMobile, sidebarOpen, mounted, theme, toggleTheme }) => (
    <div className="mb-12">
        <h2 className={cn('text-3xl font-semibold mb-6 flex items-center gap-2', isDark ? 'text-white' : 'text-slate-800')}>
            <Settings className={cn('w-7 h-7', isDark ? 'text-purple-400' : 'text-purple-600')} />
            Contextos da Aplicação
        </h2>
        <p className={cn('text-lg mb-8', isDark ? 'text-gray-300' : 'text-muted-foreground')}>
            Informações dos contextos de tema e layout em uso na aplicação.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={cn('p-6 rounded-xl border', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50')}>
                <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>🎨 Theme Context</h3>
                <div className="space-y-3">
                    <InfoRow isDark={isDark} label="Tema atual" value={theme} />
                    <InfoRow isDark={isDark} label="Modo escuro" value={isDark ? 'Ativo' : 'Inativo'} />
                    <InfoRow isDark={isDark} label="Mounted" value={mounted ? 'Sim' : 'Não'} />
                    <Button variant="primary" size="sm" onClick={toggleTheme} className="w-full mt-4">
                        Alternar Tema
                    </Button>
                </div>
            </div>
            <div className={cn('p-6 rounded-xl border', isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50/50 border-gray-200/50')}>
                <h3 className={cn('text-xl font-semibold mb-4', isDark ? 'text-white' : 'text-slate-800')}>📱 Layout Context</h3>
                <div className="space-y-3">
                    <InfoRow isDark={isDark} label="Mobile" value={isMobile ? 'Sim' : 'Não'} />
                    <InfoRow isDark={isDark} label="Sidebar aberta" value={sidebarOpen ? 'Sim' : 'Não'} />
                    <InfoRow isDark={isDark} label="Componente mounted" value={mounted ? 'Sim' : 'Não'} />
                    <div className={cn('mt-4 p-3 rounded-lg', isDark ? 'bg-blue-900/20' : 'bg-blue-50')}>
                        <p className={cn('text-xs', isDark ? 'text-blue-300' : 'text-blue-700')}>
                            ℹ️ O layout responde automaticamente ao tamanho da tela.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
