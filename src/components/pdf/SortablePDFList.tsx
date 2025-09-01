'use client'

import React, { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import { twMerge } from 'tailwind-merge'
import { PDFItem } from '@/types/pdf'
import {
    FileText,
    Eye,
    Check,
    Edit3
} from 'lucide-react'

interface SortablePDFListProps {
    items: PDFItem[]
    onSortEnd?: (items: PDFItem[]) => void
    onViewPDF?: (pdf: PDFItem) => void
    onEditPDF?: (pdf: PDFItem) => void
    onSelectPDF?: (pdfId: string) => void
    className?: string
    isDark?: boolean
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6
    animation?: number
    disabled?: boolean
    isSelectionMode?: boolean
    selectedItems?: Set<string>
    selectionOrder?: string[]
    formatDate?: (dateString: string) => string
    viewMode?: 'grid' | 'list'
}

const SortablePDFList: React.FC<SortablePDFListProps> = ({
    items,
    onSortEnd,
    onViewPDF,
    onEditPDF,
    onSelectPDF,
    className = '',
    isDark = false,
    gridCols = 3,
    animation = 150,
    disabled = false,
    isSelectionMode = false,
    selectedItems = new Set(),
    selectionOrder = [],
    formatDate = (date) => new Date(date).toLocaleDateString('pt-BR'),
    viewMode = 'grid'
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
        if (!containerRef.current || disabled || isSelectionMode) return

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
    }, [ animation, disabled, isSelectionMode, onSortEnd, currentItems ])

    // Atualizar configurações do Sortable quando props mudarem
    useEffect(() => {
        if (sortableInstance.current) {
            sortableInstance.current.option('animation', animation)
            sortableInstance.current.option('disabled', disabled || isSelectionMode)
        }
    }, [ animation, disabled, isSelectionMode ])

    const getGridClasses = () => {
        if (viewMode === 'list') {
            return 'grid-cols-1'
        }

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

    const handleViewPDF = (pdf: PDFItem) => {
        onViewPDF?.(pdf)
    }

    const handleEditPDF = (pdf: PDFItem) => {
        onEditPDF?.(pdf)
    }

    const handleSelectPDF = (pdfId: string) => {
        if (isSelectionMode && onSelectPDF) {
            console.log('🔍 SortablePDFList: Selecionando PDF', pdfId)
            onSelectPDF(pdfId)
        }
    }

    const handleCardClick = (e: React.MouseEvent, pdfId: string) => {
        if (isSelectionMode) {
            e.preventDefault()
            e.stopPropagation()
            handleSelectPDF(pdfId)
        }
    }

    const getSelectionNumber = (pdfId: string) => {
        const index = selectionOrder.indexOf(pdfId)
        return index !== -1 ? index + 1 : null
    }

    const renderPDFCard = (pdf: PDFItem) => {
        const isSelected = selectedItems.has(pdf.id)
        const selectionNumber = getSelectionNumber(pdf.id)

        return (
            <div
                key={pdf.id}
                className={twMerge(
                    'pdf-list-item transition-all duration-300 rounded-2xl backdrop-blur-sm',
                    // Background e border baseados no tema e seleção
                    isDark
                        ? isSelected
                            ? 'bg-slate-900/95 border-2 border-blue-500'
                            : 'bg-slate-900/95 border border-gray-600/50'
                        : isSelected
                            ? 'bg-white/98 border-2 border-blue-600'
                            : 'bg-white/98 border border-slate-300/80',
                    // Shadow baseado no tema e seleção
                    isDark
                        ? isSelected
                            ? 'shadow-blue-500/30 shadow-xl'
                            : 'shadow-black/30 shadow-md'
                        : isSelected
                            ? 'shadow-blue-600/20 shadow-xl'
                            : 'shadow-black/10 shadow-md',
                    // Text color baseado no tema
                    isDark ? 'text-slate-50' : 'text-slate-900',
                    // Hover effects
                    !disabled && !isSelectionMode && 'hover:-translate-y-0.5 hover:shadow-lg',
                    isDark && !disabled && !isSelectionMode && 'hover:shadow-black/40',
                    !isDark && !disabled && !isSelectionMode && 'hover:shadow-blue-600/15',
                    // Cursor
                    disabled || isSelectionMode ? 'cursor-pointer' : 'cursor-grab'
                )}
                onClick={(e) => handleCardClick(e, pdf.id)}
                data-id={pdf.id}
            >
                {/* Header */}
                <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={twMerge(
                                'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm',
                                isDark
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                    : 'bg-blue-100 text-blue-800 border-blue-300'
                            )}>
                                <FileText className="w-5 h-5 pdf-file-icon" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className={twMerge(
                                    'text-sm font-semibold leading-tight mb-1 line-clamp-2',
                                    isDark ? 'text-slate-50' : 'text-slate-900'
                                )}>
                                    {pdf.fileName}
                                </h3>
                                <p className={twMerge(
                                    'text-xs font-medium',
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                )}>
                                    {formatDate(pdf.uploadDate)}
                                </p>
                            </div>
                        </div>

                        {/* Indicador de seleção */}
                        {isSelectionMode && (
                            <div className={twMerge(
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ml-2 transition-all duration-200',
                                isSelected
                                    ? 'bg-blue-600 text-white border border-blue-500 shadow-sm'
                                    : isDark
                                        ? 'border-2 border-gray-600 text-gray-400 bg-gray-800/50'
                                        : 'border-2 border-gray-400 text-gray-500 bg-white'
                            )}>
                                {isSelected ? (
                                    selectionNumber || <Check className="w-3 h-3" />
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 pt-1 pb-5">
                    <div className="space-y-3">
                        {/* Ações */}
                        {!isSelectionMode && (
                            <div className={twMerge(
                                'pt-3 border-t',
                                isDark ? 'border-gray-700/50' : 'border-gray-200'
                            )}>
                                <div className="flex gap-2">
                                    <button
                                        className={twMerge(
                                            'flex-1 flex items-center justify-center gap-2 text-sm h-10 font-semibold rounded-xl transition-all duration-200 shadow-sm border',
                                            isDark
                                                ? 'bg-blue-600/90 text-white hover:bg-blue-600 border-blue-500/50 hover:shadow-blue-500/25 hover:shadow-lg'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500 hover:shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5'
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleViewPDF(pdf)
                                        }}
                                    >
                                        <Eye className="w-4 h-4 pdf-icon" />
                                        <span>Ver</span>
                                    </button>

                                    <button
                                        className={twMerge(
                                            'flex-1 flex items-center justify-center gap-2 text-sm h-10 font-semibold rounded-xl transition-all duration-200 shadow-sm border',
                                            isDark
                                                ? 'bg-green-600/90 text-white hover:bg-green-600 border-green-500/50 hover:shadow-green-500/25 hover:shadow-lg'
                                                : 'bg-green-600 text-white hover:bg-green-700 border-green-500 hover:shadow-green-600/25 hover:shadow-lg hover:-translate-y-0.5'
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEditPDF(pdf)
                                        }}
                                    >
                                        <Edit3 className="w-4 h-4 pdf-icon" />
                                        <span>Editar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
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
                    transform: rotate(2deg);
                    z-index: 9999;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .pdf-list-container .pdf-list-item {
                    cursor: ${disabled || isSelectionMode ? 'pointer' : 'grab'};
                    transition: all 0.2s ease-in-out;
                }
                
                .pdf-list-container .pdf-list-item:hover {
                    transform: ${disabled || isSelectionMode ? 'none' : 'translateY(-2px)'};
                }
                
                .pdf-list-container .pdf-list-item:active {
                    cursor: ${disabled || isSelectionMode ? 'pointer' : 'grabbing'};
                }
            `}</style>

            <div
                ref={containerRef}
                className={twMerge(
                    'pdf-list-container grid gap-4',
                    getGridClasses(),
                    className
                )}
            >
                {currentItems.map(renderPDFCard)}
            </div>

            {/* Indicador de status */}
            {!disabled && !isSelectionMode && currentItems.length > 1 && (
                <div className={twMerge(
                    'mt-6 text-center text-sm',
                    isDark ? 'text-gray-200' : 'text-gray-800'
                )}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50">
                        <svg
                            className={twMerge(
                                'w-4 h-4',
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            )}
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

            {/* Indicador de seleção */}
            {isSelectionMode && (
                <div className={twMerge(
                    'mt-6 text-center text-sm',
                    isDark ? 'text-gray-200' : 'text-gray-800'
                )}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700/50">
                        <Check className={twMerge(
                            'w-4 h-4',
                            isDark ? 'text-blue-300' : 'text-blue-700'
                        )} />
                        Clique nos PDFs para selecionar na ordem desejada
                    </span>
                </div>
            )}
        </>
    )
}

export { SortablePDFList }
export type { SortablePDFListProps }
