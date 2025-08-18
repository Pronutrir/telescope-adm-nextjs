'use client'

import { useState } from 'react'
import InlinePDFViewer from '@/components/pdf/InlinePDFViewer'
import DirectPDFViewer from '@/components/DirectPDFViewer'
import { PDFService } from '@/services/pdf/pdfService'

export default function TestPDFPage() {
    const [ pdfData, setPdfData ] = useState<string>('')
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState<string>('')
    const [ viewMode, setViewMode ] = useState<'inline' | 'card'>('inline')

    const testPDF = async () => {
        setLoading(true)
        setError('')

        try {
            console.log('🧪 Testando PDF Service...')

            // Lista PDFs primeiro
            const pdfs = await PDFService.listPDFs()
            console.log('📋 PDFs encontrados:', pdfs)

            if (pdfs.length > 0) {
                const firstPdf = pdfs[ 0 ]
                console.log('📄 Carregando primeiro PDF:', firstPdf.fileName)

                const base64 = await PDFService.viewPDF(firstPdf.id)
                console.log('✅ PDF carregado! Base64 length:', base64.length)

                setPdfData(base64)
            } else {
                setError('Nenhum PDF encontrado na API')
            }

        } catch (err) {
            console.error('❌ Erro ao testar PDF:', err)
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">🧪 Teste do PDF Service</h1>

                {/* Links para as páginas principais */}
                <div className="flex gap-2">
                    <a
                        href="/admin/biblioteca-pdfs"
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                        📚 Biblioteca PDFs
                    </a>
                    <a
                        href="/admin/biblioteca-pdfs/unificados"
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                        🔗 PDFs Unificados
                    </a>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={testPDF}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? '⏳ Carregando...' : '🔄 Testar PDF'}
                </button>

                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        ❌ Erro: {error}
                    </div>
                )}

                {pdfData && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">✅ PDF Carregado!</h2>

                            {/* Toggle para modo de visualização */}
                            <div className="flex bg-gray-200 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('inline')}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'inline'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-300'
                                        }`}
                                >
                                    📄 Visualização Inline + Tela Cheia
                                </button>
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'card'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-300'
                                        }`}
                                >
                                    🃏 Card com Botões
                                </button>
                            </div>
                        </div>

                        {/* Visualizador baseado no modo selecionado */}
                        {viewMode === 'inline' ? (
                            <InlinePDFViewer
                                pdfBase64={pdfData}
                                fileName="teste.pdf"
                                height="calc(100vh - 300px)"
                                className="w-full"
                            />
                        ) : (
                            <DirectPDFViewer
                                pdfBase64={pdfData}
                                fileName="teste.pdf"
                                className="max-w-2xl"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
