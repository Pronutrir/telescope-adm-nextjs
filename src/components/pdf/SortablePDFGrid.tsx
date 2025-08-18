'use client'

import React, { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import { PDFSortableCard } from './PDFSortableCard'
import { PDFItem } from '@/types/pdf'

interface SortablePDFGridProps {
    items: PDFItem[]
    onSortEnd?: (items: PDFItem[]) => void
    isDark?: boolean
    viewMode: 'grid' | 'list'
    isSelectionMode: boolean
    selectedItems: Set<string>
    selectionOrder: string[] // Nova prop para manter a ordem de seleção
    onSelectItem: (pdfId: string) => void
    onViewPDF: (pdf: PDFItem) => void
    formatDate: (dateString: string) => string
    animation?: number
    disabled?: boolean
    className?: string
}

const SortablePDFGrid: React.FC<SortablePDFGridProps> = ({
    items,
    onSortEnd,
    isDark = false,
    viewMode,
    isSelectionMode,
    selectedItems,
    selectionOrder,
    onSelectItem,
    onViewPDF,
    formatDate,
    animation = 150,
    disabled = false,
    className = ''
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
            ghostClass: 'pdf-sortable-ghost',
            chosenClass: 'pdf-sortable-chosen',
            dragClass: 'pdf-sortable-drag',
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
        if (viewMode === 'list') {
            return 'space-y-3'
        }
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    }

    return (
        <>
            {/* Estilos CSS para SortableJS */}
            <style jsx global>{`
                .pdf-sortable-ghost {
                    opacity: 0.4;
                    transform: scale(0.95);
                    border: 2px dashed ${isDark ? '#3b82f6' : '#2563eb'} !important;
                    background: ${isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.05)'} !important;
                }
                
                .pdf-sortable-chosen {
                    cursor: grabbing !important;
                    transform: scale(1.02);
                }
                
                .pdf-sortable-drag {
                    opacity: 0.8;
                    transform: rotate(2deg);
                    z-index: 9999;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                }
                
                .pdf-sortable-container .group {
                    cursor: ${disabled ? 'default' : 'grab'};
                    transition: all 0.2s ease-in-out;
                }
                
                .pdf-sortable-container .group:hover {
                    transform: ${disabled ? 'none' : 'translateY(-2px)'};
                }
                
                .pdf-sortable-container .group:active {
                    cursor: ${disabled ? 'default' : 'grabbing'};
                }
            `}</style>

            <div
                ref={containerRef}
                className={`pdf-sortable-container ${getGridClasses()} ${className}`}
            >
                {currentItems.map((pdf) => (
                    <div
                        key={pdf.id}
                        className="pdf-sortable-item"
                        data-id={pdf.id}
                    >
                        <PDFSortableCard
                            pdf={pdf}
                            isDark={isDark}
                            viewMode={viewMode}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedItems.has(pdf.id)}
                            selectionOrder={selectionOrder.indexOf(pdf.id) + 1 || undefined}
                            onSelect={onSelectItem}
                            onView={onViewPDF}
                            formatDate={formatDate}
                        />
                    </div>
                ))}
            </div>

            {/* Indicador de status */}
            {!disabled && currentItems.length > 1 && (
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
                        Arraste e solte para reorganizar os PDFs
                    </span>
                </div>
            )}
        </>
    )
}

export { SortablePDFGrid }
