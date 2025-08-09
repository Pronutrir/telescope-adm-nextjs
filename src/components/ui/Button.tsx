'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'neon' | 'ghost' | 'outline'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    icon?: LucideIcon
    iconPosition?: 'left' | 'right'
    loading?: boolean
    children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    variant = 'default',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    className,
    children,
    disabled,
    ...props
}) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

    const variantClasses = {
        default: "bg-card text-card-foreground border border-border hover:bg-card-elevated hover:border-primary-500/50 hover:shadow-theme focus:ring-primary-500",
        primary: "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:shadow-lg focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
        secondary: "bg-purple-600 text-white border border-purple-600 hover:bg-purple-700 hover:border-purple-700 hover:shadow-lg focus:ring-purple-500 dark:bg-purple-500 dark:hover:bg-purple-600",
        accent: "bg-violet-600 text-white border border-violet-600 hover:bg-violet-700 hover:border-violet-700 hover:shadow-lg focus:ring-violet-500 dark:bg-violet-500 dark:hover:bg-violet-600",
        info: "bg-sky-600 text-white border border-sky-600 hover:bg-sky-700 hover:border-sky-700 hover:shadow-lg focus:ring-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600",
        success: "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700 hover:shadow-lg focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600",
        warning: "bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 hover:border-orange-700 hover:shadow-lg focus:ring-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600",
        error: "bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 hover:shadow-lg focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
        neon: "bg-gradient-to-r from-neon-green/80 to-neon-blue/80 text-background border border-neon-green/50 hover:from-neon-green hover:to-neon-blue hover:shadow-neon focus:ring-neon-green",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-accent",
        outline: "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-background hover:shadow-neon-green focus:ring-primary-500"
    }

    const sizeClasses = {
        sm: "h-8 px-3 text-sm gap-2",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-3",
        xl: "h-14 px-8 text-lg gap-3"
    }

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-4 h-4",
        lg: "w-5 h-5",
        xl: "w-6 h-6"
    }

    return (
        <button
            className={twMerge(
                baseClasses,
                variantClasses[ variant ],
                sizeClasses[ size ],
                loading && "cursor-wait",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            )}

            {Icon && iconPosition === 'left' && !loading && (
                <Icon className={iconSizes[ size ]} />
            )}

            {children}

            {Icon && iconPosition === 'right' && !loading && (
                <Icon className={iconSizes[ size ]} />
            )}
        </button>
    )
}

export { Button }
