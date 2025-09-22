/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { FileText, Eye, Clock, User } from 'lucide-react'

interface PdfItem {
    id: string
    title: string
    description?: string
    fileName: string
    fileSize: string
    uploadDate: string
    downloadCount?: number
    author?: string
    thumbnail?: string
    tags?: string[]
    variant?: 'default' | 'gradient' | 'glass' | 'telescope'
    className?: string
    style?: React.CSSProperties
    onView?: () => void
}

interface SortablePdfCardsProps {
    items: PdfItem[]
    onSortEnd?: (items: PdfItem[]) => void
    className?: string
    isDark?: boolean
    gridCols?: 1 | 2 | 3 | 4 | 5 | 6
    animation?: number
    disabled?: boolean
    showActions?: boolean
    interactive?: boolean
    // Propriedades para seleção múltipla
    selectionMode?: boolean
    selectedItems?: Set<string>
    selectionOrder?: string[]
    onSelectItem?: (itemId: string) => void
}

const SortablePdfCards: React.FC<SortablePdfCardsProps> = ({
    items,
    onSortEnd,
    className = '',
    gridCols = 3,
    animation = 150,
    disabled = false,
    showActions = true
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

    const formatFileSize = (size: string) => {
        return size
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR')
    }

    return (
        <>
            {/* Estilos CSS para SortableJS - seguindo exatamente o padrão do SortableProgressStats */}
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
                
                .sortable-pdf-container .pdf-card-item {
                    cursor: ${disabled ? 'default' : 'grab'};
                    transition: all 0.2s ease-in-out;
                }
                
                .sortable-pdf-container .pdf-card-item:hover {
                    transform: ${disabled ? 'none' : 'translateY(-2px)'};
                }
                
                .sortable-pdf-container .pdf-card-item:active {
                    cursor: ${disabled ? 'default' : 'grabbing'};
                }
            `}</style>

            <div
                ref={containerRef}
                className={`sortable-pdf-container grid ${getGridClasses()} gap-6 ${className}`}
            >
                {currentItems.map((item) => (
                    <div
                        key={item.id}
                        className="pdf-card-item"
                        data-id={item.id}
                    >
                        <Card
                            variant={item.variant || 'default'}
                            className={item.className}
                            style={item.style}
                        >
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    {/* Thumbnail ou ícone do PDF */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <FileText className="w-6 h-6 text-red-700 dark:text-red-400 pdf-file-icon" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="truncate text-sm font-medium leading-tight">
                                            {item.title}
                                        </CardTitle>
                                        {item.description && (
                                            <CardDescription className="line-clamp-2">
                                                {item.description}
                                            </CardDescription>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    {/* Informações do arquivo */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Arquivo:
                                            </span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate ml-2">
                                                {item.fileName}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Tamanho:
                                            </span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {formatFileSize(item.fileSize)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400 pdf-icon" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {formatDate(item.uploadDate)}
                                            </span>
                                        </div>

                                        {item.author && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="w-4 h-4 text-gray-600 dark:text-gray-400 pdf-icon" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {item.author}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {item.tags && item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            {/* Footer com ações */}
                            {showActions && (
                                <CardFooter>
                                    <div className="flex justify-end gap-2 w-full">
                                        {item.onView && (
                                            <button
                                                onClick={item.onView}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                            >
                                                <Eye className="w-4 h-4 pdf-icon" />
                                                Visualizar
                                            </button>
                                        )}
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                ))}
            </div>

            {/* Indicador de status - igual ao SortableProgressStats */}
            {!disabled && (
                <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50">
                        <svg
                            className="w-4 h-4 text-gray-600 dark:text-gray-400"
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

export { SortablePdfCards }
export type { SortablePdfCardsProps, PdfItem }
