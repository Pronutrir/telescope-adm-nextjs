'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { UserCheck, Clock, Bell, Users } from 'lucide-react'

export default function AcompanhantesPage() {
    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                        Acompanhantes
                    </h1>
                    <p className="text-gray-600 mt-3 text-lg">
                        Controle de visitantes e acompanhantes
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Acompanhantes Ativos</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">42</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
                                <UserCheck className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Novos Hoje</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
                                <Bell className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">4h 20m</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acompanhantes Ativos */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
                        Acompanhantes Ativos
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                nome: 'Maria José Santos',
                                parentesco: 'Mãe',
                                paciente: 'João Santos Silva',
                                leito: '201A',
                                entrada: '08/08/2025 07:30',
                                documento: 'RG 12.345.678-9',
                                status: 'Ativo',
                                permanencia: '2h 45m'
                            },
                            {
                                nome: 'Carlos Eduardo Oliveira',
                                parentesco: 'Esposo',
                                paciente: 'Ana Paula Oliveira',
                                leito: '305B',
                                entrada: '08/08/2025 06:15',
                                documento: 'CPF 123.456.789-00',
                                status: 'Ativo',
                                permanencia: '4h 00m'
                            },
                            {
                                nome: 'Lucia Fernandes',
                                parentesco: 'Filha',
                                paciente: 'Antônio Fernandes',
                                leito: '102C',
                                entrada: '07/08/2025 22:00',
                                documento: 'RG 98.765.432-1',
                                status: 'Pernoite',
                                permanencia: '12h 15m'
                            },
                            {
                                nome: 'Roberto Silva',
                                parentesco: 'Irmão',
                                paciente: 'Marcos Silva',
                                leito: '408A',
                                entrada: '08/08/2025 09:00',
                                documento: 'CNH 123456789',
                                status: 'Pendente',
                                permanencia: '-'
                            }
                        ].map((acompanhante, index) => (
                            <div key={index} className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-gray-200/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                            <h3 className="font-bold text-gray-800 mr-3">{acompanhante.nome}</h3>
                                            <span className="text-sm bg-white px-2 py-1 rounded border mr-2">
                                                {acompanhante.parentesco}
                                            </span>
                                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${acompanhante.status === 'Ativo' ? 'bg-green-200 text-green-800' :
                                                    acompanhante.status === 'Pernoite' ? 'bg-blue-200 text-blue-800' :
                                                        'bg-yellow-200 text-yellow-800'
                                                }`}>
                                                {acompanhante.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-600">Paciente:</span>
                                                <p className="text-gray-800">{acompanhante.paciente}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Leito:</span>
                                                <p className="text-gray-800">{acompanhante.leito}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Entrada:</span>
                                                <p className="text-gray-800">{acompanhante.entrada}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Permanência:</span>
                                                <p className="text-gray-800">{acompanhante.permanencia}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <span className="font-medium text-gray-600 text-sm">Documento: </span>
                                            <span className="text-gray-800 text-sm">{acompanhante.documento}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2 ml-6">
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                            Ver Detalhes
                                        </button>
                                        {acompanhante.status === 'Pendente' && (
                                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                                                Autorizar
                                            </button>
                                        )}
                                        {(acompanhante.status === 'Ativo' || acompanhante.status === 'Pernoite') && (
                                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                        <UserCheck className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">Novo Acompanhante</h3>
                        <p className="text-sm text-gray-600 mb-4">Cadastrar acompanhante</p>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Cadastrar
                        </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                        <Bell className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">Autorizações</h3>
                        <p className="text-sm text-gray-600 mb-4">Gerenciar pendências</p>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Ver Pendentes
                        </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                        <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">Histórico</h3>
                        <p className="text-sm text-gray-600 mb-4">Consultar histórico</p>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Ver Histórico
                        </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                        <Clock className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">Relatórios</h3>
                        <p className="text-sm text-gray-600 mb-4">Relatórios de visitação</p>
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Gerar Relatório
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
