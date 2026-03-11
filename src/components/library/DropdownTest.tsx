/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { ChevronDown } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface DropdownTestProps {
    className?: string
}

export const DropdownTest: React.FC<DropdownTestProps> = ({ className }) => {
    // 🎯 STEP 1: ANÁLISE - Contextos obrigatórios
    const { isDark } = useTheme()
    const { isMobile } = useLayout()

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

    return (
        // 🎯 PRESERVAÇÃO: Estrutura HTML exata mantida
        <div
            ref={dropdownRef}
            className={twMerge('dropdown relative inline-flex', className)}
        >
            {/* 🎯 PRESERVAÇÃO: Button com todas as classes funcionais + ADAPTAÇÃO: Tema dinâmico */}
            <button
                id="dropdown-header"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={twMerge(
                    // PRESERVAÇÃO: Classes de layout e funcionalidade
                    'dropdown-toggle inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                    'border transition-all duration-200 font-medium',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    // PRESERVAÇÃO: Responsividade
                    isMobile && 'touch-manipulation',
                    // ADAPTAÇÃO: Tema baseado no contexto
                    isDark
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800'
                        : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500 focus:ring-blue-500 focus:ring-offset-white'
                )}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label="Dropdown"
            >
                Dropdown header
                {/* 🎯 PRESERVAÇÃO: Ícone com animação original + ADAPTAÇÃO: Lucide icon */}
                <ChevronDown
                    className={twMerge(
                        'size-4 transition-transform duration-200',
                        // PRESERVAÇÃO: Rotação no estado open
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {/* 🎯 PRESERVAÇÃO: Menu com classes funcionais exatas + ADAPTAÇÃO: Tema */}
            <ul
                className={twMerge(
                    // PRESERVAÇÃO: Classes de layout e comportamento
                    'dropdown-menu absolute top-full left-0 mt-1 min-w-60 rounded-lg',
                    'border shadow-lg transition-all duration-200 z-50',
                    // PRESERVAÇÃO: Estados de visibilidade
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden',
                    // ADAPTAÇÃO: Tema baseado no contexto
                    isDark
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                )}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="dropdown-header"
            >
                {/* 🎯 PRESERVAÇÃO: Header com estrutura exata + ADAPTAÇÃO: Cores */}
                <li className={twMerge(
                    // PRESERVAÇÃO: Layout original
                    'dropdown-header flex items-center gap-2 p-4 border-b',
                    // ADAPTAÇÃO: Tema
                    isDark ? 'border-gray-700' : 'border-gray-200'
                )}>
                    {/* 🎯 PRESERVAÇÃO: Avatar com classes exatas */}
                    <div className="avatar">
                        <div className="w-10 rounded-full overflow-hidden">
                            <img
                                src="https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png"
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        {/* 🎯 ADAPTAÇÃO: Cores de texto baseadas no tema */}
                        <h6 className={twMerge(
                            'text-base font-semibold',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            John Doe
                        </h6>
                        <small className={twMerge(
                            'text-sm font-normal',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            jhon@doe.com
                        </small>
                    </div>
                </li>

                {/* 🎯 PRESERVAÇÃO: Items com classes originais + ADAPTAÇÃO: Hover themes */}
                <li>
                    <a
                        className={twMerge(
                            // PRESERVAÇÃO: Classes funcionais
                            'dropdown-item block px-4 py-3 text-sm transition-colors',
                            // ADAPTAÇÃO: Estados hover baseados no tema
                            isDark
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100',
                            // PRESERVAÇÃO: Responsividade
                            isMobile && 'py-4'
                        )}
                        href="#"
                        role="menuitem"
                    >
                        My Profile
                    </a>
                </li>
                <li>
                    <a
                        className={twMerge(
                            'dropdown-item block px-4 py-3 text-sm transition-colors',
                            isDark
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100',
                            isMobile && 'py-4'
                        )}
                        href="#"
                        role="menuitem"
                    >
                        Settings
                    </a>
                </li>
                <li>
                    <a
                        className={twMerge(
                            'dropdown-item block px-4 py-3 text-sm transition-colors',
                            isDark
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100',
                            isMobile && 'py-4'
                        )}
                        href="#"
                        role="menuitem"
                    >
                        Billing
                    </a>
                </li>
                <li>
                    <a
                        className={twMerge(
                            'dropdown-item block px-4 py-3 text-sm transition-colors',
                            isDark
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100',
                            isMobile && 'py-4'
                        )}
                        href="#"
                        role="menuitem"
                    >
                        FAQs
                    </a>
                </li>
            </ul>
        </div>
    )
}
