'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Configurar PDF.js worker apenas no cliente
const configurePDFJS = () => {
    if (typeof window !== 'undefined') {
        const pdfjs = require('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        return pdfjs
    }
    return null
}

// Importar React PDF apenas no cliente
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
    )
})

const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), {
    ssr: false
})

interface PDFViewerProps {
    pdfBase64: string
    className?: string
}

export default function PDFViewer({ pdfBase64, className = '' }: PDFViewerProps) {
    const [ numPages, setNumPages ] = useState<number>(0)
    const [ pageNumber, setPageNumber ] = useState<number>(1)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ error, setError ] = useState<string | null>(null)
    const [ isClient, setIsClient ] = useState(false)
    const [ pdfjs, setPdfjs ] = useState<any>(null)

    // Configurar PDF.js apenas no cliente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true)
            const pdfjsLib = configurePDFJS()
            setPdfjs(pdfjsLib)
        }
    }, [])

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
        setLoading(false)
        setError(null)
    }, [])

    const onDocumentLoadError = useCallback((error: Error) => {
        console.error('Erro ao carregar PDF:', error)
        setError('Erro ao carregar o documento PDF')
        setLoading(false)
    }, [])

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1))
    }

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages))
    }

    // Não renderizar no servidor
    if (!isClient || !pdfjs) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-500">Preparando visualizador...</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-500">Carregando PDF...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
                <div className="text-center text-red-500">
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => window.open(pdfBase64, '_blank')}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Abrir em nova aba
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={`pdf-viewer ${className}`}>
            {/* Controles de navegação */}
            {numPages > 1 && (
                <div className="flex items-center justify-between mb-4 p-2 bg-gray-100 rounded">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        ← Anterior
                    </button>

                    <span className="text-sm font-medium">
                        Página {pageNumber} de {numPages}
                    </span>

                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                    >
                        Próxima →
                    </button>
                </div>
            )}

            {/* Documento PDF */}
            <div className="border rounded overflow-auto max-h-96">
                <Document
                    file={pdfBase64}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                    }
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="mx-auto"
                        width={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.8, 800) : 800}
                    />
                </Document>
            </div>

            {/* Botão para abrir em nova aba */}
            <div className="mt-4 text-center">
                <button
                    onClick={() => window.open(pdfBase64, '_blank')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    📄 Abrir em nova aba
                </button>
            </div>
        </div>
    )
}
