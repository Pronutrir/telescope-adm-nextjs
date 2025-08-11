'use client'

import React from 'react'
import { PageWrapper } from '@/components/layout'
import AcompanhantesListagem from '@/components/acompanhantes/AcompanhantesListagem'
export default function AcompanhantesPage() {
    return (
        <PageWrapper maxWidth="full" spacing="xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                        Acompanhantes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
                        Controle e gerenciamento de visitantes e acompanhantes
                    </p>
                </div>
                {/* Listagem Principal */}
                <AcompanhantesListagem />
            </div>
        </PageWrapper>
    )
}
