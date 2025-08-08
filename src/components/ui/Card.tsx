'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'gradient' | 'glass' | 'telescope'
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const baseClasses = "rounded-2xl border border-border/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"

        const variantClasses = {
            default: "bg-card/98 text-card-foreground shadow-lg shadow-black/8 hover:shadow-xl hover:shadow-black/15 border-border/40",
            gradient: "bg-gradient-to-br from-card/98 to-card-elevated/98 text-card-foreground shadow-lg shadow-primary/8 hover:shadow-xl hover:shadow-primary/15 border-border/50",
            glass: "glass-theme border-border/30 shadow-lg shadow-black/8 hover:shadow-xl hover:shadow-black/15",
            telescope: "bg-card/98 text-card-foreground shadow-xl shadow-primary/15 hover:shadow-2xl hover:shadow-primary/25 border-primary/30 ring-1 ring-primary/15"
        }

        return (
            <div
                ref={ref}
                className={twMerge(
                    baseClasses,
                    variantClasses[ variant ],
                    className
                )}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge("flex flex-col space-y-2 p-6 pb-4", className)}
            {...props}
        />
    )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={twMerge(
                "text-2xl font-semibold leading-none tracking-tight text-theme",
                className
            )}
            {...props}
        />
    )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={twMerge("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={twMerge("p-6 pt-2", className)} {...props} />
    )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={twMerge("flex items-center p-6 pt-0", className)}
            {...props}
        />
    )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
