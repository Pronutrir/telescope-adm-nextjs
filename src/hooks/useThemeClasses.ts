'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

// Hook otimizado para classes de tema com memoização
export const useThemeClasses = () => {
    const { isDark } = useTheme()
    
    return useMemo(() => ({
        // Backgrounds principais
        bgPrimary: isDark ? 'bg-gray-800/95' : 'bg-white/95',
        bgSecondary: isDark ? 'bg-gray-700/80' : 'bg-gray-50/80',
        bgCard: isDark ? 'bg-gray-800/95' : 'bg-white/95',
        bgElevated: isDark ? 'bg-gray-700/90' : 'bg-white/90',
        
        // Textos principais
        textPrimary: isDark ? 'text-white' : 'text-gray-900',
        textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
        textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
        
        // Bordas
        borderPrimary: isDark ? 'border-gray-700/50' : 'border-gray-200/50',
        borderSecondary: isDark ? 'border-gray-600/60' : 'border-gray-300/60',
        
        // Estados de hover
        hoverBg: isDark ? 'hover:bg-gray-700/90' : 'hover:bg-white/90',
        hoverBorder: isDark ? 'hover:border-gray-600/70' : 'hover:border-gray-300/70',
        hoverText: isDark ? 'hover:text-white' : 'hover:text-gray-900',
        
        // Inputs/Form
        inputBg: isDark ? 'bg-gray-700/60' : 'bg-white/90',
        inputBorder: isDark ? 'border-gray-600' : 'border-gray-300',
        inputText: isDark ? 'text-gray-100' : 'text-gray-900',
        inputPlaceholder: isDark ? 'placeholder-gray-400' : 'placeholder-gray-500',
        inputFocusBg: isDark ? 'focus:bg-gray-700/80' : 'focus:bg-white',
        
        // Filtros
        filterPanelBg: isDark ? 'bg-gray-800/80' : 'bg-white/80',
        filterPanelBorder: isDark ? 'border-gray-700/60' : 'border-gray-200/60',
        
        // Botões
        buttonBg: isDark ? 'bg-gray-700/60' : 'bg-white/90',
        buttonBorder: isDark ? 'border-gray-600' : 'border-gray-300',
        buttonText: isDark ? 'text-gray-300' : 'text-gray-700',
        buttonHoverBg: isDark ? 'hover:bg-gray-700/80' : 'hover:bg-white',
        buttonHoverBorder: isDark ? 'hover:border-gray-500' : 'hover:border-gray-400',
        
        // Estados específicos
        loading: {
            bg: isDark ? 'bg-blue-900/20' : 'bg-blue-100',
            text: isDark ? 'text-blue-400' : 'text-blue-700'
        },
        connected: {
            bg: isDark ? 'bg-green-900/20' : 'bg-green-100',
            text: isDark ? 'text-green-400' : 'text-green-700'
        },
        error: {
            bg: isDark ? 'bg-red-900/20' : 'bg-red-100',
            text: isDark ? 'text-red-400' : 'text-red-700'
        },
        warning: {
            bg: isDark ? 'bg-yellow-900/20' : 'bg-yellow-100',
            text: isDark ? 'text-yellow-400' : 'text-yellow-700'
        },
        
        // Gradientes para botões ativos
        gradients: {
            blue: isDark 
                ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-600 text-blue-200 shadow-lg shadow-blue-900/30'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30',
            green: isDark
                ? 'bg-gradient-to-r from-green-900/50 to-emerald-800/50 border-green-600 text-green-200 shadow-lg shadow-green-900/30'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white shadow-lg shadow-green-500/30',
            purple: isDark
                ? 'bg-gradient-to-r from-purple-900/50 to-violet-800/50 border-purple-600 text-purple-200 shadow-lg shadow-purple-900/30'
                : 'bg-gradient-to-r from-purple-500 to-violet-600 border-purple-400 text-white shadow-lg shadow-purple-500/30',
            orange: isDark
                ? 'bg-gradient-to-r from-orange-900/50 to-red-800/50 border-orange-600 text-orange-200 shadow-lg shadow-orange-900/30'
                : 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-400 text-white shadow-lg shadow-orange-500/30'
        }
    }), [isDark])
}

// Hook específico para classes de background da página principal
export const useMainBackground = () => {
    const { isDark } = useTheme()
    
    return useMemo(() => {
        if (isDark) {
            return 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        } else {
            return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
        }
    }, [isDark])
}