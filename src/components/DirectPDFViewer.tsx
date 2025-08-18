'use client'

import { useState } from 'react'

interface DirectPDFViewerProps {
    pdfBase64: string
    fileName?: string
    className?: string
}

export default function DirectPDFViewer({ pdfBase64, fileName = 'documento.pdf', className = '' }: DirectPDFViewerProps) {
    const [ isOpening, setIsOpening ] = useState(false)

    const openPDFWindow = () => {
        if (!pdfBase64) return

        setIsOpening(true)

        try {
            // Criar uma nova janela/aba com o PDF
            const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')

            if (newWindow) {
                // HTML mais limpo e focado no PDF
                newWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${fileName} - Visualizador PDF</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                            }
                            
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                background: #f5f5f5;
                                overflow: hidden;
                            }
                            
                            .header {
                                background: #2563eb;
                                color: white;
                                padding: 12px 20px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                position: relative;
                                z-index: 10;
                            }
                            
                            .title {
                                font-size: 16px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            }
                            
                            .actions {
                                display: flex;
                                gap: 8px;
                            }
                            
                            .btn {
                                background: rgba(255,255,255,0.2);
                                color: white;
                                border: 1px solid rgba(255,255,255,0.3);
                                padding: 6px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 14px;
                                transition: all 0.2s;
                                display: flex;
                                align-items: center;
                                gap: 4px;
                            }
                            
                            .btn:hover {
                                background: rgba(255,255,255,0.3);
                                border-color: rgba(255,255,255,0.5);
                            }
                            
                            .btn-close {
                                background: #dc2626;
                                border-color: #b91c1c;
                            }
                            
                            .btn-close:hover {
                                background: #b91c1c;
                            }
                            
                            .pdf-container {
                                height: calc(100vh - 60px);
                                background: white;
                                position: relative;
                            }
                            
                            iframe {
                                width: 100%;
                                height: 100%;
                                border: none;
                                background: white;
                            }
                            
                            .loading {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                text-align: center;
                                color: #666;
                            }
                            
                            .loading-spinner {
                                width: 40px;
                                height: 40px;
                                border: 3px solid #f3f3f3;
                                border-top: 3px solid #2563eb;
                                border-radius: 50%;
                                animation: spin 1s linear infinite;
                                margin: 0 auto 16px;
                            }
                            
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                            
                            .error {
                                background: #fef2f2;
                                border: 1px solid #fecaca;
                                color: #dc2626;
                                padding: 16px;
                                border-radius: 8px;
                                margin: 20px;
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div class="title">
                                📄 ${fileName}
                            </div>
                            <div class="actions">
                                <button class="btn" onclick="downloadPDF()">
                                    💾 Download
                                </button>
                                <button class="btn" onclick="printPDF()">
                                    🖨️ Imprimir
                                </button>
                                <button class="btn btn-close" onclick="window.close()">
                                    ✕ Fechar
                                </button>
                            </div>
                        </div>
                        
                        <div class="pdf-container">
                            <div class="loading" id="loading">
                                <div class="loading-spinner"></div>
                                <p>Carregando documento...</p>
                            </div>
                            
                            <iframe 
                                src="${pdfBase64}" 
                                title="PDF Viewer"
                                id="pdfFrame"
                                onload="hideLoading()"
                                onerror="showError()"
                            ></iframe>
                        </div>
                        
                        <script>
                            function hideLoading() {
                                const loading = document.getElementById('loading');
                                if (loading) {
                                    loading.style.display = 'none';
                                }
                            }
                            
                            function showError() {
                                const container = document.querySelector('.pdf-container');
                                container.innerHTML = \`
                                    <div class="error">
                                        <h3>❌ Erro ao carregar PDF</h3>
                                        <p>Não foi possível exibir o documento no navegador.</p>
                                        <br>
                                        <button class="btn" onclick="downloadPDF()" style="color: #dc2626; background: white;">
                                            💾 Baixar arquivo
                                        </button>
                                    </div>
                                \`;
                            }
                            
                            function downloadPDF() {
                                const link = document.createElement('a');
                                link.href = '${pdfBase64}';
                                link.download = '${fileName}';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                            
                            function printPDF() {
                                window.print();
                            }
                            
                            // Remove loading após 5 segundos se não carregar
                            setTimeout(() => {
                                const loading = document.getElementById('loading');
                                if (loading && loading.style.display !== 'none') {
                                    showError();
                                }
                            }, 5000);
                        </script>
                    </body>
                    </html>
                `)
                newWindow.document.close()
            } else {
                // Fallback se popup for bloqueado
                downloadPDF()
            }
        } catch (error) {
            console.error('Erro ao abrir PDF:', error)
            downloadPDF()
        } finally {
            setIsOpening(false)
        }
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

    return (
        <div className={`${className} space-y-4`}>
            {/* Preview Card */}
            <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="p-6 text-center">
                    {/* Icon */}
                    <div className="text-6xl mb-4">📄</div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                        PDF Pronto para Visualização
                    </h3>

                    {/* Info */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                        Arquivo: <span className="font-medium">{fileName}</span>
                        <br />
                        Tamanho: {Math.round(pdfBase64.length / 1024)} KB
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <button
                            onClick={openPDFWindow}
                            disabled={isOpening}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                        >
                            {isOpening ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Abrindo...
                                </>
                            ) : (
                                <>
                                    👁️ Ver PDF
                                </>
                            )}
                        </button>

                        <button
                            onClick={downloadPDF}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                        >
                            💾 Download
                        </button>
                    </div>

                    {/* Help text */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        💡 Dica: Se o PDF não abrir, verifique se o bloqueador de pop-ups está desabilitado
                    </p>
                </div>
            </div>
        </div>
    )
}
