'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface ThemeToggleProps {
    className?: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'button' | 'switch'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = '',
    size = 'md',
    variant = 'button'
}) => {
    const [ mounted, setMounted ] = useState(false)
    const { theme, toggleTheme, isDark } = useTheme()

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    }

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    }

    // Só renderizar após a montagem no cliente
    useEffect(() => {
        setMounted(true)
    }, [])

    // Não renderizar até estar montado
    if (!mounted) {
        return (
            <div className={`${className} opacity-0`}>
                <button className={sizeClasses[ size ]} disabled>
                    <Sun className={iconSizes[ size ]} />
                </button>
            </div>
        )
    }

    if (variant === 'switch') {
        return (
            <div className={`flex items-center space-x-3 ${className}`}>
                <Sun className={`${iconSizes[ size ]} ${isDark ? 'text-muted-foreground' : 'text-theme'}`} />
                <button
                    onClick={toggleTheme}
                    className={`
            relative inline-flex ${sizeClasses[ size ]} items-center rounded-full 
            transition-colors duration-300 focus:outline-none focus:ring-2 
            focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background
            ${isDark ? 'bg-primary-600' : 'bg-muted'}
          `}
                    role="switch"
                    aria-checked={isDark}
                    aria-label={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
                >
                    <span
                        className={`
              inline-block w-6 h-6 rounded-full bg-white shadow-lg transform transition-transform duration-300
              ${isDark ? 'translate-x-6' : 'translate-x-1'}
            `}
                    />
                </button>
                <Moon className={`${iconSizes[ size ]} ${isDark ? 'text-theme' : 'text-muted-foreground'}`} />
            </div>
        )
    }

    return (
        <button
            onClick={toggleTheme}
            className={`
        ${sizeClasses[ size ]} rounded-xl
        bg-card border border-border text-foreground
        hover:bg-card-elevated hover:border-primary-500/50 hover:shadow-neon-green
        flex items-center justify-center
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background
        group ${className}
      `}
            title={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
            aria-label={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
        >
            <div className="relative flex items-center justify-center">
                <Sun
                    className={`
            ${iconSizes[ size ]} absolute text-foreground icon-colored
            transition-all duration-500 transform
            ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `}
                />
                <Moon
                    className={`
            ${iconSizes[ size ]} absolute text-foreground icon-colored
            transition-all duration-500 transform
            ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `}
                />
            </div>
        </button>
    )
}
