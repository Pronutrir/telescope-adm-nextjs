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
            default: "bg-card/98 text-card-foreground border border-border/40 backdrop-blur-sm",
            primary: "bg-gradient-to-br from-primary/15 to-primary/8 text-card-foreground border border-primary/40 backdrop-blur-sm",
            secondary: "bg-gradient-to-br from-secondary/15 to-secondary/8 text-card-foreground border border-secondary/40 backdrop-blur-sm",
            telescope: "bg-card/98 text-card-foreground border border-primary/30 ring-1 ring-primary/15 shadow-lg shadow-primary/10 backdrop-blur-sm",
            glass: "backdrop-blur-xl bg-card/90 border border-border/30 shadow-xl"
        }

        const elevationClasses = {
            none: "",
            sm: "shadow-sm hover:shadow-md",
            md: "shadow-lg hover:shadow-xl card-hover-lift",
            lg: "shadow-xl hover:shadow-2xl card-hover-lift",
            xl: "shadow-2xl hover:shadow-3xl card-hover-lift"
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
            primary: "btn-primary bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
            secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500",
            outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500",
            ghost: "text-primary-600 hover:bg-primary-50 hover:text-primary-700 focus:ring-primary-500",
            link: "text-primary-600 hover:text-primary-700 hover:underline focus:ring-primary-500"
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
