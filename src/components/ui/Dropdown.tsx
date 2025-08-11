'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useLayout } from '@/contexts/LayoutContext'
import { ChevronDown, User, Settings, CreditCard, HelpCircle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface DropdownItem {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ComponentType<{ className?: string }>
    disabled?: boolean
}

interface DropdownHeader {
    avatar?: string
    name: string
    email: string
}

interface DropdownFooter {
    buttonText: string
    onClick: () => void
    variant?: 'primary' | 'error' | 'warning'
}

interface DropdownProps {
    label: string
    items: DropdownItem[]
    header?: DropdownHeader
    footer?: DropdownFooter
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    disabled?: boolean
    placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export const Dropdown: React.FC<DropdownProps> = ({
    label,
    items,
    header,
    footer,
    variant = 'primary',
    size = 'md',
    className,
    disabled = false,
    placement = 'bottom-left'
}) => {
    const { isDark } = useTheme()
    const { isMobile } = useLayout()
    const [ isOpen, setIsOpen ] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Fechar dropdown ao pressionar Escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    }

    const variantClasses = {
        primary: isDark
            ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
            : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
        secondary: isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300',
        ghost: isDark
            ? 'bg-transparent hover:bg-gray-700 text-gray-300 border-gray-600'
            : 'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300'
    }

    const placementClasses = {
        'bottom-left': 'top-full left-0 mt-1',
        'bottom-right': 'top-full right-0 mt-1',
        'top-left': 'bottom-full left-0 mb-1',
        'top-right': 'bottom-full right-0 mb-1'
    }

    const handleItemClick = (item: DropdownItem) => {
        if (item.disabled) return

        if (item.onClick) {
            item.onClick()
        }

        setIsOpen(false)
    }

    const iconSize = size === 'sm' ? 'size-3' : size === 'lg' ? 'size-5' : 'size-4'

    // Variantes do botão do footer
    const footerButtonVariants = {
        primary: isDark
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white',
        error: isDark
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white',
        warning: isDark
            ? 'bg-yellow-600 hover:bg-yellow-700 text-black'
            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
    }

    return (
        <div
            ref={dropdownRef}
            className={twMerge('relative inline-flex', className)}
        >
            {/* Botão do Dropdown */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={twMerge(
                    'inline-flex items-center gap-2 rounded-lg border transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white',
                    sizeClasses[ size ],
                    variantClasses[ variant ],
                    disabled && 'opacity-50 cursor-not-allowed',
                    isMobile && 'touch-manipulation'
                )}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label="Dropdown"
            >
                {label}
                <ChevronDown
                    className={twMerge(
                        iconSize,
                        'transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {/* Menu do Dropdown */}
            {isOpen && (
                <div
                    className={twMerge(
                        'absolute z-50 min-w-60 rounded-lg border shadow-lg transition-all duration-200',
                        'opacity-100 transform scale-100',
                        isDark
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200',
                        placementClasses[ placement ],
                        isMobile && 'min-w-48'
                    )}
                    role="menu"
                    aria-orientation="vertical"
                >
                    {/* Header do Dropdown (se fornecido) */}
                    {header && (
                        <div className={twMerge(
                            'flex items-center gap-3 p-4 border-b',
                            isDark ? 'border-gray-700' : 'border-gray-200'
                        )}>
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {header.avatar ? (
                                        <img
                                            src={header.avatar}
                                            alt="User Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className={twMerge(
                                            'w-full h-full flex items-center justify-center',
                                            isDark ? 'bg-gray-600' : 'bg-gray-300'
                                        )}>
                                            <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Informações do usuário */}
                            <div className="flex-1 min-w-0">
                                <h6 className={twMerge(
                                    'text-base font-semibold truncate',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    {header.name}
                                </h6>
                                <p className={twMerge(
                                    'text-sm font-normal truncate',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                    {header.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Items do Dropdown */}
                    <div className="py-1">
                        {items.map((item, index) => {
                            const ItemIcon = item.icon

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleItemClick(item)}
                                    disabled={item.disabled}
                                    className={twMerge(
                                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                                        'hover:bg-opacity-80 focus:outline-none focus:bg-opacity-80',
                                        isDark
                                            ? 'text-gray-300 hover:bg-gray-700 focus:bg-gray-700'
                                            : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100',
                                        item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                                        isMobile && 'touch-manipulation py-4'
                                    )}
                                    role="menuitem"
                                >
                                    {ItemIcon && (
                                        <ItemIcon className={twMerge(
                                            'w-4 h-4 flex-shrink-0',
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        )} />
                                    )}
                                    <span className="flex-1">{item.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Footer do Dropdown (se fornecido) */}
                    {footer && (
                        <div className={twMerge(
                            'p-4 border-t',
                            isDark ? 'border-gray-700' : 'border-gray-200'
                        )}>
                            <button
                                type="button"
                                onClick={() => {
                                    footer.onClick()
                                    setIsOpen(false)
                                }}
                                className={twMerge(
                                    'w-full px-4 py-2 rounded-lg font-medium transition-colors',
                                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    footerButtonVariants[ footer.variant || 'error' ],
                                    isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                                )}
                            >
                                {footer.buttonText}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// Exemplo de uso com dados padrão
export const UserDropdown: React.FC<{ className?: string }> = ({ className }) => {
    const dropdownItems: DropdownItem[] = [
        {
            label: 'My Profile',
            icon: User,
            onClick: () => console.log('Profile clicked')
        },
        {
            label: 'Settings',
            icon: Settings,
            onClick: () => console.log('Settings clicked')
        },
        {
            label: 'Billing',
            icon: CreditCard,
            onClick: () => console.log('Billing clicked')
        },
        {
            label: 'FAQs',
            icon: HelpCircle,
            onClick: () => console.log('FAQs clicked')
        }
    ]

    const userHeader: DropdownHeader = {
        avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png',
        name: 'John Doe',
        email: 'jhon@doe.com'
    }

    const userFooter: DropdownFooter = {
        buttonText: 'Sign out',
        variant: 'error',
        onClick: () => console.log('Sign out clicked')
    }

    return (
        <Dropdown
            label="Dropdown header"
            items={dropdownItems}
            header={userHeader}
            footer={userFooter}
            variant="primary"
            className={className}
        />
    )
}

// Exemplo de dropdown apenas com footer
export const DropdownWithFooter: React.FC<{ className?: string }> = ({ className }) => {
    const footerItems: DropdownItem[] = [
        {
            label: 'My Profile',
            icon: User,
            onClick: () => console.log('Profile clicked')
        },
        {
            label: 'Settings',
            icon: Settings,
            onClick: () => console.log('Settings clicked')
        },
        {
            label: 'Billing',
            icon: CreditCard,
            onClick: () => console.log('Billing clicked')
        },
        {
            label: 'FAQs',
            icon: HelpCircle,
            onClick: () => console.log('FAQs clicked')
        }
    ]

    const footer: DropdownFooter = {
        buttonText: 'Sign out',
        variant: 'error',
        onClick: () => console.log('Sign out clicked')
    }

    return (
        <Dropdown
            label="Dropdown footer"
            items={footerItems}
            footer={footer}
            variant="primary"
            className={className}
        />
    )
}
