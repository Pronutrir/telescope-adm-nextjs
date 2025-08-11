'use client'

import React from 'react'
import { Users, Phone, UserCheck, Clock } from 'lucide-react'
import { FlyonCard } from '@/components/ui/FlyonCard'
import { Button } from '@/components/ui/Button'

// Interfaces
export interface IFamiliarSimples {
    dt_Atualizacao?: string
    dt_Registro?: string
    id_Pessoa_Fisica?: number
    nm_Pessoa_Fisica?: string
    dt_Nascimento?: string
    nr_CPF?: string
    nr_Identidade?: string
    nr_Ddd?: string
    nr_Telefone_Celular?: string
}

export interface IFamiliar {
    cod_Grau_Parentesco: number
    cod_Pf_Familiar: number
    cod_Pf_Paciente: string
    cod_Pf_Profissional: string
    nm_Usuario: string
    nm_Usuario_Reg: string
    desc_Grau_Parentesco: string
    dt_Atualizacao: string
    dt_Registro: string
    id_Familiar: number
    ie_Sexo: string
    ie_Situacao: string
    nm_Paciente: string
    nm_Profissional: string
    pessoaFisicaSimplificadoSqlServer: IFamiliarSimples
}

interface IAcompanhanteCardProps {
    acompanhante: IFamiliar
}

const AcompanhanteCard: React.FC<IAcompanhanteCardProps> = ({ acompanhante }) => {
    const { pessoaFisicaSimplificadoSqlServer } = acompanhante

    return (
        <FlyonCard
            variant={acompanhante.ie_Situacao === 'A' ? 'telescope' : 'secondary'}
            className="h-full group hover:shadow-lg transition-all duration-300"
        >
            <div className="p-4">
                {/* Layout horizontal mais compacto */}
                <div className="flex items-center justify-between">
                    {/* Coluna principal com informações */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Informações do acompanhante */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-sm">
                                    {pessoaFisicaSimplificadoSqlServer.nm_Pessoa_Fisica}
                                </h3>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    <Users className="w-3 h-3 mr-1" />
                                    {acompanhante.desc_Grau_Parentesco}
                                </span>
                            </div>

                            <div className="text-xs">
                                <span className="font-medium opacity-70">Paciente: </span>
                                <span>{acompanhante.nm_Paciente}</span>
                            </div>

                            {pessoaFisicaSimplificadoSqlServer.nr_Ddd &&
                                pessoaFisicaSimplificadoSqlServer.nr_Telefone_Celular && (
                                    <div className="flex items-center text-xs">
                                        <Phone className="w-3 h-3 mr-1 opacity-60" />
                                        ({pessoaFisicaSimplificadoSqlServer.nr_Ddd}) {pessoaFisicaSimplificadoSqlServer.nr_Telefone_Celular}
                                    </div>
                                )}
                        </div>

                        {/* Informações adicionais */}
                        <div className="space-y-2">
                            <div className="flex items-center text-xs">
                                <Clock className="w-3 h-3 mr-1 opacity-60" />
                                <span className="font-medium opacity-70 mr-1">Registro: </span>
                                {new Date(acompanhante.dt_Registro).toLocaleDateString('pt-BR')}
                            </div>

                            <div className="text-xs">
                                <span className="font-medium opacity-70">Profissional: </span>
                                <span>{acompanhante.nm_Profissional}</span>
                            </div>

                            <div className="text-xs">
                                <span className="font-medium opacity-70">Situação: </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${acompanhante.ie_Situacao === 'A'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    {acompanhante.ie_Situacao === 'A' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Ações compactas */}
                    <div className="flex flex-col gap-1 ml-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Detalhes
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Histórico
                        </Button>
                    </div>
                </div>
            </div>
        </FlyonCard>
    )
}

export default AcompanhanteCard
