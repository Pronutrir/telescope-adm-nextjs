'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface PageWrapperProps {
    children: React.ReactNode
    className?: string
    centered?: boolean
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const PageWrapper: React.FC<PageWrapperProps> = ({
    children,
    className,
    centered = true,
    maxWidth = 'xl',
    spacing = 'md'
}) => {
    const maxWidthClasses = {
        sm: 'max-w-2xl',
        md: 'max-w-4xl',
        lg: 'max-w-6xl',
        xl: 'max-w-7xl',
        '2xl': 'max-w-[1400px]',
        full: 'w-full'
    }

    const spacingClasses = {
        none: '',
        sm: 'space-y-4',
        md: 'space-y-6',
        lg: 'space-y-8',
        xl: 'space-y-10'
    }

    return (
        <div className={twMerge(
            'w-full',
            centered && 'mx-auto',
            maxWidthClasses[ maxWidth ],
            spacingClasses[ spacing ],
            className
        )}>
            {children}
        </div>
    )
}

export { PageWrapper }
