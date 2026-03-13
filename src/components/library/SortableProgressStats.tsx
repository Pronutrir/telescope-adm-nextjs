'use client'

import React, { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressStat } from './ProgressStat'
import { LucideIcon } from 'lucide-react'

interface SortableItem {
    id: string
    title: string
    value: string
    total: string
    progress: number
    icon: LucideIcon
    color: 'success' | 'warning' | 'error' | 'info' | 'primary'
    variant: 'default' | 'modern' | 'telescope'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    style?: React.CSSProperties
}

interface SortableProgressStatsProps {
    items: SortableItem[]
    onSortEnd?: (items: SortableItem[]) => void
    className?: string
    isDark?: boolean
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6
    animation?: number
    disabled?: boolean
}

const GRID_CLASSES = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
} as const

const SortableProgressStats: React.FC<SortableProgressStatsProps> = ({
    items, onSortEnd, className = '', isDark = false,
    gridCols = 3, animation = 150, disabled = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const sortableInstance = useRef<Sortable | null>(null)
    const [currentItems, setCurrentItems] = useState(items)

    useEffect(() => { setCurrentItems(items) }, [items])

    useEffect(() => {
        if (!containerRef.current || disabled) return
        sortableInstance.current = Sortable.create(containerRef.current, {
            animation,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            onEnd: (evt) => {
                const { oldIndex, newIndex } = evt
                if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
                    const newItems = [...currentItems]
                    const [movedItem] = newItems.splice(oldIndex, 1)
                    newItems.splice(newIndex, 0, movedItem)
                    setCurrentItems(newItems)
                    onSortEnd?.(newItems)
                }
            },
        })
        return () => { sortableInstance.current?.destroy(); sortableInstance.current = null }
    }, [animation, disabled, onSortEnd, currentItems])

    useEffect(() => {
        if (sortableInstance.current) {
            sortableInstance.current.option('animation', animation)
            sortableInstance.current.option('disabled', disabled)
        }
    }, [animation, disabled])

    return (
        <>
            <style jsx global>{`
                .sortable-ghost { opacity: 0.4; transform: scale(0.97); }
                .sortable-chosen { cursor: grabbing !important; }
                .sortable-drag { opacity: 0.85; transform: rotate(2deg); z-index: 9999; }
            `}</style>

            <div
                ref={containerRef}
                className={cn('grid gap-4', GRID_CLASSES[gridCols], className)}
            >
                {currentItems.map((item) => (
                    <div
                        key={item.id}
                        data-id={item.id}
                        className={cn(!disabled && 'cursor-grab active:cursor-grabbing')}
                    >
                        <ProgressStat {...item} isDark={isDark} />
                    </div>
                ))}
            </div>

            {!disabled && (
                <div className={cn(
                    'mt-4 text-center text-xs font-medium',
                    isDark ? 'text-slate-500' : 'text-slate-400',
                )}>
                    <span className="inline-flex items-center gap-1.5">
                        <GripVertical className="w-3.5 h-3.5" />
                        Arraste para reorganizar
                    </span>
                </div>
            )}
        </>
    )
}

export { SortableProgressStats }
export type { SortableProgressStatsProps }
