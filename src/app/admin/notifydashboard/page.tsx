'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { BarChart3, TrendingUp, Eye, Monitor } from 'lucide-react'

export default function NotifyDashboardsPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                    Notify Dashboards
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Dashboards e relatórios Power BI
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Dashboards Ativos</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <Monitor className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Visualizações</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">2.4K</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Relatórios</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">48</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Crescimento</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">+32%</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                    {
                        nome: 'Dashboard Financeiro',
                        descricao: 'Análise de receitas e despesas',
                        status: 'Ativo',
                        ultimaAtualizacao: '2 min atrás',
                        cor: 'from-blue-500 to-blue-600'
                    },
                    {
                        nome: 'Indicadores Médicos',
                        descricao: 'KPIs de atendimento médico',
                        status: 'Ativo',
                        ultimaAtualizacao: '5 min atrás',
                        cor: 'from-green-500 to-green-600'
                    },
                    {
                        nome: 'Satisfação Pacientes',
                        descricao: 'NPS e pesquisas de satisfação',
                        status: 'Ativo',
                        ultimaAtualizacao: '1 hora atrás',
                        cor: 'from-purple-500 to-purple-600'
                    },
                    {
                        nome: 'Operacional',
                        descricao: 'Gestão de recursos e equipamentos',
                        status: 'Manutenção',
                        ultimaAtualizacao: '3 horas atrás',
                        cor: 'from-orange-500 to-orange-600'
                    },
                    {
                        nome: 'Qualidade',
                        descricao: 'Indicadores de qualidade assistencial',
                        status: 'Ativo',
                        ultimaAtualizacao: '30 min atrás',
                        cor: 'from-teal-500 to-teal-600'
                    },
                    {
                        nome: 'RH e Gestão',
                        descricao: 'Recursos humanos e gestão de pessoas',
                        status: 'Ativo',
                        ultimaAtualizacao: '15 min atrás',
                        cor: 'from-pink-500 to-pink-600'
                    }
                ].map((dashboard, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${dashboard.cor} flex items-center justify-center`}>
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${dashboard.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                                {dashboard.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{dashboard.nome}</h3>
                        <p className="text-gray-600 text-sm mb-4">{dashboard.descricao}</p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Última atualização:</span>
                            <span>{dashboard.ultimaAtualizacao}</span>
                        </div>

                        <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                            Abrir Dashboard
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
