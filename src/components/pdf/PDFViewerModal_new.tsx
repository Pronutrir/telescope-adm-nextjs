'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Modal } from '@/components/ui/Modal'
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
 * Agora usando o componente Modal unificado
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
    const [ zoom, setZoom ] = React.useState(100)
    const [ rotation, setRotation ] = React.useState(0)

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

    // Footer personalizado com ações
    const customFooter = pdf && (
        <div className="flex items-center justify-between w-full">
            {/* Controles de zoom e rotação */}
            <div className="flex items-center gap-2">
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

                <span className={twMerge(
                    'px-3 py-1 rounded text-sm font-medium',
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                )}>
                    {zoom}%
                </span>

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
            </div>

            {/* Ações do PDF */}
            <div className="flex items-center gap-2">
                {onDownload && (
                    <button
                        onClick={() => onDownload(pdf)}
                        className={twMerge(
                            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                            'bg-blue-600 hover:bg-blue-700 text-white'
                        )}
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                )}

                {onOpenExternal && (
                    <button
                        onClick={() => onOpenExternal(pdf)}
                        className={twMerge(
                            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                            isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        )}
                    >
                        <ExternalLink className="w-4 h-4" />
                        Abrir
                    </button>
                )}
            </div>
        </div>
    )

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={pdf?.title || 'Visualizar PDF'}
            size="full"
            animation="fade"
            className={className}
            footer={customFooter}
        >
            {/* Conteúdo do PDF */}
            {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className={twMerge(
                            'w-8 h-8 mx-auto mb-4 animate-spin',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )} />
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            Carregando PDF...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                        <X className={twMerge(
                            'w-16 h-16 mx-auto mb-4',
                            'text-red-500'
                        )} />
                        <p className={twMerge(
                            'text-lg font-medium mb-2',
                            isDark ? 'text-gray-300' : 'text-gray-700'
                        )}>
                            Erro ao carregar PDF
                        </p>
                        <p className={twMerge(
                            'text-sm',
                            isDark ? 'text-gray-400' : 'text-gray-600'
                        )}>
                            {error}
                        </p>
                    </div>
                </div>
            ) : pdfBase64 && pdf ? (
                <div className="h-full overflow-auto">
                    {/* Header com informações do arquivo */}
                    <div className={twMerge(
                        'p-4 mb-4 border-b',
                        isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
                    )}>
                        <div className="flex items-center gap-4 text-sm">
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
                    </div>

                    {/* Viewer do PDF */}
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
                                className="border-0 shadow-lg rounded-lg"
                                style={{
                                    width: '800px',
                                    height: '600px',
                                    minHeight: '600px'
                                }}
                                title={pdf?.title || 'PDF Preview'}
                            />
                        </div>
                    </div>

                    {/* Descrição do PDF */}
                    {pdf?.description && (
                        <div className={twMerge(
                            'p-4 mt-4 border-t',
                            isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
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
            ) : (
                <div className="h-96 flex items-center justify-center">
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
        </Modal>
    )
}
