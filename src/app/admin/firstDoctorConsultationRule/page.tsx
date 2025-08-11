'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Gavel, FileText, Calendar, Clock } from 'lucide-react'

export default function RegraMedicaPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                    Regra Médica
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Configuração de regras para primeira consulta médica
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Regras Ativas</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <Gavel className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Consultas Reguladas</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">324</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">48h</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    Configuração de Regras
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Regras Ativas</h3>
                        <div className="space-y-3">
                            {[
                                'Prioridade por idade (>65 anos)',
                                'Pacientes oncológicos',
                                'Casos de urgência',
                                'Retorno em até 30 dias'
                            ].map((regra, index) => (
                                <div key={index} className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200">
                                    <FileText className="w-4 h-4 text-green-600 mr-3" />
                                    <span className="text-gray-700">{regra}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Métricas</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-sm text-gray-600">Taxa de Cumprimento</p>
                                <p className="text-2xl font-bold text-blue-600">94.5%</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <p className="text-sm text-gray-600">Tempo Médio de Resposta</p>
                                <p className="text-2xl font-bold text-purple-600">2.3 dias</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
