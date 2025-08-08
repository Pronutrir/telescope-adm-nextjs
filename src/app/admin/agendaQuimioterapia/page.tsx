'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Calendar, Users, Clock, Activity } from 'lucide-react'

export default function AgendaQuimioterapiaPage() {
    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
                        Agenda Quimioterapia
                    </h1>
                    <p className="text-gray-600 mt-3 text-lg">
                        Gestão de agendamentos e sessões de quimioterapia
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Sessões Hoje</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pacientes Ativos</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">67</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">3h 45m</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agenda do Dia */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Agenda de Hoje - 08/08/2025
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                horario: '08:00',
                                paciente: 'Ana Paula Martins',
                                protocolo: 'AC - Doxorrubicina + Ciclofosfamida',
                                ciclo: '2/4',
                                medico: 'Dr. Roberto Lima',
                                poltrona: 'P01',
                                status: 'Em andamento',
                                inicio: '08:15'
                            },
                            {
                                horario: '09:30',
                                paciente: 'Carlos Eduardo Silva',
                                protocolo: 'FOLFOX - 5-FU + Oxaliplatina',
                                ciclo: '6/12',
                                medico: 'Dra. Mariana Costa',
                                poltrona: 'P03',
                                status: 'Aguardando',
                                inicio: '-'
                            },
                            {
                                horario: '11:00',
                                paciente: 'Luiza Santos Oliveira',
                                protocolo: 'Paclitaxel + Carboplatina',
                                ciclo: '4/6',
                                medico: 'Dr. Fernando Alves',
                                poltrona: 'P05',
                                status: 'Agendado',
                                inicio: '-'
                            },
                            {
                                horario: '14:00',
                                paciente: 'João Pedro Rocha',
                                protocolo: 'Docetaxel + Cisplatina',
                                ciclo: '1/4',
                                medico: 'Dra. Patricia Mendes',
                                poltrona: 'P02',
                                status: 'Agendado',
                                inicio: '-'
                            }
                        ].map((sessao, index) => (
                            <div key={index} className="p-6 bg-gradient-to-br from-red-50 to-purple-50 rounded-xl border border-gray-200/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                            <div className="text-2xl font-bold text-red-600 mr-4">
                                                {sessao.horario}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{sessao.paciente}</h3>
                                                <p className="text-sm text-gray-600">{sessao.medico}</p>
                                            </div>
                                            <div className="ml-auto flex items-center space-x-3">
                                                <span className="text-sm bg-white px-3 py-1 rounded border">
                                                    {sessao.poltrona}
                                                </span>
                                                <span className={`text-sm px-3 py-1 rounded-full font-medium ${sessao.status === 'Em andamento' ? 'bg-green-200 text-green-800' :
                                                        sessao.status === 'Aguardando' ? 'bg-yellow-200 text-yellow-800' :
                                                            'bg-blue-200 text-blue-800'
                                                    }`}>
                                                    {sessao.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-600">Protocolo:</span>
                                                <p className="text-gray-800">{sessao.protocolo}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Ciclo:</span>
                                                <p className="text-gray-800">{sessao.ciclo}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Início Real:</span>
                                                <p className="text-gray-800">{sessao.inicio}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2 ml-6">
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                            Ver Detalhes
                                        </button>
                                        {sessao.status === 'Agendado' && (
                                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                                                Iniciar
                                            </button>
                                        )}
                                        {sessao.status === 'Em andamento' && (
                                            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                                                Pausar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                        <Calendar className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">Novo Agendamento</h3>
                        <p className="text-sm text-gray-600 mb-4">Agendar nova sessão</p>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Agendar
                        </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                        <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">Lista de Espera</h3>
                        <p className="text-sm text-gray-600 mb-4">Gerenciar fila de espera</p>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Ver Fila
                        </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                        <Activity className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">Protocolos</h3>
                        <p className="text-sm text-gray-600 mb-4">Gerenciar protocolos</p>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Ver Protocolos
                        </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                        <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">Relatórios</h3>
                        <p className="text-sm text-gray-600 mb-4">Relatórios de ocupação</p>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Gerar Relatório
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
