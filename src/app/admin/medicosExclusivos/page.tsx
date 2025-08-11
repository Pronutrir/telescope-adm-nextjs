'use client'

import React from 'react'
import { MainLayout } from '@/components/layout'
import { Users, Star, Clock, TrendingUp } from 'lucide-react'

export default function MedicosExclusivosPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                    Médicos Exclusivos
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                    Gestão de médicos com atendimento exclusivo
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Exclusivos</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">4.8</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">25min</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Crescimento</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">+18%</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Staff List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    Lista de Médicos Exclusivos
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                        { nome: 'Dr. João Silva', especialidade: 'Cardiologia', pacientes: 45, avaliacao: 4.9 },
                        { nome: 'Dra. Maria Santos', especialidade: 'Oncologia', pacientes: 32, avaliacao: 4.8 },
                        { nome: 'Dr. Pedro Costa', especialidade: 'Neurologia', pacientes: 28, avaliacao: 4.7 },
                        { nome: 'Dra. Ana Lima', especialidade: 'Endocrinologia', pacientes: 38, avaliacao: 4.9 },
                        { nome: 'Dr. Carlos Rocha', especialidade: 'Ortopedia', pacientes: 41, avaliacao: 4.6 },
                        { nome: 'Dra. Lucia Mendes', especialidade: 'Ginecologia', pacientes: 36, avaliacao: 4.8 }
                    ].map((medico, index) => (
                        <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200/50">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {medico.nome.split(' ').map(n => n[ 0 ]).join('')}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold text-gray-800">{medico.nome}</h3>
                                    <p className="text-sm text-gray-600">{medico.especialidade}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Pacientes:</span>
                                    <span className="font-semibold">{medico.pacientes}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Avaliação:</span>
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                        <span className="font-semibold">{medico.avaliacao}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
