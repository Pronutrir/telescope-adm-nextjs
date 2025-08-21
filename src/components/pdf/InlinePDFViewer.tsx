'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { twMerge } from 'tailwind-merge'

interface InlinePDFViewerProps {
    pdfBase64: string
    className?: string
    height?: string
    fileName?: string
    fullScreen?: boolean
    onClose?: () => void
    onEdit?: () => void  // Nova prop para callback de edição
}

export default function InlinePDFViewer({
    pdfBase64,
    className = '',
    height = '600px',
    fileName = 'documento.pdf',
    fullScreen = false,
    onClose,
    onEdit
}: InlinePDFViewerProps) {
    const { isDark } = useTheme()
    const [ isClient, setIsClient ] = useState(false)
    const [ showFallback, setShowFallback ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isFullScreen, setIsFullScreen ] = useState(fullScreen)

    useEffect(() => {
        setIsClient(true)

        // Timeout para mostrar fallback se o PDF não carregar
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    const handleIframeError = () => {
        console.warn('⚠️ Iframe falhou, mostrando fallback')
        setShowFallback(true)
        setIsLoading(false)
    }

    const handleIframeLoad = () => {
        console.log('✅ PDF carregado no iframe')
        setIsLoading(false)
    }

    const downloadPDF = () => {
        if (!pdfBase64) return

        try {
            const link = document.createElement('a')
            link.href = pdfBase64
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Erro ao baixar PDF:', error)
        }
    }

    const openInNewWindow = () => {
        if (!pdfBase64) return
        window.open(pdfBase64, '_blank')
    }

    if (!isClient) {
        return (
            <div className={`${className} flex items-center justify-center`} style={{ height }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!pdfBase64) {
        return (
            <div className={`${className} text-center p-8 border border-red-300 rounded-lg bg-red-50`}>
                <div className="text-red-500">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="font-semibold">PDF não disponível</p>
                </div>
            </div>
        )
    }

    const containerClasses = isFullScreen || height === '100%'
        ? twMerge(
            `${className} w-full h-full`,
            isDark ? 'bg-gray-900' : 'bg-white'
        )
        : twMerge(
            `${className} border rounded-lg overflow-hidden shadow-lg`,
            isDark
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-300 bg-white'
        )

    const viewportHeight = isFullScreen || height === '100%'
        ? '95vh' // 95% da viewport height para modal full - deixa espaço para visualizar melhor
        : `calc(${height} + 20px)` // Adiciona 20px extra para garantir visualização completa

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen)
    }

    return (
        <div className={containerClasses}>
            <div className={twMerge(
                'px-4 py-3 border-b flex justify-between items-center',
                isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-100 border-gray-200'
            )}>
                <div className="flex items-center gap-2">
                    <svg className={twMerge(
                        'w-5 h-5',
                        isDark ? 'text-red-400' : 'text-red-600'
                    )} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <span className={twMerge(
                        'font-medium',
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    )}>{fileName}</span>
                    <span className={twMerge(
                        'text-xs',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>({Math.round(pdfBase64.length / 1024)} KB)</span>
                </div>

                <div className="flex gap-2">
                    {/* Botão de Editar - apenas se onEdit foi fornecido */}
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className={twMerge(
                                'px-3 py-1 text-sm rounded transition-colors flex items-center gap-1',
                                isDark
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            )}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (onClose) {
                                onClose()
                            } else {
                                setIsFullScreen(false)
                            }
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Fechar
                    </button>
                </div>
            </div>

            {/* Área do PDF */}
            <div className={twMerge(
                'relative',
                isDark ? 'bg-gray-900' : 'bg-gray-100'
            )} style={{ height: viewportHeight }}>
                {isLoading && (
                    <div className={twMerge(
                        'absolute inset-0 flex items-center justify-center z-10',
                        isDark ? 'bg-gray-900' : 'bg-gray-50'
                    )}>
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            )}>Carregando PDF...</p>
                        </div>
                    </div>
                )}

                {!showFallback ? (
                    <div className="w-full h-full overflow-auto">
                        <iframe
                            src={pdfBase64}
                            title={fileName}
                            className="w-full border-none"
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            style={{
                                display: isLoading ? 'none' : 'block',
                                background: isDark ? '#1f2937' : '#f9fafb',
                                height: isFullScreen || height === '100%' ? '95vh' : 'max(100%, 800px)', // 95vh para modal
                                minHeight: '100%'
                            }}
                            allow="fullscreen"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className={twMerge(
                        'flex items-center justify-center h-full',
                        isDark ? 'bg-gray-900' : 'bg-gray-50'
                    )}>
                        <div className="text-center p-8">
                            <svg className={twMerge(
                                'w-16 h-16 mx-auto mb-4',
                                isDark ? 'text-gray-500' : 'text-gray-400'
                            )} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <h3 className={twMerge(
                                'text-lg font-semibold mb-2',
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            )}>
                                Visualização não suportada
                            </h3>
                            <p className={twMerge(
                                'text-sm mb-4',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                Seu navegador não conseguiu exibir o PDF inline
                            </p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={openInNewWindow}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Abrir em Nova Janela
                                </button>
                                <button
                                    onClick={downloadPDF}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Rodapé com informações - apenas quando não estiver em tela cheia */}
            {!isFullScreen && (
                <div className={twMerge(
                    'px-4 py-2 border-t',
                    isDark
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                )}>
                    <p className={twMerge(
                        'text-xs text-center',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                        💡 Se o PDF não carregar corretamente, use os botões "Nova Janela" ou "Download"
                    </p>
                </div>
            )}
        </div>
    )
}
