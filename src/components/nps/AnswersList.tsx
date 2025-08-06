'use client'

import React, { useState } from 'react'

interface RatingData {
    id: string
    cliente: string
    medico: string
    unidade: string
    nota: number
    comentario: string
    dataResposta: string
}

const AnswersList: React.FC = () => {
    const [ isLoading ] = useState(false)

    // Dados mockados para demonstração
    const mockData: RatingData[] = [
        {
            id: '1',
            cliente: 'João Silva',
            medico: 'Dr. Carlos Santos',
            unidade: 'Clínica Central',
            nota: 9,
            comentario: 'Excelente atendimento, muito profissional.',
            dataResposta: '2025-01-15'
        },
        {
            id: '2',
            cliente: 'Maria Oliveira',
            medico: 'Dra. Ana Costa',
            unidade: 'Unidade Norte',
            nota: 8,
            comentario: 'Ótima experiência, recomendo.',
            dataResposta: '2025-01-14'
        },
        {
            id: '3',
            cliente: 'Pedro Santos',
            medico: 'Dr. João Silva',
            unidade: 'Clínica Sul',
            nota: 10,
            comentario: 'Perfeito! Muito atencioso.',
            dataResposta: '2025-01-13'
        }
    ]

    const getNotaBadge = (nota: number) => {
        if (nota >= 9) return 'bg-green-100 text-green-800'
        if (nota >= 7) return 'bg-yellow-100 text-yellow-800'
        return 'bg-red-100 text-red-800'
    }

    return (
        <div className="p-6 bg-gray-800 text-white min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Lista de Respostas NPS</h1>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Data Início</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Data Fim</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Unidade</label>
                        <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Todas as unidades</option>
                            <option value="central">Clínica Central</option>
                            <option value="norte">Unidade Norte</option>
                            <option value="sul">Clínica Sul</option>
                        </select>
                    </div>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200">
                    Filtrar Resultados
                </button>
            </div>

            {/* Tabela */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Carregando...</span>
                </div>
            ) : (
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Médico
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Unidade
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Nota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {mockData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-600 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{item.cliente}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{item.medico}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{item.unidade}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotaBadge(item.nota)}`}>
                                                {item.nota}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {new Date(item.dataResposta).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                Ver
                                            </button>
                                            <button className="text-green-400 hover:text-green-300">
                                                Responder
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    <div className="bg-gray-600 px-4 py-3 flex items-center justify-between border-t border-gray-500">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-500 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                                Anterior
                            </button>
                            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-500 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                                Próximo
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-300">
                                    Mostrando <span className="font-medium">1</span> até <span className="font-medium">3</span> de{' '}
                                    <span className="font-medium">3</span> resultados
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-500 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600">
                                        <span className="sr-only">Anterior</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-500 bg-blue-600 text-sm font-medium text-white">
                                        1
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-500 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600">
                                        <span className="sr-only">Próximo</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnswersList
