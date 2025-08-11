'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Star, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react'

export default function SatisfacaoNovosTratamentosPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-700 bg-clip-text text-transparent">
                    Satisfação - Novos Tratamentos
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Avaliação da satisfação com novos tratamentos
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avaliações Hoje</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">34</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Nota Média</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">8.7</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                            <ThumbsUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Comentários</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tendência</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">+12%</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Avaliações por Tratamento */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
                    Avaliações por Tratamento
                </h2>

                <div className="space-y-6">
                    {[
                        {
                            tratamento: 'Imunoterapia Personalizada',
                            especialidade: 'Oncologia',
                            avaliacoes: 45,
                            nota: 9.2,
                            satisfacao: 94,
                            comentarios: 38,
                            ultimaAvaliacao: '08/08/2025'
                        },
                        {
                            tratamento: 'Terapia Genética CAR-T',
                            especialidade: 'Hematologia',
                            avaliacoes: 23,
                            nota: 8.8,
                            satisfacao: 91,
                            comentarios: 20,
                            ultimaAvaliacao: '07/08/2025'
                        },
                        {
                            tratamento: 'Cirurgia Robótica Minimamente Invasiva',
                            especialidade: 'Cirurgia',
                            avaliacoes: 67,
                            nota: 8.9,
                            satisfacao: 92,
                            comentarios: 55,
                            ultimaAvaliacao: '08/08/2025'
                        },
                        {
                            tratamento: 'Radioterapia Estereotáxica',
                            especialidade: 'Radioterapia',
                            avaliacoes: 34,
                            nota: 8.5,
                            satisfacao: 89,
                            comentarios: 28,
                            ultimaAvaliacao: '06/08/2025'
                        }
                    ].map((tratamento, index) => (
                        <div key={index} className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-gray-200/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                        <h3 className="font-bold text-gray-800 mr-4">{tratamento.tratamento}</h3>
                                        <span className="text-sm bg-white px-3 py-1 rounded border">
                                            {tratamento.especialidade}
                                        </span>
                                        <div className="ml-auto flex items-center space-x-2">
                                            <div className="flex items-center">
                                                {[ ...Array(5) ].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(tratamento.nota) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                                <span className="ml-2 font-bold text-lg text-gray-800">{tratamento.nota}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Avaliações:</span>
                                            <p className="text-gray-800 font-bold">{tratamento.avaliacoes}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Satisfação:</span>
                                            <p className="text-green-600 font-bold">{tratamento.satisfacao}%</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Comentários:</span>
                                            <p className="text-blue-600 font-bold">{tratamento.comentarios}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Última Avaliação:</span>
                                            <p className="text-gray-800">{tratamento.ultimaAvaliacao}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                                    style={{ width: `${tratamento.satisfacao}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 ml-6">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                        Ver Detalhes
                                    </button>
                                    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
                                        Comentários
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comentários Recentes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
                    Comentários Recentes
                </h2>

                <div className="space-y-4">
                    {[
                        {
                            paciente: 'Maria S.',
                            tratamento: 'Imunoterapia Personalizada',
                            nota: 10,
                            comentario: 'Tratamento revolucionário! Senti melhora significativa já nas primeiras sessões. Equipe muito atenciosa.',
                            data: '08/08/2025 14:30'
                        },
                        {
                            paciente: 'João P.',
                            tratamento: 'Cirurgia Robótica',
                            nota: 9,
                            comentario: 'Cirurgia perfeita, recuperação muito mais rápida que esperava. Tecnologia impressionante.',
                            data: '08/08/2025 12:15'
                        },
                        {
                            paciente: 'Ana C.',
                            tratamento: 'Terapia CAR-T',
                            nota: 9,
                            comentario: 'Processo complexo mas bem explicado. Resultados excelentes. Muito grata pela oportunidade.',
                            data: '07/08/2025 16:45'
                        }
                    ].map((comentario, index) => (
                        <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200/50">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                    <span className="font-bold text-gray-800 mr-2">{comentario.paciente}</span>
                                    <span className="text-sm text-gray-600 mr-2">•</span>
                                    <span className="text-sm text-gray-600 mr-3">{comentario.tratamento}</span>
                                    <div className="flex items-center">
                                        {[ ...Array(5) ].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < comentario.nota ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="ml-1 text-sm font-bold">{comentario.nota}</span>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">{comentario.data}</span>
                            </div>
                            <p className="text-gray-700 italic">&ldquo;{comentario.comentario}&rdquo;</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <Star className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Nova Avaliação</h3>
                    <p className="text-sm text-gray-600 mb-4">Registrar nova avaliação</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Avaliar
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Comentários</h3>
                    <p className="text-sm text-gray-600 mb-4">Ver todos os comentários</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Ver Todos
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Análises</h3>
                    <p className="text-sm text-gray-600 mb-4">Análise de tendências</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Ver Análises
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <ThumbsUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Relatórios</h3>
                    <p className="text-sm text-gray-600 mb-4">Relatórios de satisfação</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Gerar Relatório
                    </button>
                </div>
            </div>
        </div>
    )
}
