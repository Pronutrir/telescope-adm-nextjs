'use client'

import React, { useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { PDFItem } from '@/types/pdf'
import {
    X,
    Download,
    ExternalLink,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Maximize2,
    FileText,
    Calendar,
    HardDrive,
    Loader2
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface PDFViewerModalProps {
    isOpen: boolean
    pdf: PDFItem | null
    pdfBase64: string | null
    isLoading: boolean
    error?: string
    onClose: () => void
    onDownload?: (pdf: PDFItem) => void
    onOpenExternal?: (pdf: PDFItem) => void
    className?: string
}

/**
 * Modal para visualização de PDFs
 * Inclui preview, zoom, rotação e ações
 */
export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
    isOpen,
    pdf,
    pdfBase64,
    isLoading,
    error,
    onClose,
    onDownload,
    onOpenExternal,
    className
}) => {
    const { isDark } = useTheme()
    const modalRef = useRef<HTMLDivElement>(null)
    const [ zoom, setZoom ] = React.useState(100)
    const [ rotation, setRotation ] = React.useState(0)

    // Fechar modal com ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [ isOpen, onClose ])

    // Fechar ao clicar fora
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === modalRef.current) {
            onClose()
        }
    }

    // Handlers de zoom
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 300))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 25))
    }

    const handleResetZoom = () => {
        setZoom(100)
        setRotation(0)
    }

    // Handler de rotação
    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360)
    }

    // Formatar tamanho do arquivo
    const formatFileSize = (sizeStr: string) => {
        const size = parseFloat(sizeStr)
        if (size < 1024) return `${size.toFixed(1)} KB`
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} MB`
        return `${(size / (1024 * 1024)).toFixed(1)} GB`
    }

    // Formatar data
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateStr
        }
    }

    if (!isOpen) return null

    return (
        <div
            ref={modalRef}
            onClick={handleBackdropClick}
            className={twMerge(
                'fixed inset-0 z-50 flex items-center justify-center p-4',
                'bg-black/80 backdrop-blur-sm',
                className
            )}
        >
            <div
                className={twMerge(
                    'w-full max-w-6xl h-full max-h-[90vh] rounded-xl shadow-2xl overflow-hidden',
                    'flex flex-col',
                    isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={twMerge(
                    'flex items-center justify-between p-4 border-b',
                    isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                )}>
                    <div className="flex-1 min-w-0">
                        <h2 className={twMerge(
                            'text-lg font-semibold truncate',
                            isDark ? 'text-white' : 'text-gray-900'
                        )}>
                            {pdf?.title || 'Visualizar PDF'}
                        </h2>
                        {pdf && (
                            <div className="flex items-center gap-4 mt-1 text-sm">
                                <span className={twMerge(
                                    'flex items-center gap-1',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                    <FileText className="w-4 h-4" />
                                    {pdf.fileName}
                                </span>
                                <span className={twMerge(
                                    'flex items-center gap-1',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                    <HardDrive className="w-4 h-4" />
                                    {formatFileSize(pdf.size)}
                                </span>
                                <span className={twMerge(
                                    'flex items-center gap-1',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(pdf.uploadDate)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Controles do header */}
                    <div className="flex items-center gap-2 ml-4">
                        {/* Zoom out */}
                        <button
                            onClick={handleZoomOut}
                            disabled={zoom <= 25}
                            className={twMerge(
                                'p-2 rounded-lg transition-colors',
                                zoom <= 25
                                    ? 'opacity-50 cursor-not-allowed'
                                    : isDark
                                        ? 'hover:bg-gray-700 text-gray-300'
                                        : 'hover:bg-gray-200 text-gray-600'
                            )}
                            title="Diminuir zoom"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>

                        {/* Indicador de zoom */}
                        <span className={twMerge(
                            'px-3 py-1 rounded text-sm font-medium',
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        )}>
                            {zoom}%
                        </span>

                        {/* Zoom in */}
                        <button
                            onClick={handleZoomIn}
                            disabled={zoom >= 300}
                            className={twMerge(
                                'p-2 rounded-lg transition-colors',
                                zoom >= 300
                                    ? 'opacity-50 cursor-not-allowed'
                                    : isDark
                                        ? 'hover:bg-gray-700 text-gray-300'
                                        : 'hover:bg-gray-200 text-gray-600'
                            )}
                            title="Aumentar zoom"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>

                        {/* Reset zoom */}
                        <button
                            onClick={handleResetZoom}
                            className={twMerge(
                                'p-2 rounded-lg transition-colors',
                                isDark
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-200 text-gray-600'
                            )}
                            title="Resetar zoom"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>

                        {/* Rotacionar */}
                        <button
                            onClick={handleRotate}
                            className={twMerge(
                                'p-2 rounded-lg transition-colors',
                                isDark
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-200 text-gray-600'
                            )}
                            title="Rotacionar"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>

                        <div className={twMerge(
                            'w-px h-6 mx-2',
                            isDark ? 'bg-gray-600' : 'bg-gray-300'
                        )} />

                        {/* Download */}
                        {pdf && onDownload && (
                            <button
                                onClick={() => onDownload(pdf)}
                                className={twMerge(
                                    'p-2 rounded-lg transition-colors',
                                    isDark
                                        ? 'hover:bg-gray-700 text-gray-300 hover:text-blue-400'
                                        : 'hover:bg-gray-200 text-gray-600 hover:text-blue-600'
                                )}
                                title="Baixar PDF"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        )}

                        {/* Abrir externamente */}
                        {pdf && onOpenExternal && (
                            <button
                                onClick={() => onOpenExternal(pdf)}
                                className={twMerge(
                                    'p-2 rounded-lg transition-colors',
                                    isDark
                                        ? 'hover:bg-gray-700 text-gray-300 hover:text-blue-400'
                                        : 'hover:bg-gray-200 text-gray-600 hover:text-blue-600'
                                )}
                                title="Abrir em nova aba"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        )}

                        {/* Fechar */}
                        <button
                            onClick={onClose}
                            className={twMerge(
                                'p-2 rounded-lg transition-colors',
                                isDark
                                    ? 'hover:bg-gray-700 text-gray-300 hover:text-red-400'
                                    : 'hover:bg-gray-200 text-gray-600 hover:text-red-600'
                            )}
                            title="Fechar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 overflow-hidden">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <Loader2 className={twMerge(
                                    'w-8 h-8 animate-spin mx-auto mb-4',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )} />
                                <p className={twMerge(
                                    'text-lg font-medium',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Carregando PDF...
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-md mx-auto p-6">
                                <div className={twMerge(
                                    'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                                    isDark ? 'bg-red-900/20' : 'bg-red-50'
                                )}>
                                    <FileText className={twMerge(
                                        'w-8 h-8',
                                        isDark ? 'text-red-400' : 'text-red-500'
                                    )} />
                                </div>
                                <h3 className={twMerge(
                                    'text-lg font-medium mb-2',
                                    isDark ? 'text-white' : 'text-gray-900'
                                )}>
                                    Erro ao carregar PDF
                                </h3>
                                <p className={twMerge(
                                    'text-sm',
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                )}>
                                    {error}
                                </p>
                            </div>
                        </div>
                    ) : pdfBase64 ? (
                        <div className="h-full overflow-auto">
                            <div className="flex justify-center p-4">
                                <div
                                    className="transition-all duration-200"
                                    style={{
                                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                                        transformOrigin: 'center'
                                    }}
                                >
                                    <iframe
                                        src={`data:application/pdf;base64,${pdfBase64}`}
                                        className="border-0 shadow-lg"
                                        style={{
                                            width: '800px',
                                            height: '600px',
                                            minHeight: '600px'
                                        }}
                                        title={pdf?.title || 'PDF Preview'}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <FileText className={twMerge(
                                    'w-16 h-16 mx-auto mb-4',
                                    isDark ? 'text-gray-600' : 'text-gray-400'
                                )} />
                                <p className={twMerge(
                                    'text-lg font-medium',
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                )}>
                                    Nenhum PDF selecionado
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer com descrição */}
                {pdf?.description && (
                    <div className={twMerge(
                        'p-4 border-t',
                        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    )}>
                        <h4 className={twMerge(
                            'text-sm font-medium mb-2',
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Descrição
                        </h4>
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            {pdf.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
