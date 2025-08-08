'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'neon' | 'ghost' | 'outline'
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
        primary: "bg-neon-green text-background border border-neon-green hover:bg-neon-green/90 hover:shadow-neon-green focus:ring-neon-green",
        secondary: "bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground focus:ring-muted-foreground",
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
