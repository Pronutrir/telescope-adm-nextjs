'use client'

import React from 'react'

const AnswersDashboard: React.FC = () => {
    return (
        <div className="p-6 bg-gray-800 text-white min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">
                    Dashboard NPS - Consultas
                </h1>
                <p className="text-gray-300">
                    Visualize métricas e indicadores das pesquisas de satisfação
                </p>
            </div>

            {/* Cards de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-600 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium uppercase tracking-wide">
                                Promotores
                            </p>
                            <p className="text-3xl font-bold text-white">
                                65%
                            </p>
                        </div>
                        <div className="text-green-200 text-2xl">
                            😊
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-600 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium uppercase tracking-wide">
                                Neutros
                            </p>
                            <p className="text-3xl font-bold text-white">
                                25%
                            </p>
                        </div>
                        <div className="text-yellow-200 text-2xl">
                            😐
                        </div>
                    </div>
                </div>

                <div className="bg-red-600 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium uppercase tracking-wide">
                                Detratores
                            </p>
                            <p className="text-3xl font-bold text-white">
                                10%
                            </p>
                        </div>
                        <div className="text-red-200 text-2xl">
                            😞
                        </div>
                    </div>
                </div>

                <div className="bg-blue-600 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                                NPS Score
                            </p>
                            <p className="text-3xl font-bold text-white">
                                +55
                            </p>
                        </div>
                        <div className="text-blue-200 text-2xl">
                            📊
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Evolução NPS por Mês
                    </h3>
                    <div className="h-64 bg-gray-600 rounded flex items-center justify-center">
                        <p className="text-gray-400">
                            Gráfico de linha - Em desenvolvimento
                        </p>
                    </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Distribuição por Classificação
                    </h3>
                    <div className="h-64 bg-gray-600 rounded flex items-center justify-center">
                        <p className="text-gray-400">
                            Gráfico de pizza - Em desenvolvimento
                        </p>
                    </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Top 5 Médicos Melhor Avaliados
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-600 rounded">
                            <span>Dr. Carlos Santos</span>
                            <span className="text-green-400 font-bold">4.8</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-600 rounded">
                            <span>Dra. Ana Costa</span>
                            <span className="text-green-400 font-bold">4.7</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-600 rounded">
                            <span>Dr. João Silva</span>
                            <span className="text-green-400 font-bold">4.6</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-600 rounded">
                            <span>Dra. Maria Oliveira</span>
                            <span className="text-green-400 font-bold">4.5</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-600 rounded">
                            <span>Dr. Pedro Santos</span>
                            <span className="text-green-400 font-bold">4.4</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Últimos Comentários
                    </h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-600 rounded">
                            <p className="text-sm text-gray-300 mb-1">
                                &ldquo;Excelente atendimento, muito atencioso!&rdquo;
                            </p>
                            <p className="text-xs text-gray-400">
                                Dr. Carlos Santos - há 2 horas
                            </p>
                        </div>
                        <div className="p-3 bg-gray-600 rounded">
                            <p className="text-sm text-gray-300 mb-1">
                                &ldquo;Ótima experiência, recomendo!&rdquo;
                            </p>
                            <p className="text-xs text-gray-400">
                                Dra. Ana Costa - há 4 horas
                            </p>
                        </div>
                        <div className="p-3 bg-gray-600 rounded">
                            <p className="text-sm text-gray-300 mb-1">
                                &ldquo;Atendimento muito bom, pontual.&rdquo;
                            </p>
                            <p className="text-xs text-gray-400">
                                Dr. João Silva - há 6 horas
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnswersDashboard
