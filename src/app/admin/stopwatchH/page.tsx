'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Timer, Play, Pause, RotateCcw, TrendingUp } from 'lucide-react'

export default function StopwatchHPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 bg-clip-text text-transparent">
                    Stopwatch Hospitalar
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Cronometragem de processos e procedimentos médicos
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Ativos Hoje</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                            <Timer className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Em Execução</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Finalizados</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <Pause className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">2h 15m</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cronômetros Ativos */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                    Cronômetros Ativos
                </h2>

                <div className="space-y-6">
                    {[
                        {
                            id: 'SW001',
                            processo: 'Cirurgia Cardíaca',
                            paciente: 'João Silva Santos',
                            medico: 'Dr. Roberto Lima',
                            inicio: '08:30:00',
                            tempo: '02:45:32',
                            status: 'Em execução',
                            sala: 'CC-01',
                            tipo: 'Cirúrgico'
                        },
                        {
                            id: 'SW002',
                            processo: 'Quimioterapia',
                            paciente: 'Maria Oliveira',
                            medico: 'Dra. Ana Costa',
                            inicio: '09:15:00',
                            tempo: '01:30:15',
                            status: 'Em execução',
                            sala: 'QT-03',
                            tipo: 'Oncológico'
                        },
                        {
                            id: 'SW003',
                            processo: 'Hemodiálise',
                            paciente: 'Carlos Mendes',
                            medico: 'Dr. Fernando Alves',
                            inicio: '07:00:00',
                            tempo: '03:45:22',
                            status: 'Pausado',
                            sala: 'HD-02',
                            tipo: 'Nefrológico'
                        },
                        {
                            id: 'SW004',
                            processo: 'Tomografia',
                            paciente: 'Lucia Santos',
                            medico: 'Dr. Pedro Rocha',
                            inicio: '10:20:00',
                            tempo: '00:25:08',
                            status: 'Em execução',
                            sala: 'TC-01',
                            tipo: 'Diagnóstico'
                        }
                    ].map((stopwatch, index) => (
                        <div key={index} className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-gray-200/50">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                        <div className="text-3xl font-mono font-bold text-orange-600 mr-6">
                                            {stopwatch.tempo}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{stopwatch.processo}</h3>
                                            <p className="text-sm text-gray-600">{stopwatch.paciente}</p>
                                        </div>
                                        <div className="ml-auto flex items-center space-x-3">
                                            <span className="text-sm bg-white px-2 py-1 rounded border">
                                                {stopwatch.id}
                                            </span>
                                            <span className="text-sm bg-white px-2 py-1 rounded border">
                                                {stopwatch.sala}
                                            </span>
                                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${stopwatch.status === 'Em execução' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                                }`}>
                                                {stopwatch.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Médico:</span>
                                            <p className="text-gray-800">{stopwatch.medico}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Tipo:</span>
                                            <p className="text-gray-800">{stopwatch.tipo}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Início:</span>
                                            <p className="text-gray-800">{stopwatch.inicio}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Duração Prevista:</span>
                                            <p className="text-gray-800">
                                                {stopwatch.tipo === 'Cirúrgico' ? '4h 00m' :
                                                    stopwatch.tipo === 'Oncológico' ? '3h 30m' :
                                                        stopwatch.tipo === 'Nefrológico' ? '4h 30m' : '45min'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2 ml-6">
                                    {stopwatch.status === 'Em execução' && (
                                        <>
                                            <button className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                                                <Pause className="w-5 h-5" />
                                            </button>
                                            <button className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                                <RotateCcw className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {stopwatch.status === 'Pausado' && (
                                        <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                            <Play className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                        Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <Timer className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Novo Cronômetro</h3>
                    <p className="text-sm text-gray-600 mb-4">Iniciar novo processo</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Iniciar
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <Play className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Processos</h3>
                    <p className="text-sm text-gray-600 mb-4">Gerenciar processos</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Ver Todos
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Análises</h3>
                    <p className="text-sm text-gray-600 mb-4">Análise de tempos</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Ver Análises
                    </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                    <RotateCcw className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">Histórico</h3>
                    <p className="text-sm text-gray-600 mb-4">Consultar histórico</p>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Ver Histórico
                    </button>
                </div>
            </div>
        </div>
    )
}
