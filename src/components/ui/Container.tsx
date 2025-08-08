'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    centered?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const Container: React.FC<ContainerProps> = ({
    children,
    className,
    size = 'xl',
    centered = true,
    padding = 'md',
    ...props
}) => {
    const sizeClasses = {
        sm: 'max-w-2xl',
        md: 'max-w-4xl',
        lg: 'max-w-6xl',
        xl: 'max-w-7xl',
        full: 'max-w-[1920px]'
    }

    const paddingClasses = {
        none: '',
        sm: 'px-4 py-4 sm:px-6 sm:py-6',
        md: 'px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10',
        lg: 'px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10 lg:py-14',
        xl: 'px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-12 xl:py-14 2xl:px-16 2xl:py-16'
    }

    return (
        <div
            className={twMerge(
                'w-full',
                centered && 'mx-auto',
                sizeClasses[ size ],
                paddingClasses[ padding ],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export { Container }
