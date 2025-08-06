'use client'

import React from 'react'

interface DivHeaderProps {
    title?: string
    subtitle?: string
    className?: string
}

const DivHeader: React.FC<DivHeaderProps> = ({
    title = "Sistema Administrador",
    subtitle = "Gerenciamento de Pesquisas NPS",
    className = ""
}) => {
    return (
        <div className={`bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 ${className}`}>
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{title}</h1>
                        {subtitle && (
                            <p className="text-slate-300 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-slate-400">
                            {new Date().toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DivHeader
