'use client'

import { useState, useEffect } from 'react'

interface WorkingPDFViewerProps {
    pdfBase64: string
    className?: string
    onClose?: () => void
}

export default function WorkingPDFViewer({ pdfBase64, className = '', onClose }: WorkingPDFViewerProps) {
    const [ isClient, setIsClient ] = useState(false)
    const [ showFullscreen, setShowFullscreen ] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const openFullscreen = () => {
        setShowFullscreen(true)
    }

    const closeFullscreen = () => {
        setShowFullscreen(false)
    }

    const openInNewWindow = () => {
        if (pdfBase64) {
            const newWindow = window.open('', '_blank', 'width=1024,height=768')
            if (newWindow) {
                newWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Visualizar PDF</title>
                        <style>
                            body { 
                                margin: 0; 
                                padding: 0; 
                                background: #f0f0f0;
                                font-family: Arial, sans-serif;
                            }
                            .container {
                                display: flex;
                                flex-direction: column;
                                height: 100vh;
                            }
                            .toolbar {
                                background: #333;
                                color: white;
                                padding: 10px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            }
                            .pdf-viewer {
                                flex: 1;
                                background: white;
                            }
                            iframe {
                                width: 100%;
                                height: 100%;
                                border: none;
                            }
                            button {
                                background: #007bff;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 4px;
                                cursor: pointer;
                            }
                            button:hover {
                                background: #0056b3;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="toolbar">
                                <div>📄 Visualizador de PDF</div>
                                <button onclick="window.close()">✕ Fechar</button>
                            </div>
                            <div class="pdf-viewer">
                                <iframe src="${pdfBase64}" title="PDF Viewer"></iframe>
                            </div>
                        </div>
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
        return <div className="text-center py-4">Carregando visualizador...</div>
    }

    return (
        <>
            {/* Visualizador compacto */}
            <div className={`${className} space-y-4`}>
                {/* Preview pequeno ou mensagem */}
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div className="p-4 text-center">
                        <div className="text-6xl mb-2">📄</div>
                        <h3 className="font-semibold text-gray-800 mb-2">PDF Pronto para Visualização</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Documento carregado com sucesso • {Math.round(pdfBase64.length / 1024)} KB
                        </p>

                        {/* Botões de ação */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={openFullscreen}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                🔍 Visualizar
                            </button>
                            <button
                                onClick={openInNewWindow}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                                🖥️ Nova Janela
                            </button>
                            <button
                                onClick={downloadPDF}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                            >
                                💾 Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Fullscreen */}
            {showFullscreen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
                        {/* Header do modal */}
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
                            <h2 className="text-lg font-semibold text-gray-800">📄 Visualizador de PDF</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={openInNewWindow}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    🖥️ Nova Janela
                                </button>
                                <button
                                    onClick={downloadPDF}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                    💾 Download
                                </button>
                                <button
                                    onClick={closeFullscreen}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                >
                                    ✕ Fechar
                                </button>
                            </div>
                        </div>

                        {/* Conteúdo do PDF */}
                        <div className="flex-1 p-4">
                            <iframe
                                src={pdfBase64}
                                className="w-full h-full border rounded"
                                title="PDF Viewer"
                                onLoad={() => console.log('✅ PDF iframe carregado no modal')}
                                onError={(e) => {
                                    console.error('❌ Erro no iframe do modal:', e)
                                    // Se falhar, mostrar botões alternativos
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
