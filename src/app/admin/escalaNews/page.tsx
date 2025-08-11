'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Siren, AlertTriangle, Activity, TrendingUp } from 'lucide-react'

export default function EscalaNewsPage() {
    return (
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                        Alertas Escala NEWS
                    </h1>
                    <p className="text-gray-600 mt-3 text-lg">
                        Sistema de alertas baseado na Escala NEWS (National Early Warning Score)
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Alertas Ativos</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">7</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                                <Siren className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Alto Risco</p>
                                <p className="text-2xl font-bold text-orange-600 mt-1">3</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Monitorados</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">28</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Melhoria</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">+15%</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas Ativos */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
                        Alertas Críticos Ativos
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                paciente: 'Maria Silva',
                                leito: '201A',
                                score: 8,
                                prioridade: 'Alta',
                                tempo: '5 min atrás',
                                sinais: [ 'Pressão Alta', 'Taquicardia', 'SpO2 Baixo' ]
                            },
                            {
                                paciente: 'João Santos',
                                leito: '305B',
                                score: 6,
                                prioridade: 'Média',
                                tempo: '12 min atrás',
                                sinais: [ 'Febre', 'Taquipneia' ]
                            },
                            {
                                paciente: 'Ana Costa',
                                leito: '102C',
                                score: 9,
                                prioridade: 'Crítica',
                                tempo: '2 min atrás',
                                sinais: [ 'Hipotensão', 'Alteração Consciência', 'SpO2 Crítico' ]
                            }
                        ].map((alerta, index) => (
                            <div key={index} className={`p-6 rounded-xl border-l-4 ${alerta.prioridade === 'Crítica' ? 'bg-red-50 border-red-500' :
                                    alerta.prioridade === 'Alta' ? 'bg-orange-50 border-orange-500' :
                                        'bg-yellow-50 border-yellow-500'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <h3 className="font-bold text-gray-800 mr-4">{alerta.paciente}</h3>
                                            <span className="text-sm bg-gray-200 px-2 py-1 rounded">Leito {alerta.leito}</span>
                                            <span className={`ml-2 text-sm px-3 py-1 rounded-full font-medium ${alerta.prioridade === 'Crítica' ? 'bg-red-200 text-red-800' :
                                                    alerta.prioridade === 'Alta' ? 'bg-orange-200 text-orange-800' :
                                                        'bg-yellow-200 text-yellow-800'
                                                }`}>
                                                NEWS {alerta.score}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {alerta.sinais.map((sinal, i) => (
                                                <span key={i} className="text-xs bg-white px-2 py-1 rounded border">
                                                    {sinal}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-sm text-gray-600">{alerta.tempo}</p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                            Ver Detalhes
                                        </button>
                                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                            Responder
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Escala NEWS Reference */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Referência da Escala NEWS
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <h3 className="font-semibold text-green-800 mb-2">Score 0-4</h3>
                            <p className="text-sm text-green-700">Baixo Risco</p>
                            <p className="text-xs text-green-600 mt-1">Monitoramento de rotina</p>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                            <h3 className="font-semibold text-yellow-800 mb-2">Score 5-6</h3>
                            <p className="text-sm text-yellow-700">Risco Médio</p>
                            <p className="text-xs text-yellow-600 mt-1">Avaliação médica em 1h</p>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <h3 className="font-semibold text-orange-800 mb-2">Score 7+</h3>
                            <p className="text-sm text-orange-700">Alto Risco</p>
                            <p className="text-xs text-orange-600 mt-1">Avaliação urgente</p>
                        </div>

                        <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                            <h3 className="font-semibold text-red-800 mb-2">Score 9+</h3>
                            <p className="text-sm text-red-700">Risco Crítico</p>
                            <p className="text-xs text-red-600 mt-1">Resposta imediata</p>
                        </div>
                    </div>
                </div>
            </div>
    )
}
