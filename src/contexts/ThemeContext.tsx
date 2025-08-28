'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    isDark: boolean
    setTheme: (theme: Theme) => void
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
    const [ theme, setThemeState ] = useState<Theme>('dark') // Default to dark theme for better UX
    const [ mounted, setMounted ] = useState(false)

    // Função para aplicar o tema no DOM
    const applyTheme = (newTheme: Theme) => {
        try {
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(newTheme)
            console.log(`🎨 Tema aplicado: ${newTheme}`)
        } catch (error) {
            console.warn('Erro ao aplicar tema:', error)
        }
    }

    // Carregar tema do localStorage ao inicializar (client-side only)
    useEffect(() => {
        try {
            // Verificar se já existe um tema aplicado no HTML (pelo script)
            const hasExistingTheme = document.documentElement.classList.contains('dark')

            // Obter tema do localStorage ou preferência do sistema
            const savedTheme = localStorage.getItem('telescope-theme') as Theme
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            const initialTheme = savedTheme || systemTheme || 'dark'

            // Se o tema atual não corresponde ao que deveria ser, aplicar o correto
            if ((initialTheme === 'dark') !== hasExistingTheme) {
                applyTheme(initialTheme)
            }

            setThemeState(initialTheme)
            setMounted(true)
            console.log(`🎨 Tema inicial sincronizado: ${initialTheme}`)
        } catch (error) {
            console.warn('Erro ao carregar tema:', error)
            setThemeState('dark')
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
                    setThemeState(newTheme)
                    applyTheme(newTheme)
                    console.log(`🎨 Tema do sistema alterado para: ${newTheme}`)
                }
            }

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        } catch (error) {
            console.warn('Erro ao configurar listener de tema:', error)
        }
    }, [ mounted ])

    const setTheme = (newTheme: Theme) => {
        try {
            setThemeState(newTheme)
            applyTheme(newTheme)
            localStorage.setItem('telescope-theme', newTheme)
            console.log(`🎨 Tema alterado para: ${newTheme}`)
        } catch (error) {
            console.warn('Erro ao alterar tema:', error)
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }

    const value = {
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark'
    }

    // Prevenir hidratação mismatch renderizando apenas após mount
    if (!mounted) {
        return (
            <ThemeContext.Provider value={value}>
                <div style={{ visibility: 'hidden' }} suppressHydrationWarning>
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
