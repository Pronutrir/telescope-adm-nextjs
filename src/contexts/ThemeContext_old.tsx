'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [ theme, setTheme ] = useState<Theme>('dark') // Default to dark theme for better UX
    const [ mounted, setMounted ] = useState(false)

    // Carregar tema do localStorage ao inicializar (client-side only)
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('telescope-theme') as Theme
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

            const initialTheme = savedTheme || systemTheme || 'dark'
            setTheme(initialTheme)

            // Aplicar classe no html imediatamente
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(initialTheme)

            setMounted(true)
            console.log(`🎨 Tema inicial carregado: ${initialTheme}`)
        } catch (error) {
            console.warn('Erro ao carregar tema:', error)
            setTheme('dark')
            setMounted(true)
        }
    }, [])

    // Escutar mudanças no tema do sistema
    useEffect(() => {
        if (!mounted) return

        try {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = (e: MediaQueryListEvent) => {
                if (!localStorage.getItem('telescope-theme')) {
                    const newTheme = e.matches ? 'dark' : 'light'
                    setTheme(newTheme)
                    document.documentElement.classList.remove('light', 'dark')
                    document.documentElement.classList.add(newTheme)
                    console.log(`🎨 Tema do sistema alterado para: ${newTheme}`)
                }
            }

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        } catch (error) {
            console.warn('Erro ao configurar listener de tema:', error)
        }
    }, [ mounted ])

    const toggleTheme = () => {
        try {
            const newTheme = theme === 'light' ? 'dark' : 'light'
            setTheme(newTheme)
            localStorage.setItem('telescope-theme', newTheme)

            // Aplicar classe no html
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(newTheme)

            console.log(`🎨 Tema alterado para: ${newTheme}`)
        } catch (error) {
            console.warn('Erro ao alterar tema:', error)
        }
    }

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark'
    }

    // Prevenir hidratação mismatch renderizando apenas após mount
    if (!mounted) {
        return (
            <ThemeContext.Provider value={value}>
                <div suppressHydrationWarning>
                    {children}
                </div>
            </ThemeContext.Provider>
        )
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
