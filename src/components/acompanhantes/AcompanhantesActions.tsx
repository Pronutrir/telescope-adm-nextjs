'use client'

import React from 'react'
import { UserPlus, Bell, FileText, History, Users, Settings } from 'lucide-react'
import { FlyonCard } from '@/components/ui/FlyonCard'

interface IAcompanhantesActionsProps {
    className?: string
}

const actionCards = [
    {
        id: 'novo-acompanhante',
        title: 'Novo Acompanhante',
        description: 'Cadastrar novo acompanhante para paciente',
        icon: UserPlus,
        variant: 'primary' as const,
        action: () => console.log('Novo Acompanhante'),
        shortcut: 'Ctrl+N'
    },
    {
        id: 'autorizacoes',
        title: 'Autorizações',
        description: 'Gerenciar pendências e autorizações',
        icon: Bell,
        variant: 'secondary' as const,
        action: () => console.log('Autorizações'),
        badge: 3
    },
    {
        id: 'relatorios',
        title: 'Relatórios',
        description: 'Relatórios de visitação e permanência',
        icon: FileText,
        variant: 'telescope' as const,
        action: () => console.log('Relatórios')
    },
    {
        id: 'historico',
        title: 'Histórico',
        description: 'Consultar histórico de acompanhantes',
        icon: History,
        variant: 'default' as const,
        action: () => console.log('Histórico')
    },
    {
        id: 'grupos',
        title: 'Grupos Familiares',
        description: 'Gerenciar grupos de familiares',
        icon: Users,
        variant: 'glass' as const,
        action: () => console.log('Grupos Familiares')
    },
    {
        id: 'configuracoes',
        title: 'Configurações',
        description: 'Regras e configurações do sistema',
        icon: Settings,
        variant: 'secondary' as const,
        action: () => console.log('Configurações')
    }
]

const AcompanhantesActions: React.FC<IAcompanhantesActionsProps> = ({ className }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className || ''}`}>
            {actionCards.map((card) => {
                const Icon = card.icon
                return (
                    <FlyonCard
                        key={card.id}
                        variant={card.variant}
                        className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={card.action}
                    >
                        <div className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-lg transition-all duration-300 group-hover:scale-110">
                                    <Icon size={24} className="transition-colors duration-300" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                    <h3 className="font-semibold text-sm">
                                        {card.title}
                                    </h3>
                                    {card.badge && (
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {card.badge}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs opacity-70 leading-relaxed">
                                    {card.description}
                                </p>

                                {card.shortcut && (
                                    <div className="pt-2">
                                        <kbd className="px-2 py-1 text-xs bg-black/5 dark:bg-white/10 rounded border opacity-50">
                                            {card.shortcut}
                                        </kbd>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FlyonCard>
                )
            })}
        </div>
    )
}

export default AcompanhantesActions
