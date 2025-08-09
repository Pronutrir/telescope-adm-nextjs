'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'
import { LucideIcon } from 'lucide-react'

interface FlyonCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'telescope' | 'glass'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6
    gradient?: boolean
}

interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

interface CardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
    size?: 'sm' | 'md' | 'lg'
    icon?: LucideIcon
    iconPosition?: 'left' | 'right'
}

// FlyonCard - Componente principal baseado no FlyonUI
const FlyonCard = React.forwardRef<HTMLDivElement, FlyonCardProps>(
    ({ className, variant = 'default', size = 'md', elevation = 'md', ...props }, ref) => {
        const baseClasses = "card transition-all duration-300 hover:-translate-y-1"

        const sizeClasses = {
            sm: "sm:max-w-sm",
            md: "sm:max-w-md",
            lg: "sm:max-w-lg",
            xl: "sm:max-w-xl"
        }

        const variantClasses = {
            default: `
                bg-white/98 dark:bg-gray-800/95 
                text-gray-900 dark:text-gray-100 
                border border-gray-200/70 dark:border-gray-700/60 
                backdrop-blur-xl transition-colors duration-300
                hover:border-blue-500/40 dark:hover:border-blue-400/30
                hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10
            `,
            primary: `
                bg-gradient-to-br from-blue-50/95 to-blue-100/95 dark:from-blue-900/20 dark:to-blue-800/20 
                text-gray-900 dark:text-gray-100 
                border border-blue-300/70 dark:border-blue-700/60 
                backdrop-blur-xl transition-colors duration-300
                hover:border-blue-500/60 dark:hover:border-blue-400/50
                hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/10
            `,
            secondary: `
                bg-gradient-to-br from-gray-50/95 to-gray-100/95 dark:from-gray-800/20 dark:to-gray-700/20 
                text-gray-900 dark:text-gray-100 
                border border-gray-300/70 dark:border-gray-600/60 
                backdrop-blur-xl transition-colors duration-300
                hover:border-gray-500/60 dark:hover:border-gray-400/50
                hover:shadow-lg hover:shadow-gray-500/20 dark:hover:shadow-gray-400/10
            `,
            telescope: `
                bg-white/98 dark:bg-gray-800/98 
                text-gray-900 dark:text-gray-100 
                border border-blue-400/60 dark:border-blue-400/40 
                ring-1 ring-blue-400/30 dark:ring-blue-400/20 
                shadow-lg shadow-blue-500/15 dark:shadow-blue-400/10 
                backdrop-blur-xl transition-colors duration-300
                hover:ring-blue-500/40 dark:hover:ring-blue-400/30
                hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/15
            `,
            glass: `
                backdrop-blur-2xl 
                bg-white/85 dark:bg-gray-800/80 
                text-gray-900 dark:text-gray-100 
                border border-gray-300/50 dark:border-gray-700/40 
                shadow-xl transition-colors duration-300
                hover:shadow-2xl hover:shadow-gray-500/20 dark:hover:shadow-black/30
            `
        }

        const elevationClasses = {
            none: "",
            sm: "shadow-sm hover:shadow-md shadow-gray-900/10 dark:shadow-black/20 hover:shadow-gray-900/15 dark:hover:shadow-black/30",
            md: "shadow-lg hover:shadow-xl card-hover-lift shadow-gray-900/15 dark:shadow-black/20 hover:shadow-gray-900/25 dark:hover:shadow-black/30",
            lg: "shadow-xl hover:shadow-2xl card-hover-lift shadow-gray-900/20 dark:shadow-black/30 hover:shadow-gray-900/30 dark:hover:shadow-black/40",
            xl: "shadow-2xl hover:shadow-3xl card-hover-lift shadow-gray-900/25 dark:shadow-black/40 hover:shadow-gray-900/35 dark:hover:shadow-black/50"
        }

        return (
            <div
                ref={ref}
                className={twMerge(
                    baseClasses,
                    sizeClasses[ size ],
                    variantClasses[ variant ],
                    elevationClasses[ elevation ],
                    className
                )}
                {...props}
            />
        )
    }
)
FlyonCard.displayName = "FlyonCard"

// CardBody - Corpo do card baseado no FlyonUI
const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
    ({ className, padding = 'md', ...props }, ref) => {
        const paddingClasses = {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
            xl: "p-10"
        }

        return (
            <div
                ref={ref}
                className={twMerge(
                    "card-body",
                    paddingClasses[ padding ],
                    className
                )}
                {...props}
            />
        )
    }
)
CardBody.displayName = "CardBody"

// CardTitle - Título do card com gradiente opcional
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, level = 5, gradient = false, children, ...props }, ref) => {
        const baseClasses = "card-title mb-2.5 font-semibold tracking-tight"
        const gradientClasses = gradient
            ? "bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            : "text-foreground"

        const combinedClasses = twMerge(baseClasses, gradientClasses, className)

        switch (level) {
            case 1:
                return <h1 ref={ref} className={combinedClasses} {...props}>{children}</h1>
            case 2:
                return <h2 ref={ref} className={combinedClasses} {...props}>{children}</h2>
            case 3:
                return <h3 ref={ref} className={combinedClasses} {...props}>{children}</h3>
            case 4:
                return <h4 ref={ref} className={combinedClasses} {...props}>{children}</h4>
            case 5:
                return <h5 ref={ref} className={combinedClasses} {...props}>{children}</h5>
            case 6:
                return <h6 ref={ref} className={combinedClasses} {...props}>{children}</h6>
            default:
                return <h5 ref={ref} className={combinedClasses} {...props}>{children}</h5>
        }
    }
)
CardTitle.displayName = "CardTitle"

// CardActions - Área de ações do card
const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
    ({ className, justify = 'start', ...props }, ref) => {
        const justifyClasses = {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
            around: "justify-around"
        }

        return (
            <div
                ref={ref}
                className={twMerge(
                    "card-actions flex items-center gap-3",
                    justifyClasses[ justify ],
                    className
                )}
                {...props}
            />
        )
    }
)
CardActions.displayName = "CardActions"

// CardButton - Botão estilizado para usar dentro do card
const CardButton = React.forwardRef<HTMLButtonElement, CardButtonProps>(
    ({ className, variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', children, ...props }, ref) => {
        const baseClasses = "btn transition-all duration-300 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"

        const variantClasses = {
            primary: "btn-primary bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:ring-primary-500 shadow-lg shadow-primary-500/25",
            secondary: "bg-secondary-600 dark:bg-secondary-500 text-white hover:bg-secondary-700 dark:hover:bg-secondary-600 focus:ring-secondary-500 shadow-lg shadow-secondary-500/25",
            outline: "border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white focus:ring-primary-500",
            ghost: "text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 focus:ring-primary-500",
            link: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline focus:ring-primary-500"
        }

        const sizeClasses = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg"
        }

        return (
            <button
                ref={ref}
                className={twMerge(
                    baseClasses,
                    variantClasses[ variant ],
                    sizeClasses[ size ],
                    className
                )}
                {...props}
            >
                <div className="flex items-center gap-2">
                    {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
                </div>
            </button>
        )
    }
)
CardButton.displayName = "CardButton"

// Componente de exemplo usando FlyonUI refatorado
const WelcomeCard: React.FC = () => {
    return (
        <FlyonCard variant="telescope" size="sm" elevation="lg">
            <CardBody>
                <CardTitle gradient>Welcome to Our Service</CardTitle>
                <p className="mb-4 text-muted-foreground">
                    Discover the features and benefits that our service offers.
                    Enhance your experience with our user-friendly platform designed to meet all your needs.
                </p>
                <CardActions>
                    <CardButton variant="primary">Learn More</CardButton>
                </CardActions>
            </CardBody>
        </FlyonCard>
    )
}

export {
    FlyonCard,
    CardBody,
    CardTitle,
    CardActions,
    CardButton,
    WelcomeCard,
    type FlyonCardProps,
    type CardBodyProps,
    type CardTitleProps,
    type CardActionsProps,
    type CardButtonProps
}
