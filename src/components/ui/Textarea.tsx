import React from 'react'
import { LucideIcon } from 'lucide-react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string | false
    icon?: LucideIcon
    helperText?: string
    isDark?: boolean
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    icon: Icon,
    helperText,
    isDark = false,
    className = '',
    id,
    name,
    ...props
}) => {
    const fieldId = id || name
    const hasError = !!error

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={fieldId}
                    className={`
                        block text-sm font-medium
                        ${hasError
                            ? (isDark ? 'text-red-400' : 'text-red-600')
                            : (isDark ? 'text-gray-300' : 'text-gray-700')
                        }
                    `}
                >
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-3 z-10">
                        <Icon 
                            className={`h-5 w-5 ${hasError ? 'input-icon-error' : 'input-icon'}`}
                        />
                    </div>
                )}

                <textarea
                    id={fieldId}
                    name={name}
                    className={`
                        block w-full px-3 py-3 rounded-lg border transition-colors duration-200
                        ${Icon ? 'pl-11' : 'pl-3'}
                        ${hasError
                            ? (isDark
                                ? 'border-red-500 bg-red-900/10 text-red-400 placeholder-red-400/50 focus:ring-red-500/20'
                                : 'border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:ring-red-500/20'
                            )
                            : (isDark
                                ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-blue-500/20'
                                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-500/20'
                            )
                        }
                        focus:outline-none focus:ring-2 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        resize-none
                        ${className}
                    `}
                    {...props}
                />
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
