'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
    value: any
    label: string
    disabled?: boolean
}

interface SelectProps {
    options: SelectOption[]
    value?: any
    placeholder?: string
    disabled?: boolean
    className?: string
    isDark?: boolean
    label?: string
    name?: string
    error?: string | false
    helperText?: string
    required?: boolean
    onChange?: (value: any) => void
    onFocus?: () => void
    onBlur?: () => void
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    placeholder = 'Selecione uma opção...',
    disabled = false,
    className = '',
    isDark = false,
    label,
    name,
    error,
    helperText,
    required = false,
    onChange,
    onFocus,
    onBlur
}) => {
    const [ isOpen, setIsOpen ] = useState(false)
    const [ selectedOption, setSelectedOption ] = useState<SelectOption | null>(null)
    const selectRef = useRef<HTMLDivElement>(null)
    const hasError = !!error

    // Atualizar selectedOption quando value mudar
    useEffect(() => {
        const option = options.find(option => option.value === value)
        setSelectedOption(option || null)
    }, [ value, options ])

    // Fechar dropdown quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen)
            if (onFocus && !isOpen) onFocus()
        }
    }

    const handleOptionClick = (option: SelectOption) => {
        if (option.disabled) return

        setSelectedOption(option)
        setIsOpen(false)

        if (onChange) {
            onChange(option.value)
        }

        if (onBlur) onBlur()
    }

    return (
        <div className="space-y-2">
            {label && (
                <label
                    className={`
                        block text-sm font-medium
                        ${hasError
                            ? (isDark ? 'text-red-400' : 'text-red-600')
                            : (isDark ? 'text-gray-300' : 'text-gray-700')
                        }
                    `}
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div ref={selectRef} className={`relative ${className}`}>
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled}
                    className={`
                        w-full px-3 py-3 text-left rounded-lg border transition-colors duration-200
                        flex items-center justify-between
                        ${hasError
                            ? (isDark
                                ? 'border-red-500 bg-red-900/10 text-red-400 focus:ring-red-500/20'
                                : 'border-red-300 bg-red-50 text-red-900 focus:ring-red-500/20'
                            )
                            : (isDark
                                ? 'border-gray-600 bg-gray-700/50 text-white focus:ring-blue-500/20'
                                : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500/20'
                            )
                        }
                        focus:outline-none focus:ring-2 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${!disabled && 'hover:bg-gray-50 dark:hover:bg-gray-700/70'}
                    `}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <span className={`
                        ${selectedOption
                            ? (isDark ? 'text-white' : 'text-gray-900')
                            : (isDark ? 'text-gray-400' : 'text-gray-500')
                        }
                    `}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`
                            h-5 w-5 transition-transform duration-200
                            ${isOpen ? 'rotate-180' : ''}
                            ${isDark ? 'text-gray-400' : 'text-gray-500'}
                        `}
                    />
                </button>

                {isOpen && (
                    <div className={`
                        absolute z-50 w-full mt-1 rounded-lg border shadow-lg max-h-60 overflow-y-auto
                        ${isDark
                            ? 'bg-gray-800 border-gray-600'
                            : 'bg-white border-gray-300'
                        }
                    `}>
                        {options.map((option, index) => {
                            const isSelected = selectedOption?.value === option.value
                            return (
                                <div
                                    key={option.value || index}
                                    onClick={() => handleOptionClick(option)}
                                    className={`
                                        px-3 py-2 cursor-pointer flex items-center justify-between
                                        transition-colors duration-150
                                        ${option.disabled
                                            ? 'opacity-50 cursor-not-allowed'
                                            : (isDark
                                                ? 'hover:bg-gray-700 text-white'
                                                : 'hover:bg-gray-100 text-gray-900'
                                            )
                                        }
                                        ${isSelected
                                            ? (isDark
                                                ? 'bg-blue-900/30 text-blue-400'
                                                : 'bg-blue-50 text-blue-600'
                                            )
                                            : ''
                                        }
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && (
                                        <Check className={`
                                            h-4 w-4
                                            ${isDark ? 'text-blue-400' : 'text-blue-600'}
                                        `} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {(error || helperText) && (
                <div className="space-y-1">
                    {error && (
                        <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                            {error}
                        </p>
                    )}
                    {helperText && !error && (
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {helperText}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export { Select }
export type { SelectProps, SelectOption }
