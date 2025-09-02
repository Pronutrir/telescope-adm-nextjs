'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { useTheme } from '@/contexts/ThemeContext'

const BibliotecaPDFsUnificadosPage = () => {
    const router = useRouter()
    const { isDark } = useTheme()

    return (
        <PageWrapper maxWidth="full" spacing="xl">
            <div className="w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Button
                            onClick={() => router.back()}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </div>

                    <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        📚 Biblioteca de PDFs Unificados
                    </h1>

                    <div className="text-center py-12">
                        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                            Esta página está temporariamente em manutenção.
                        </p>
                        <p className={`text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Use o Gerenciador de PDFs → PDFs Unificados para acessar a funcionalidade completa.
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default BibliotecaPDFsUnificadosPage
