/**
 * Utilitários para responsividade e breakpoints
 */

export const breakpoints = {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Hook para detectar breakpoint atual
 */
import { useState, useEffect } from 'react'

export const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        
        const updateBreakpoint = () => {
            const width = window.innerWidth
            
            if (width >= 1536) setBreakpoint('2xl')
            else if (width >= 1280) setBreakpoint('xl')
            else if (width >= 1024) setBreakpoint('lg')
            else if (width >= 768) setBreakpoint('md')
            else setBreakpoint('sm')
        }

        updateBreakpoint()
        window.addEventListener('resize', updateBreakpoint)
        
        return () => window.removeEventListener('resize', updateBreakpoint)
    }, [])

    return { breakpoint, isClient }
}

/**
 * Utilitário para classes responsivas
 */
export const responsive = {
    grid: {
        cols1: 'grid-cols-1',
        cols2: 'grid-cols-1 md:grid-cols-2',
        cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        cols6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
        autoFit: 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]'
    },
    spacing: {
        sm: 'space-y-4 md:space-y-6',
        md: 'space-y-6 md:space-y-8',
        lg: 'space-y-8 md:space-y-10 lg:space-y-12',
        xl: 'space-y-10 md:space-y-12 lg:space-y-16'
    },
    padding: {
        sm: 'p-4 md:p-6',
        md: 'p-4 md:p-6 lg:p-8',
        lg: 'p-6 md:p-8 lg:p-10 xl:p-12',
        xl: 'p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20'
    },
    text: {
        xs: 'text-xs sm:text-sm',
        sm: 'text-sm md:text-base',
        base: 'text-base md:text-lg',
        lg: 'text-lg md:text-xl lg:text-2xl',
        xl: 'text-xl md:text-2xl lg:text-3xl',
        '2xl': 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
        '3xl': 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl'
    }
} as const

/**
 * Mixin para container centralizado responsivo
 */
export const containerClasses = {
    centered: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
    wide: 'mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16',
    narrow: 'mx-auto max-w-4xl px-4 sm:px-6',
    full: 'w-full px-4 sm:px-6 lg:px-8'
} as const
