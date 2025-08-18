'use client'

import React from 'react'
import { PDFItem } from '@/types/pdf'
import { useTheme } from '@/contexts/ThemeContext'
import {
    FileText,
    Eye,
    Download,
    Trash2,
    Calendar,
    HardDrive,
    MoreVertical
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface PDFCardProps {
    pdf: PDFItem
    isSelected?: boolean
    isSelectionMode?: boolean
    viewMode?: 'grid' | 'list'
    onView?: (pdf: PDFItem) => void
    onDownload?: (pdf: PDFItem) => void
    onDelete?: (pdf: PDFItem) => void
    onSelect?: (pdf: PDFItem) => void
    className?: string
}

/**
 * Componente Card para exibição de PDFs
 * Suporta tanto visualização em grid quanto em lista
 */
export const PDFCard: React.FC<PDFCardProps> = ({
    pdf,
    isSelected = false,
    isSelectionMode = false,
    viewMode = 'grid',
    onView,
    onDownload,
    onDelete,
    onSelect,
    className
}) => {
    const { isDark } = useTheme()

    // Formatação de data
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    // Handlers
    const handleCardClick = () => {
        if (isSelectionMode && onSelect) {
            onSelect(pdf)
        } else if (onView) {
            onView(pdf)
        }
    }

    const handleViewClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onView) onView(pdf)
    }

    const handleDownloadClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onDownload) onDownload(pdf)
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onDelete) onDelete(pdf)
    }

    const handleSelectClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (onSelect) onSelect(pdf)
    }

    if (viewMode === 'list') {
        return (
            <div
                className={twMerge(
                    'group relative rounded-lg border transition-all duration-200 cursor-pointer p-4',
                    'hover:shadow-lg',
                    isSelected
                        ? isDark
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-blue-500 bg-blue-50'
                        : isDark
                            ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                            : 'border-gray-200 bg-white hover:border-gray-300',
                    className
                )}
                onClick={handleCardClick}
            >
                <div className="flex items-center gap-4">
                    {/* Checkbox de seleção */}
                    {isSelectionMode && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={handleSelectClick}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                    )}

                    {/* Ícone do PDF */}
                    <div className={twMerge(
                        'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                        isDark ? 'bg-red-900/20' : 'bg-red-50'
                    )}>
                        <FileText className={twMerge(
                            'w-6 h-6',
                            isDark ? 'text-red-400' : 'text-red-500'
                        )} />
                    </div>

                    {/* Informações do arquivo */}
                    <div className="flex-1 min-w-0">
                        <h3 className={twMerge(
                            'font-medium text-sm line-clamp-1 mb-1',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            {pdf.title}
                        </h3>
                        <p className={twMerge(
                            'text-xs line-clamp-1 mb-2',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            {pdf.description || pdf.fileName}
                        </p>
                        <div className={twMerge(
                            'flex items-center gap-4 text-xs',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        )}>
                            <span className="flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                {pdf.size}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(pdf.uploadDate)}
                            </span>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleViewClick}
                            className={twMerge(
                                'p-2 rounded-lg transition-colors',
                                isDark
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                            )}
                            title="Visualizar"
                        >
                            <Eye className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleDownloadClick}
                            className={twMerge(
                                'p-2 rounded-lg transition-colors',
                                isDark
                                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                            )}
                            title="Download"
                        >
                            <Download className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleDeleteClick}
                            className={twMerge(
                                'p-2 rounded-lg transition-colors',
                                isDark
                                    ? 'hover:bg-red-900/20 text-gray-400 hover:text-red-400'
                                    : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                            )}
                            title="Excluir"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Visualização em Grid
    return (
        <div
            className={twMerge(
                'group relative rounded-lg border transition-all duration-200 cursor-pointer p-6',
                'hover:shadow-lg',
                isSelected
                    ? isDark
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-blue-500 bg-blue-50'
                    : isDark
                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        : 'border-gray-200 bg-white hover:border-gray-300',
                className
            )}
            onClick={handleCardClick}
        >
            {/* Checkbox de seleção */}
            {isSelectionMode && (
                <div className="absolute top-3 left-3 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleSelectClick}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                </div>
            )}

            <div className="text-center space-y-4">
                {/* Ícone do PDF */}
                <div className={twMerge(
                    'w-16 h-16 mx-auto rounded-lg flex items-center justify-center',
                    isDark ? 'bg-red-900/20' : 'bg-red-50'
                )}>
                    <FileText className={twMerge(
                        'w-8 h-8',
                        isDark ? 'text-red-400' : 'text-red-500'
                    )} />
                </div>

                {/* Informações do arquivo */}
                <div>
                    <h3 className={twMerge(
                        'font-medium text-sm line-clamp-2 mb-2',
                        isDark ? 'text-white' : 'text-gray-900'
                    )}>
                        {pdf.title}
                    </h3>
                    <p className={twMerge(
                        'text-xs line-clamp-2 mb-2',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                        {pdf.description || pdf.fileName}
                    </p>
                    <div className={twMerge(
                        'text-xs space-y-1',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                        <p className="flex items-center justify-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {pdf.size}
                        </p>
                        <p className="flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(pdf.uploadDate)}
                        </p>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleViewClick}
                        className={twMerge(
                            'p-2 rounded-lg transition-colors',
                            isDark
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                        )}
                        title="Visualizar"
                    >
                        <Eye className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleDownloadClick}
                        className={twMerge(
                            'p-2 rounded-lg transition-colors',
                            isDark
                                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                        )}
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleDeleteClick}
                        className={twMerge(
                            'p-2 rounded-lg transition-colors',
                            isDark
                                ? 'hover:bg-red-900/20 text-gray-400 hover:text-red-400'
                                : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                        )}
                        title="Excluir"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
