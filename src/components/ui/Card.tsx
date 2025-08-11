'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'gradient' | 'glass' | 'telescope'
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

type CardContentProps = React.HTMLAttributes<HTMLDivElement>

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const baseClasses = "rounded-2xl border backdrop-blur-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1"

        const variantClasses = {
            default: `
                bg-white/98 dark:bg-gray-800/95 
                text-gray-900 dark:text-gray-100 
                border-gray-300/70 dark:border-gray-700/60 
                shadow-lg shadow-gray-900/15 dark:shadow-black/20 
                hover:shadow-xl hover:shadow-gray-900/25 dark:hover:shadow-black/30
                hover:border-blue-500/40 dark:hover:border-blue-400/30
            `,
            gradient: `
                bg-gradient-to-br from-white/98 to-gray-50/98 dark:from-gray-800/98 dark:to-gray-900/98 
                text-gray-900 dark:text-gray-100 
                border-gray-300/60 dark:border-gray-700/50 
                shadow-lg shadow-blue-500/15 dark:shadow-blue-400/8 
                hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/15
                hover:border-blue-500/50 dark:hover:border-blue-400/40
            `,
            glass: `
                bg-white/85 dark:bg-gray-800/80 
                text-gray-900 dark:text-gray-100 
                border-gray-300/50 dark:border-gray-700/40 
                shadow-lg shadow-gray-900/15 dark:shadow-black/20 
                hover:shadow-xl hover:shadow-gray-900/25 dark:hover:shadow-black/30
                backdrop-blur-2xl
            `,
            telescope: `
                bg-white/98 dark:bg-gray-800/98 
                text-gray-900 dark:text-gray-100 
                border-blue-400/60 dark:border-blue-400/40 
                shadow-xl shadow-blue-500/20 dark:shadow-blue-400/15 
                hover:shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-blue-400/25
                ring-1 ring-blue-400/30 dark:ring-blue-400/20
                hover:ring-blue-500/40 dark:hover:ring-blue-400/30
            `
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
                "text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100 transition-colors duration-300",
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
            className={twMerge(
                "text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300",
                className
            )}
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
