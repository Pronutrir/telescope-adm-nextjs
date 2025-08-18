'use client'

import React from 'react'
import { FileText, Eye } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { PDFItem } from '@/types/pdf'

interface PDFSortableCardProps {
    pdf: PDFItem
    isDark?: boolean
    viewMode: 'grid' | 'list'
    isSelectionMode: boolean
    isSelected: boolean
    selectionOrder?: number // Nova prop para mostrar a ordem de seleção
    onSelect: (pdfId: string) => void
    onView: (pdf: PDFItem) => void
    formatDate: (dateString: string) => string
}

const PDFSortableCard: React.FC<PDFSortableCardProps> = ({
    pdf,
    isDark = false,
    viewMode,
    isSelectionMode,
    isSelected,
    selectionOrder,
    onSelect,
    onView,
    formatDate
}) => {
    const handleClick = () => {
        if (!isSelectionMode) {
            onView(pdf)
        }
    }

    const handleCheckboxChange = () => {
        onSelect(pdf.id)
    }

    return (
        <div
            className={twMerge(
                'group relative rounded-lg border transition-all duration-200 cursor-pointer',
                'hover:shadow-lg',
                isSelected
                    ? isDark
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-blue-500 bg-blue-50'
                    : isDark
                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        : 'border-gray-200 bg-white hover:border-gray-300',
                viewMode === 'grid' ? 'p-6' : 'p-4'
            )}
            onClick={handleClick}
        >
            {/* Checkbox para seleção */}
            {isSelectionMode && (
                <div className="absolute top-2 left-2 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Indicador de ordem de seleção */}
            {isSelectionMode && isSelected && selectionOrder && (
                <div className="absolute top-1 left-8 z-20">
                    <div className={twMerge(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2',
                        isDark
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-blue-500 border-blue-300 text-white'
                    )}>
                        {selectionOrder}
                    </div>
                    <div className={twMerge(
                        'absolute -bottom-5 left-1/2 transform -translate-x-1/2',
                        'text-xs font-medium whitespace-nowrap',
                        isDark ? 'text-blue-300' : 'text-blue-600'
                    )}>
                        {selectionOrder === 1 ? '1º' : selectionOrder === 2 ? '2º' : selectionOrder === 3 ? '3º' : `${selectionOrder}º`}
                    </div>
                </div>
            )}

            {viewMode === 'grid' ? (
                <div className="text-center space-y-4">
                    <div className={twMerge(
                        'w-16 h-16 mx-auto rounded-lg flex items-center justify-center transition-colors',
                        isDark
                            ? 'bg-blue-900/30 border border-blue-800/50'
                            : 'bg-blue-50 border border-blue-200/50'
                    )}>
                        <FileText className={twMerge(
                            'w-8 h-8 transition-colors',
                            isDark ? 'text-blue-300' : 'text-blue-600'
                        )} />
                    </div>
                    <div>
                        <h3 className={twMerge(
                            'font-medium text-sm line-clamp-2',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            {pdf.title}
                        </h3>
                        <p className={twMerge(
                            'text-xs mt-1 line-clamp-2',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            {pdf.description}
                        </p>
                        <p className={twMerge(
                            'text-xs mt-1',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            {pdf.size} • {formatDate(pdf.uploadDate)}
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onView(pdf)
                            }}
                            className={twMerge(
                                'p-2 rounded-lg transition-all duration-200',
                                isDark
                                    ? 'hover:bg-blue-900/50 text-blue-300 hover:text-blue-200 border border-blue-800/50 hover:border-blue-700'
                                    : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300'
                            )}
                            title="Visualizar PDF"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <div className={twMerge(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                        isDark
                            ? 'bg-blue-900/30 border border-blue-800/50'
                            : 'bg-blue-50 border border-blue-200/50'
                    )}>
                        <FileText className={twMerge(
                            'w-5 h-5 transition-colors',
                            isDark ? 'text-blue-300' : 'text-blue-600'
                        )} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className={twMerge(
                            'font-medium text-sm truncate',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            {pdf.title}
                        </h3>
                        <p className={twMerge(
                            'text-xs mt-1 truncate',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            {pdf.description}
                        </p>
                        <p className={twMerge(
                            'text-xs mt-1',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            {pdf.size} • {formatDate(pdf.uploadDate)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onView(pdf)
                            }}
                            className={twMerge(
                                'p-2 rounded-lg transition-all duration-200',
                                isDark
                                    ? 'hover:bg-blue-900/50 text-blue-300 hover:text-blue-200 border border-blue-800/50 hover:border-blue-700'
                                    : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300'
                            )}
                            title="Visualizar PDF"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Drag handle indicator */}
            {!isSelectionMode && (
                <div className={twMerge(
                    'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity',
                    'cursor-grab active:cursor-grabbing',
                    isDark ? 'text-gray-400' : 'text-gray-500'
                )}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                    </svg>
                </div>
            )}
        </div>
    )
}

export { PDFSortableCard }
