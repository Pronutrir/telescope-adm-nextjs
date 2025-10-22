'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react'

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

    // Função otimizada para aplicar o tema no DOM com transições suaves
    const applyTheme = useCallback((newTheme: Theme) => {
        try {
            const root = document.documentElement

            // Desabilita transições temporariamente para evitar flash
            root.style.setProperty('--theme-transition', 'none')

            // Remove classes antigas e adiciona nova
            root.classList.remove('light', 'dark')
            root.classList.add(newTheme)

            // Re-habilita transições após um frame
            requestAnimationFrame(() => {
                root.style.setProperty('--theme-transition', 'all 0.2s ease-in-out')
            })
        } catch (error) {
            // Silencioso - erro ao aplicar tema
        }
    }, [])

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
        } catch (error) {
            // Silencioso - erro ao carregar tema
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
                }
            }

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        } catch (error) {
            // Silencioso - erro ao configurar listener
        }
    }, [ mounted ])

    const setTheme = useCallback((newTheme: Theme) => {
        try {
            setThemeState(newTheme)
            applyTheme(newTheme)
            localStorage.setItem('telescope-theme', newTheme)
        } catch (error) {
            // Silencioso - erro ao alterar tema
        }
    }, [ applyTheme ])

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }, [ theme, setTheme ])

    // Memoiza o valor do contexto para evitar re-renders desnecessários
    const value = useMemo(() => ({
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark'
    }), [ theme, toggleTheme, setTheme ])

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
