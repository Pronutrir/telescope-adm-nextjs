'use client'

import { useState, useEffect } from 'react'

interface DebugPDFViewerProps {
    pdfBase64: string
    className?: string
}

export default function DebugPDFViewer({ pdfBase64, className = '' }: DebugPDFViewerProps) {
    const [ isClient, setIsClient ] = useState(false)
    const [ debugInfo, setDebugInfo ] = useState<any>({})

    useEffect(() => {
        setIsClient(true)

        // Debug do pdfBase64 recebido
        console.log('🔍 DEBUG PDFViewer - pdfBase64 recebido:', {
            exists: !!pdfBase64,
            length: pdfBase64?.length || 0,
            starts_with_data: pdfBase64?.startsWith('data:'),
            first_50_chars: pdfBase64?.substring(0, 50) || 'vazio'
        })

        setDebugInfo({
            exists: !!pdfBase64,
            length: pdfBase64?.length || 0,
            starts_with_data: pdfBase64?.startsWith('data:'),
            first_50_chars: pdfBase64?.substring(0, 50) || 'vazio',
            is_valid_data_url: pdfBase64?.startsWith('data:application/pdf;base64,')
        })
    }, [ pdfBase64 ])

    if (!isClient) {
        return <div>Carregando...</div>
    }

    return (
        <div className={`${className} space-y-4`}>
            {/* Debug Info */}
            <div className="bg-gray-100 p-4 rounded text-sm font-mono">
                <h3 className="font-bold mb-2">🔧 Debug Info:</h3>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            {/* Teste de diferentes abordagens */}
            <div className="space-y-4">
                {/* Abordagem 1: iframe direto */}
                <div>
                    <h4 className="font-semibold mb-2">📄 Teste 1: iframe direto</h4>
                    <div className="border rounded overflow-hidden">
                        <iframe
                            src={pdfBase64}
                            className="w-full h-64"
                            title="Teste iframe direto"
                            onLoad={() => console.log('✅ iframe direto carregou')}
                            onError={(e) => console.error('❌ iframe direto erro:', e)}
                        />
                    </div>
                </div>

                {/* Abordagem 2: embed */}
                <div>
                    <h4 className="font-semibold mb-2">📄 Teste 2: embed</h4>
                    <div className="border rounded overflow-hidden">
                        <embed
                            src={pdfBase64}
                            type="application/pdf"
                            className="w-full h-64"
                            title="Teste embed"
                        />
                    </div>
                </div>

                {/* Abordagem 3: object */}
                <div>
                    <h4 className="font-semibold mb-2">📄 Teste 3: object</h4>
                    <div className="border rounded overflow-hidden">
                        <object
                            data={pdfBase64}
                            type="application/pdf"
                            className="w-full h-64"
                            title="Teste object"
                        >
                            <p>Seu navegador não suporta PDFs incorporados.</p>
                        </object>
                    </div>
                </div>

                {/* Botões de teste */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            console.log('🧪 Testando abertura em nova aba...')
                            if (pdfBase64) {
                                const newWindow = window.open()
                                if (newWindow) {
                                    newWindow.location.href = pdfBase64
                                }
                            }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        🧪 Testar Nova Aba
                    </button>

                    <button
                        onClick={() => {
                            console.log('🧪 Testando download...')
                            if (pdfBase64) {
                                const link = document.createElement('a')
                                link.href = pdfBase64
                                link.download = 'teste.pdf'
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                            }
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        🧪 Testar Download
                    </button>
                </div>
            </div>
        </div>
    )
}
