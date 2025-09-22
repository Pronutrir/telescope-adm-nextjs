'use client'

import React from 'react'
import { Users, Phone, Smile, BarChart3 } from 'lucide-react'

export default function SatisfacaoRecepcionistasPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
                    Satisfação - Recepcionistas
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Avaliação do atendimento na recepção
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avaliações Hoje</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">127</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Nota Média</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">9.1</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                            <Smile className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Atendimentos</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">456</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <Phone className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Satisfação</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">91%</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance por Recepcionista */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                    Performance por Recepcionista
                </h2>

                <div className="space-y-6">
                    {[
                        {
                            nome: 'Ana Paula Silva',
                            turno: 'Manhã (06:00-14:00)',
                            avaliacoes: 89,
                            nota: 9.4,
                            satisfacao: 96,
                            atendimentos: 145,
                            tempoMedio: '3m 20s'
                        },
                        {
                            nome: 'Mariana Costa Santos',
                            turno: 'Tarde (14:00-22:00)',
                            avaliacoes: 76,
                            nota: 9.2,
                            satisfacao: 94,
                            atendimentos: 132,
                            tempoMedio: '3m 45s'
                        },
                        {
                            nome: 'Patricia Oliveira',
                            turno: 'Manhã (06:00-14:00)',
                            avaliacoes: 67,
                            nota: 8.9,
                            satisfacao: 89,
                            atendimentos: 119,
                            tempoMedio: '4m 10s'
                        },
                        {
                            nome: 'Carla Mendes',
                            turno: 'Noite (22:00-06:00)',
                            avaliacoes: 34,
                            nota: 9.0,
                            satisfacao: 92,
                            atendimentos: 78,
                            tempoMedio: '3m 55s'
                        }
                    ].map((recepcionista, index) => (
                        <div key={index} className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-gray-200/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                            {recepcionista.nome.split(' ').map(n => n[ 0 ]).join('').substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{recepcionista.nome}</h3>
                                            <p className="text-sm text-gray-600">{recepcionista.turno}</p>
                                        </div>
                                        <div className="ml-auto flex items-center space-x-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-emerald-600">{recepcionista.nota}</div>
                                                <div className="text-xs text-gray-500">Nota Média</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">{recepcionista.satisfacao}%</div>
                                                <div className="text-xs text-gray-500">Satisfação</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Avaliações:</span>
                                            <p className="text-gray-800 font-bold">{recepcionista.avaliacoes}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Atendimentos:</span>
                                            <p className="text-blue-600 font-bold">{recepcionista.atendimentos}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Tempo Médio:</span>
                                            <p className="text-purple-600 font-bold">{recepcionista.tempoMedio}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full"
                                                    style={{ width: `${recepcionista.satisfacao}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 ml-6">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                        Ver Detalhes
                                    </button>
                                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                                        Feedback
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feedback Recente */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
                    Feedback Recente
                </h2>

                <div className="space-y-4">
                    {[
                        {
                            paciente: 'Maria J.',
                            recepcionista: 'Ana Paula Silva',
                            nota: 10,
                            comentario: 'Atendimento excepcional! Muito atenciosa e resolveu tudo rapidamente.',
                            data: '08/08/2025 14:30',
                            tipo: 'Agendamento'
                        },
                        {
                            paciente: 'João P.',
                            recepcionista: 'Mariana Costa Santos',
                            nota: 9,
                            comentario: 'Recepcionista muito educada e paciente. Explicou tudo claramente.',
                            data: '08/08/2025 12:15',
                            tipo: 'Informações'
                        },
                        {
                            paciente: 'Carlos S.',
                            recepcionista: 'Patricia Oliveira',
                            nota: 8,
                            comentario: 'Bom atendimento, mas demorou um pouco para conseguir agendar.',
                            data: '07/08/2025 16:45',
                            tipo: 'Agendamento'
                        }
                    ].map((feedback, index) => (
                        <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-gray-200/50">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                    <span className="font-bold text-gray-800 mr-2">{feedback.paciente}</span>
                                    <span className="text-sm text-gray-600 mr-2">•</span>
                                    <span className="text-sm text-gray-600 mr-3">{feedback.recepcionista}</span>
                                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded mr-3">
                                        {feedback.tipo}
                                    </span>
                                    <div className="text-lg font-bold text-emerald-600">
                                        {feedback.nota}/10
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">{feedback.data}</span>
                            </div>
                            <p className="text-gray-700 italic">&ldquo;{feedback.comentario}&rdquo;</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <Users className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Nova Avaliação</h3>
                    <p className="text-sm text-gray-600 mb-4">Registrar avaliação</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Avaliar
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <Phone className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Atendimentos</h3>
                    <p className="text-sm text-gray-600 mb-4">Histórico de atendimentos</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Ver Histórico
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Relatórios</h3>
                    <p className="text-sm text-gray-600 mb-4">Relatórios de performance</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Gerar Relatório
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <Smile className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Treinamentos</h3>
                    <p className="text-sm text-gray-600 mb-4">Planos de melhoria</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Ver Planos
                    </button>
                </div>
            </div>
        </div>
    )
}
