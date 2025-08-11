'use client'

import React from 'react'
import { PageWrapper } from '@/components/layout'

export default function ExamplesDashboard() {
    return (
        <PageWrapper maxWidth="full" spacing="xl">
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Dashboard Examples
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Exemplos de componentes de dashboard
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Exemplo 1</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Descrição do exemplo de dashboard
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Exemplo 2</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Outro exemplo de componente
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Exemplo 3</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Mais um exemplo de dashboard
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}