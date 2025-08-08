'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: {
        default?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
        '2xl'?: number
    }
    gap?: number | string
    center?: boolean
}

const Grid: React.FC<GridProps> = ({
    children,
    className,
    cols = { default: 1 },
    gap = 6,
    center = false,
    ...props
}) => {
    const getGridClasses = () => {
        const classes = [ 'grid' ]

        // Cols responsivos
        if (cols.default) classes.push(`grid-cols-${cols.default}`)
        if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
        if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
        if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
        if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
        if (cols[ '2xl' ]) classes.push(`2xl:grid-cols-${cols[ '2xl' ]}`)

        // Gap
        classes.push(`gap-${gap}`)

        // Center
        if (center) classes.push('place-items-center')

        return classes.join(' ')
    }

    return (
        <div
            className={twMerge(getGridClasses(), className)}
            {...props}
        >
            {children}
        </div>
    )
}

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'col'
    wrap?: boolean
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
    gap?: number | string
    responsive?: {
        sm?: Partial<FlexProps>
        md?: Partial<FlexProps>
        lg?: Partial<FlexProps>
        xl?: Partial<FlexProps>
    }
}

const Flex: React.FC<FlexProps> = ({
    children,
    className,
    direction = 'row',
    wrap = false,
    justify = 'start',
    align = 'stretch',
    gap,
    responsive,
    ...props
}) => {
    const getFlexClasses = () => {
        const classes = [ 'flex' ]

        // Direction
        classes.push(`flex-${direction}`)

        // Wrap
        if (wrap) classes.push('flex-wrap')

        // Justify
        const justifyMap = {
            start: 'justify-start',
            end: 'justify-end',
            center: 'justify-center',
            between: 'justify-between',
            around: 'justify-around',
            evenly: 'justify-evenly'
        }
        classes.push(justifyMap[ justify ])

        // Align
        const alignMap = {
            start: 'items-start',
            end: 'items-end',
            center: 'items-center',
            baseline: 'items-baseline',
            stretch: 'items-stretch'
        }
        classes.push(alignMap[ align ])

        // Gap
        if (gap) classes.push(`gap-${gap}`)

        return classes.join(' ')
    }

    return (
        <div
            className={twMerge(getFlexClasses(), className)}
            {...props}
        >
            {children}
        </div>
    )
}

export { Grid, Flex }
