'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export const ThemeDebug: React.FC = () => {
    const { theme, isDark } = useTheme()
    const [ htmlClassName, setHtmlClassName ] = useState<string>('Loading...')

    useEffect(() => {
        // Só executar no cliente
        if (typeof window !== 'undefined') {
            setHtmlClassName(document.documentElement.className || 'Sem classes')
        }
    }, [ theme ])

    return (
        <div className="fixed bottom-4 right-4 p-3 bg-card border border-border rounded-lg shadow-lg text-sm z-50">
            <div className="text-foreground">
                <p><strong>Tema atual:</strong> {theme}</p>
                <p><strong>É escuro:</strong> {isDark ? 'Sim' : 'Não'}</p>
                <p><strong>Classe HTML:</strong> {htmlClassName}</p>
            </div>
        </div>
    )
}
