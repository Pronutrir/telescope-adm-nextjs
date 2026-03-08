'use client'

import React, { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
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

const SortableProgressStats: React.FC<SortableProgressStatsProps> = ({
    items,
    onSortEnd,
    className = '',
    isDark = false,
    gridCols = 3,
    animation = 150,
    disabled = false
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const sortableInstance = useRef<Sortable | null>(null)
    const [ currentItems, setCurrentItems ] = useState(items)

    // Atualizar items quando props mudarem
    useEffect(() => {
        setCurrentItems(items)
    }, [ items ])

    // Inicializar SortableJS
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
                    const newItems = [ ...currentItems ]
                    const [ movedItem ] = newItems.splice(oldIndex, 1)
                    newItems.splice(newIndex, 0, movedItem)

                    setCurrentItems(newItems)
                    onSortEnd?.(newItems)
                }
            }
        })

        return () => {
            if (sortableInstance.current) {
                sortableInstance.current.destroy()
                sortableInstance.current = null
            }
        }
    }, [ animation, disabled, onSortEnd, currentItems ])

    // Atualizar configurações do Sortable quando props mudarem
    useEffect(() => {
        if (sortableInstance.current) {
            sortableInstance.current.option('animation', animation)
            sortableInstance.current.option('disabled', disabled)
        }
    }, [ animation, disabled ])

    const getGridClasses = () => {
        const gridClasses = {
            1: 'grid-cols-1',
            2: 'grid-cols-1 md:grid-cols-2',
            3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
            5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
            6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
        }
        return gridClasses[ gridCols ]
    }

    return (
        <>
            {/* Estilos CSS para SortableJS */}
            <style jsx global>{`
                .sortable-ghost {
                    opacity: 0.5;
                    transform: scale(0.95);
                }
                
                .sortable-chosen {
                    cursor: grabbing !important;
                }
                
                .sortable-drag {
                    opacity: 0.8;
                    transform: rotate(5deg);
                    z-index: 9999;
                }
                
                .sortable-container .progress-stat-item {
                    cursor: ${disabled ? 'default' : 'grab'};
                    transition: all 0.2s ease-in-out;
                }
                
                .sortable-container .progress-stat-item:hover {
                    transform: ${disabled ? 'none' : 'translateY(-2px)'};
                }
                
                .sortable-container .progress-stat-item:active {
                    cursor: ${disabled ? 'default' : 'grabbing'};
                }
            `}</style>

            <div
                ref={containerRef}
                className={`sortable-container grid ${getGridClasses()} gap-4 ${className}`}
            >
                {currentItems.map((item) => (
                    <div
                        key={item.id}
                        className="progress-stat-item"
                        data-id={item.id}
                    >
                        <ProgressStat
                            title={item.title}
                            value={item.value}
                            total={item.total}
                            progress={item.progress}
                            icon={item.icon}
                            color={item.color}
                            variant={item.variant}
                            size={item.size}
                            isDark={isDark}
                            className={item.className}
                            style={item.style}
                        />
                    </div>
                ))}
            </div>

            {/* Indicador de status */}
            {!disabled && (
                <div className={`mt-4 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="inline-flex items-center gap-2">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                        </svg>
                        Arraste e solte para reorganizar
                    </span>
                </div>
            )}
        </>
    )
}

export { SortableProgressStats }
export type { SortableProgressStatsProps }
