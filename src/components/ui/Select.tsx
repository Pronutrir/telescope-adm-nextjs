'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

interface SelectProps {
    options: SelectOption[]
    value?: string
    placeholder?: string
    disabled?: boolean
    variant?: 'default' | 'modern' | 'telescope'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    isDark?: boolean
    style?: React.CSSProperties
    onChange?: (value: string) => void
    onFocus?: () => void
    onBlur?: () => void
}

const Select: React.FC<SelectProps> = ({
    options,
    value = '',
    placeholder = 'Select option...',
    disabled = false,
    variant = 'default',
    size = 'md',
    className = '',
    isDark = false,
    style,
    onChange,
    onFocus,
    onBlur
}) => {
    const [ isOpen, setIsOpen ] = useState(false)
    const [ selectedOption, setSelectedOption ] = useState<SelectOption | null>(
        options.find(option => option.value === value) || null
    )
    const selectRef = useRef<HTMLDivElement>(null)

    // Função para obter estilos baseados na variante e tema
    const getSelectStyles = () => {
        const sizes = {
            sm: { padding: '0.5rem 2.5rem 0.5rem 0.75rem', fontSize: '0.875rem', iconSize: 16 },
            md: { padding: '0.75rem 2.5rem 0.75rem 1rem', fontSize: '0.875rem', iconSize: 18 },
            lg: { padding: '1rem 3rem 1rem 1.25rem', fontSize: '1rem', iconSize: 20 }
        }

        const currentSize = sizes[ size ]

        if (variant === 'telescope') {
            return {
                container: {
                    position: 'relative' as const,
                    width: '100%'
                },
                toggle: {
                    width: '100%',
                    padding: currentSize.padding,
                    fontSize: currentSize.fontSize,
                    fontWeight: '500',
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: isDark ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '0.75rem',
                    color: isDark ? 'rgb(243, 244, 246)' : 'rgb(30, 41, 59)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.6 : 1,
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: isDark
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                        : '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.05)',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'left' as const,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                dropdown: {
                    position: 'absolute' as const,
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.25rem',
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                    border: isDark ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '0.75rem',
                    boxShadow: isDark
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
                        : '0 10px 15px -3px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto' as const
                },
                option: {
                    padding: '0.75rem 1rem',
                    fontSize: currentSize.fontSize,
                    color: isDark ? 'rgb(243, 244, 246)' : 'rgb(30, 41, 59)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                iconSize: currentSize.iconSize
            }
        } else if (variant === 'modern') {
            return {
                container: {
                    position: 'relative' as const,
                    width: '100%'
                },
                toggle: {
                    width: '100%',
                    padding: currentSize.padding,
                    fontSize: currentSize.fontSize,
                    fontWeight: '500',
                    backgroundColor: isDark ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    border: isDark ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: '0.5rem',
                    color: isDark ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.6 : 1,
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
                    textAlign: 'left' as const,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                dropdown: {
                    position: 'absolute' as const,
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.25rem',
                    backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: isDark ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid rgba(229, 231, 235, 0.8)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto' as const
                },
                option: {
                    padding: '0.75rem 1rem',
                    fontSize: currentSize.fontSize,
                    color: isDark ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                iconSize: currentSize.iconSize
            }
        } else {
            return {
                container: {
                    position: 'relative' as const,
                    width: '100%'
                },
                toggle: {
                    width: '100%',
                    padding: currentSize.padding,
                    fontSize: currentSize.fontSize,
                    fontWeight: '500',
                    backgroundColor: isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                    border: isDark ? '1px solid rgba(75, 85, 99, 0.6)' : '1px solid rgba(203, 213, 225, 0.8)',
                    borderRadius: '0.375rem',
                    color: isDark ? 'rgb(229, 231, 235)' : 'rgb(51, 65, 85)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.6 : 1,
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    textAlign: 'left' as const,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                dropdown: {
                    position: 'absolute' as const,
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.25rem',
                    backgroundColor: isDark ? 'rgba(55, 65, 81, 0.95)' : 'rgba(248, 250, 252, 0.95)',
                    border: isDark ? '1px solid rgba(75, 85, 99, 0.6)' : '1px solid rgba(203, 213, 225, 0.8)',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto' as const
                },
                option: {
                    padding: '0.75rem 1rem',
                    fontSize: currentSize.fontSize,
                    color: isDark ? 'rgb(229, 231, 235)' : 'rgb(51, 65, 85)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                iconSize: currentSize.iconSize
            }
        }
    }

    const selectStyles = getSelectStyles()

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ isOpen ])

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen)
            if (!isOpen && onFocus) {
                onFocus()
            } else if (isOpen && onBlur) {
                onBlur()
            }
        }
    }

    const handleOptionClick = (option: SelectOption) => {
        if (!option.disabled) {
            setSelectedOption(option)
            setIsOpen(false)
            if (onChange) {
                onChange(option.value)
            }
            if (onBlur) {
                onBlur()
            }
        }
    }

    const getOptionHoverStyle = (isSelected: boolean, isDisabled: boolean) => {
        if (isDisabled) {
            return { opacity: 0.5, cursor: 'not-allowed' }
        }

        if (variant === 'telescope') {
            return {
                backgroundColor: isSelected
                    ? (isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)')
                    : (isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
            }
        } else if (variant === 'modern') {
            return {
                backgroundColor: isSelected
                    ? (isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.15)')
                    : (isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(243, 244, 246, 0.8)')
            }
        } else {
            return {
                backgroundColor: isSelected
                    ? (isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)')
                    : (isDark ? 'rgba(75, 85, 99, 0.8)' : 'rgba(241, 245, 249, 0.8)')
            }
        }
    }

    return (
        <div ref={selectRef} style={{ ...selectStyles.container, ...style }} className={className}>
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                style={selectStyles.toggle}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span style={{ flex: 1, textAlign: 'left' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={selectStyles.iconSize}
                    style={{
                        transition: 'transform 0.2s ease-in-out',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                />
            </button>

            {isOpen && (
                <div style={selectStyles.dropdown}>
                    {options.map((option, index) => {
                        const isSelected = selectedOption?.value === option.value
                        return (
                            <div
                                key={option.value || index}
                                onClick={() => handleOptionClick(option)}
                                style={{
                                    ...selectStyles.option,
                                    ...getOptionHoverStyle(isSelected, option.disabled || false)
                                }}
                                onMouseEnter={(e) => {
                                    if (!option.disabled) {
                                        Object.assign(e.currentTarget.style, getOptionHoverStyle(isSelected, false))
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!option.disabled) {
                                        e.currentTarget.style.backgroundColor = isSelected
                                            ? getOptionHoverStyle(isSelected, false).backgroundColor || ''
                                            : 'transparent'
                                    }
                                }}
                            >
                                <span>{option.label}</span>
                                {isSelected && (
                                    <Check
                                        size={selectStyles.iconSize}
                                        style={{
                                            color: variant === 'telescope'
                                                ? (isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)')
                                                : variant === 'modern'
                                                    ? (isDark ? 'rgb(99, 102, 241)' : 'rgb(79, 70, 229)')
                                                    : (isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)')
                                        }}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export { Select }
export type { SelectProps, SelectOption }
