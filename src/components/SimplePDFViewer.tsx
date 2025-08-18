'use client'

import { useState, useEffect } from 'react'

interface SimplePDFViewerProps {
    pdfBase64: string
    className?: string
}

export default function SimplePDFViewer({ pdfBase64, className = '' }: SimplePDFViewerProps) {
    const [ isClient, setIsClient ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleIframeError = () => {
        setError('Não foi possível carregar o PDF no navegador')
    }

    const openInNewTab = () => {
        if (pdfBase64) {
            const newWindow = window.open()
            if (newWindow) {
                newWindow.document.write(`
          <html>
            <head>
              <title>Visualizar PDF</title>
              <style>
                body { margin: 0; padding: 0; }
                iframe { width: 100vw; height: 100vh; border: none; }
              </style>
            </head>
            <body>
              <iframe src="${pdfBase64}" title="PDF Viewer"></iframe>
            </body>
          </html>
        `)
                newWindow.document.close()
            }
        }
    }

    const downloadPDF = () => {
        if (pdfBase64) {
            const link = document.createElement('a')
            link.href = pdfBase64
            link.download = 'documento.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    if (!isClient) {
        return (
            <div className={`flex items-center justify-center h-96 ${className}`}>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-500">Carregando visualizador...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`${className} border rounded p-6`}>
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm">{error}</p>
                    </div>

                    <div className="space-x-2">
                        <button
                            onClick={openInNewTab}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            📄 Abrir em Nova Aba
                        </button>
                        <button
                            onClick={downloadPDF}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            💾 Download
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`${className} space-y-4`}>
            {/* Controles */}
            <div className="flex justify-center space-x-2">
                <button
                    onClick={openInNewTab}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                    🔍 Abrir em Tela Cheia
                </button>
                <button
                    onClick={downloadPDF}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                >
                    💾 Download
                </button>
            </div>

            {/* Visualizador */}
            <div className="border rounded overflow-hidden">
                <iframe
                    src={pdfBase64}
                    className="w-full h-96"
                    title="Visualizar PDF"
                    onError={handleIframeError}
                    style={{ minHeight: '400px' }}
                />
            </div>

            <div className="text-center text-sm text-gray-500">
                💡 Se o PDF não carregar, clique em "Abrir em Tela Cheia" ou faça o download
            </div>
        </div>
    )
}
