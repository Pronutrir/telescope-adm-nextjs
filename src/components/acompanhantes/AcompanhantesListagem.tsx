'use client'

import React, { useState } from 'react'
import { Search, Users, Filter, RefreshCw } from 'lucide-react'
import { FlyonCard } from '@/components/ui/FlyonCard'
import { Button } from '@/components/ui/Button'
import AutocompletePacientes from './AutocompletePacientes'
import AcompanhanteCard from './AcompanhanteCard'
import { useAcompanhantes } from '@/hooks/useAcompanhantes'
import { IPaciente } from '@/hooks/usePacientes'

const AcompanhantesListagem: React.FC = () => {
    const [ pacienteSelecionado, setPacienteSelecionado ] = useState<IPaciente | null>(null)

    const {
        data: acompanhantes,
        isLoading,
        isFetching,
        error,
        refetch
    } = useAcompanhantes({
        codPfPaciente: pacienteSelecionado?.cD_PESSOA_FISICA,
        enabled: Boolean(pacienteSelecionado?.cD_PESSOA_FISICA)
    })

    const handlePacienteChange = (paciente: IPaciente | null) => {
        setPacienteSelecionado(paciente)
    }

    const handleRefresh = () => {
        if (pacienteSelecionado?.cD_PESSOA_FISICA) {
            refetch()
        }
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <FlyonCard variant="telescope" size="md">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <Search className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                    Filtrar Acompanhantes
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Selecione um paciente para visualizar seus acompanhantes
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={!pacienteSelecionado || isFetching}
                                className="flex items-center gap-1"
                            >
                                <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                                Atualizar
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPacienteSelecionado(null)}
                                disabled={!pacienteSelecionado}
                                className="flex items-center gap-1"
                            >
                                <Filter className="w-3 h-3" />
                                Limpar
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="flex-1 max-w-md">
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Paciente
                            </label>
                            <AutocompletePacientes
                                value={pacienteSelecionado}
                                onChange={handlePacienteChange}
                                placeholder="Digite o nome do paciente..."
                            />
                        </div>
                    </div>
                </div>
            </FlyonCard>

            {/* Estado: Loading */}
            {isLoading && (
                <FlyonCard variant="telescope" size="md">
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                            <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Carregando acompanhantes...
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Buscando informações dos acompanhantes do paciente selecionado
                        </p>
                    </div>
                </FlyonCard>
            )}

            {/* Estado: Erro */}
            {error && (
                <FlyonCard variant="telescope" size="md">
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                            <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Erro ao carregar acompanhantes
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Ocorreu um erro ao buscar os acompanhantes. Tente novamente.
                        </p>
                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleRefresh}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Tentar Novamente
                        </Button>
                    </div>
                </FlyonCard>
            )}

            {/* Estado: Nenhum paciente selecionado */}
            {!pacienteSelecionado && !isLoading && !error && (
                <FlyonCard variant="telescope" size="md">
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Selecione um paciente
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Use o campo de busca acima para selecionar um paciente e visualizar seus acompanhantes
                        </p>
                    </div>
                </FlyonCard>
            )}

            {/* Resultados: Lista de acompanhantes */}
            {pacienteSelecionado && acompanhantes && acompanhantes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Acompanhantes de {pacienteSelecionado.nM_PESSOA_FISICA}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {acompanhantes.length} acompanhante{acompanhantes.length !== 1 ? 's' : ''} encontrado{acompanhantes.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isFetching && (
                                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {isFetching ? 'Atualizando...' : 'Atualizado'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {acompanhantes.map((acompanhante) => (
                            <AcompanhanteCard
                                key={`${acompanhante.id_Familiar}-${acompanhante.cod_Pf_Familiar}`}
                                acompanhante={acompanhante}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Estado: Nenhum acompanhante encontrado */}
            {pacienteSelecionado && acompanhantes && acompanhantes.length === 0 && !isLoading && (
                <FlyonCard variant="telescope" size="md">
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                            <Users className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Nenhum acompanhante encontrado
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            O paciente <strong>{pacienteSelecionado.nM_PESSOA_FISICA}</strong> não possui acompanhantes cadastrados no momento.
                        </p>
                    </div>
                </FlyonCard>
            )}
        </div>
    )
}

export default AcompanhantesListagem
