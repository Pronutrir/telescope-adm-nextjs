/**
 * Página de teste para debugging da integração UserShield
 */
'use client'

import { useState } from 'react'

export default function TestUserShieldPage() {
    const [ result, setResult ] = useState<any>(null)
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)

    const testAPI = async () => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            console.log('🧪 Testando API UserShield...')

            const response = await fetch('/api/usershield/usuarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            console.log('📊 Response status:', response.status)
            console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()))

            const data = await response.json()
            console.log('📊 Response data:', data)

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${data.error || 'Unknown error'}`)
            }

            setResult(data)
        } catch (err) {
            console.error('❌ Erro no teste:', err)
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">🧪 Teste UserShield API</h1>

            <button
                onClick={testAPI}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-6"
            >
                {loading ? '⏳ Testando...' : '🚀 Testar API'}
            </button>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>❌ Erro:</strong> {error}
                </div>
            )}

            {result && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <strong>✅ Sucesso!</strong>
                    <pre className="mt-2 text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold mb-2">📋 Configurações:</h2>
                <p><strong>NEXT_PUBLIC_USERSHIELD_URL:</strong> {process.env.NEXT_PUBLIC_USERSHIELD_URL || 'Não definida'}</p>
                <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
            </div>
        </div>
    )
}
