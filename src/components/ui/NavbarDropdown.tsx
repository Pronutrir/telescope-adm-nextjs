'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface NavbarDropdownProps {
    user?: {
        nomeCompleto?: string
        email?: string
    }
    onLogout: () => void
    isLoggingOut: boolean
    className?: string
}

export const NavbarDropdown: React.FC<NavbarDropdownProps> = ({
    user,
    onLogout,
    isLoggingOut,
    className
}) => {
    // 🎯 STEP 1: ANÁLISE - Contextos obrigatórios
    const { isDark } = useTheme()
    const { } = useLayout()

    // 🎯 STEP 2: PRESERVAÇÃO - Estado e funcionalidades originais
    const [ isOpen, setIsOpen ] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Preservar comportamentos JavaScript originais
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    const handleLogoutClick = () => {
        setIsOpen(false)
        onLogout()
    }

    return (
        // 🎯 PRESERVAÇÃO: Estrutura HTML do dropdown original mantida
        <div
            ref={dropdownRef}
            className={twMerge('relative', className)}
        >
            {/* 🎯 PRESERVAÇÃO: Button com layout original + ADAPTAÇÃO: Tema dinâmico */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={twMerge(
                    // PRESERVAÇÃO: Classes de layout originais
                    'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300',
                    // ADAPTAÇÃO: Tema baseado no contexto
                    isDark
                        ? 'bg-gray-700/80 border-gray-600 hover:bg-gray-600/80 hover:border-blue-400/50'
                        : 'bg-gray-100/80 border-gray-300 hover:bg-gray-200/80 hover:border-blue-500/50'
                )}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label="User menu"
            >
                {/* 🎯 PRESERVAÇÃO: Avatar com gradiente original */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 text-white" />
                </div>

                {/* 🎯 PRESERVAÇÃO: Info do usuário com responsividade original */}
                <div className="hidden sm:block text-left">
                    <div className={twMerge(
                        'text-sm font-medium',
                        isDark ? 'text-white' : 'text-gray-800'
                    )}>
                        {user?.nomeCompleto || 'Usuário'}
                    </div>
                    <div className={twMerge(
                        'text-xs',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                        {user?.email || 'user@example.com'}
                    </div>
                </div>

                {/* 🎯 PRESERVAÇÃO: Ícone chevron com animação + ADAPTAÇÃO: Cores */}
                <ChevronDown className={twMerge(
                    'w-4 h-4 transition-transform duration-200',
                    isOpen && 'rotate-180',
                    isDark ? 'text-gray-300' : 'text-gray-600'
                )} />
            </button>

            {/* 🎯 PRESERVAÇÃO: Menu dropdown com classes funcionais exatas + ADAPTAÇÃO: Tema */}
            <div className={twMerge(
                // PRESERVAÇÃO: Posicionamento e layout originais
                'absolute right-0 top-full mt-2 w-48 border rounded-lg shadow-2xl',
                'transition-all duration-200 transform',
                // PRESERVAÇÃO: Estados de visibilidade originais
                isOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible translate-y-1',
                // ADAPTAÇÃO: Tema baseado no contexto
                isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
            )}>
                <div className="py-2">
                    {/* 🎯 PRESERVAÇÃO: Item Perfil com classes originais + ADAPTAÇÃO: Tema */}
                    <a
                        href="/profile"
                        className={twMerge(
                            // PRESERVAÇÃO: Classes funcionais originais
                            'flex items-center px-4 py-2 text-sm transition-all duration-200',
                            // ADAPTAÇÃO: Estados hover baseados no tema
                            isDark
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <User className={twMerge(
                            'w-4 h-4 mr-3',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )} />
                        Perfil
                    </a>

                    {/* 🎯 PRESERVAÇÃO: Item Configurações com classes originais + ADAPTAÇÃO: Tema */}
                    <a
                        href="/settings"
                        className={twMerge(
                            'flex items-center px-4 py-2 text-sm transition-all duration-200',
                            isDark
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <Settings className={twMerge(
                            'w-4 h-4 mr-3',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )} />
                        Configurações
                    </a>

                    {/* 🎯 PRESERVAÇÃO: Separador horizontal + ADAPTAÇÃO: Cores */}
                    <hr className={twMerge(
                        'my-2',
                        isDark ? 'border-gray-700' : 'border-gray-200'
                    )} />

                    {/* 🎯 PRESERVAÇÃO: Botão logout com estados originais + ADAPTAÇÃO: Tema */}
                    <button
                        onClick={handleLogoutClick}
                        disabled={isLoggingOut}
                        className={twMerge(
                            // PRESERVAÇÃO: Classes funcionais originais
                            'w-full flex items-center px-4 py-2 text-sm transition-all duration-200',
                            // ADAPTAÇÃO: Mesma aparência das outras opções
                            isLoggingOut
                                ? isDark
                                    ? 'text-gray-500 bg-gray-700/50 cursor-not-allowed'
                                    : 'text-gray-400 bg-gray-100/50 cursor-not-allowed'
                                : isDark
                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                        )}
                    >
                        <LogOut className={twMerge(
                            'w-4 h-4 mr-3',
                            // PRESERVAÇÃO: Animação de loading original
                            isLoggingOut && 'animate-spin',
                            // ADAPTAÇÃO: Mesma cor de ícone das outras opções
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )} />
                        {isLoggingOut ? 'Saindo...' : 'Sair'}
                    </button>
                </div>
            </div>
        </div>
    )
}
