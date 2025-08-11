'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Hospital, FileText, Clock, Users } from 'lucide-react'

export default function EvolucaoMedicaPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                    Evolução Médica
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Acompanhamento e registro de evoluções médicas
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Evoluções Hoje</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">127</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pacientes Ativos</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">12min</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Internações</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">34</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                            <Hospital className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Evoluções Recentes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    Evoluções Recentes
                </h2>

                <div className="space-y-6">
                    {[
                        {
                            paciente: 'Maria Oliveira',
                            medico: 'Dr. João Silva',
                            especialidade: 'Cardiologia',
                            data: '08/08/2025 14:30',
                            status: 'Concluída',
                            resumo: 'Paciente apresenta melhora significativa dos sintomas cardiovasculares. Pressão arterial controlada.',
                            leito: '201A'
                        },
                        {
                            paciente: 'Pedro Santos',
                            medico: 'Dra. Ana Costa',
                            especialidade: 'Neurologia',
                            data: '08/08/2025 14:15',
                            status: 'Em andamento',
                            resumo: 'Avaliação neurológica em curso. Paciente consciente e orientado.',
                            leito: '305B'
                        },
                        {
                            paciente: 'Carmen Silva',
                            medico: 'Dr. Carlos Mendes',
                            especialidade: 'Oncologia',
                            data: '08/08/2025 13:45',
                            status: 'Concluída',
                            resumo: 'Resposta positiva ao tratamento quimioterápico. Efeitos colaterais controlados.',
                            leito: '102C'
                        }
                    ].map((evolucao, index) => (
                        <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200/50">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <h3 className="font-bold text-gray-800 mr-3">{evolucao.paciente}</h3>
                                        <span className="text-sm bg-white px-2 py-1 rounded border">
                                            Leito {evolucao.leito}
                                        </span>
                                        <span className={`ml-2 text-sm px-3 py-1 rounded-full font-medium ${evolucao.status === 'Concluída' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                            }`}>
                                            {evolucao.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                        <span className="font-medium">{evolucao.medico}</span>
                                        <span className="mx-2">•</span>
                                        <span>{evolucao.especialidade}</span>
                                        <span className="mx-2">•</span>
                                        <span>{evolucao.data}</span>
                                    </div>

                                    <p className="text-gray-700">{evolucao.resumo}</p>
                                </div>

                                <div className="flex space-x-2 ml-4">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                        Ver Completa
                                    </button>
                                    {evolucao.status === 'Em andamento' && (
                                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                            Finalizar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Nova Evolução</h3>
                    <p className="text-sm text-gray-600 mb-4">Registrar nova evolução médica</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Criar Evolução
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Pacientes Pendentes</h3>
                    <p className="text-sm text-gray-600 mb-4">Ver pacientes aguardando evolução</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Ver Pendentes
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <Hospital className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Relatórios</h3>
                    <p className="text-sm text-gray-600 mb-4">Gerar relatórios de evolução</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Gerar Relatório
                    </button>
                </div>
            </div>
        </div>
    )
}
