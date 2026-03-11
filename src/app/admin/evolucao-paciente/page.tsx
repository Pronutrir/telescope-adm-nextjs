'use client'

import React, { useState } from 'react'
import { PageWrapper } from '@/components/layout'
import { useTheme } from '@/contexts/ThemeContext'
import { AutocompletePessoa } from '@/components/pdf/AutocompletePessoa'
import { Modal } from '@/components/ui/Modal'
import { NovaEvolucaoModal } from '@/components/evolucao-paciente/NovaEvolucaoModal'
import { listarEvolucoesPaciente } from '@/app/actions/tasy'
import type { PessoaFisica, EvolucaoPaciente } from '@/types/tasy'
import { FileText, User, Calendar, Activity, AlertCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const EvolucaoPacientePage = () => {
    const { isDark } = useTheme()
    const [selectedPatient, setSelectedPatient] = useState<PessoaFisica | null>(null)
    const [evolucoes, setEvolucoes] = useState<EvolucaoPaciente[]>([])
    const [isLoadingEvolutions, setIsLoadingEvolutions] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedEvolucao, setSelectedEvolucao] = useState<EvolucaoPaciente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isNewEvolutionModalOpen, setIsNewEvolutionModalOpen] = useState(false)
    
    const fetchEvolutions = async (patientId: string) => {
        setIsLoadingEvolutions(true)
        setError(null)
        setEvolucoes([])
        
        try {
            console.log(`🔍 Buscando evoluções para o paciente ${patientId}...`)
            const response = await listarEvolucoesPaciente(patientId)
            
            if (response.sucesso) {
                setEvolucoes(response.evolucoes)
            } else {
                setError(response.erro || 'Erro ao buscar evoluções')
            }
            
        } catch (error) {
            console.error('Erro ao buscar evoluções:', error)
            setError('Ocorreu um erro inesperado ao buscar as evoluções.')
        } finally {
            setIsLoadingEvolutions(false)
        }
    }

    const handlePatientSelect = (nome: string, pessoa?: PessoaFisica) => {
        if (pessoa) {
            setSelectedPatient(pessoa)
            fetchEvolutions(pessoa.id)
        } else {
            setSelectedPatient(null)
            setEvolucoes([])
            setError(null)
        }
    }

    const handleOpenModal = (evolucao: EvolucaoPaciente) => {
        setSelectedEvolucao(evolucao)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setTimeout(() => setSelectedEvolucao(null), 300) // Limpar após animação
    }

    const handleNewEvolutionSuccess = () => {
        if (selectedPatient) {
            fetchEvolutions(selectedPatient.id)
        }
    }

    // Função auxiliar para remover tags HTML e limitar texto
    const getPreviewText = (html: string, maxLength: number = 150) => {
        const tmp = document.createElement('DIV')
        tmp.innerHTML = html
        const text = tmp.textContent || tmp.innerText || ''
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    return (
        <PageWrapper maxWidth="full" spacing="xl" className="pb-48">
            <div className="w-full space-y-8 min-h-[calc(100vh-12rem)]">
                <div className="text-center">
                    <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Evolução do Paciente
                    </h1>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        Acompanhamento e registro da evolução clínica dos pacientes
                    </p>
                </div>
                
                {/* Área de Busca */}
                <div className={`relative z-50 overflow-visible p-6 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <User className="w-5 h-5" />
                        Buscar Paciente
                    </h2>
                    <div className="max-w-2xl mx-auto">
                        <AutocompletePessoa
                            value={selectedPatient?.nome || ''}
                            onChange={handlePatientSelect}
                            placeholder="Digite o nome do paciente..."
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Detalhes do Paciente e Evoluções */}
                {selectedPatient && (
                    <div className="space-y-6">
                        {/* Card do Paciente */}
                        <div className={`p-6 rounded-lg border border-l-4 border-l-blue-500 ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedPatient.nome}
                                    </h3>
                                    <div className={`mt-2 space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <p>Código: <span className="font-medium">{selectedPatient.id}</span></p>
                                        {selectedPatient.cpf && <p>CPF: <span className="font-medium">{selectedPatient.cpf}</span></p>}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                    <User className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Lista de Evoluções */}
                        <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    <Activity className="w-5 h-5" />
                                    Histórico de Evoluções
                                </h2>
                                <button 
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    onClick={() => setIsNewEvolutionModalOpen(true)}
                                >
                                    <FileText className="w-4 h-4" />
                                    Nova Evolução
                                </button>
                            </div>

                            {isLoadingEvolutions ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Carregando evoluções...</p>
                                </div>
                            ) : error ? (
                                <div className={`p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 flex items-center gap-3`}>
                                    <AlertCircle className="w-5 h-5" />
                                    <p>{error}</p>
                                </div>
                            ) : evolucoes.length === 0 ? (
                                <div className={`text-center py-12 border-2 border-dashed rounded-lg ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <Calendar className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                    <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Nenhuma evolução encontrada
                                    </h3>
                                    <p className={`max-w-md mx-auto ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Não foram encontrados registros de evolução para este paciente.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                    {evolucoes.map((evolucao) => (
                                        <div 
                                            key={evolucao.id} 
                                            onClick={() => handleOpenModal(evolucao)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group flex flex-col h-48 ${
                                                isDark 
                                                    ? 'bg-gray-900/50 border-gray-700 hover:border-blue-500/50' 
                                                    : 'bg-white border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                                    isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    #{evolucao.numeroAtendimento}
                                                </span>
                                                <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {format(new Date(evolucao.dataEvolucao), "dd/MM/yy", { locale: ptBR })}
                                                </span>
                                            </div>
                                            
                                            <h4 className={`font-semibold text-xs mb-0.5 truncate ${isDark ? 'text-white' : 'text-gray-900'}`} title={evolucao.nomeProfissional}>
                                                {evolucao.nomeProfissional}
                                            </h4>
                                            <p className={`text-[10px] mb-2 truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {evolucao.usuario}
                                            </p>
                                            
                                            <div className={`pt-2 border-t flex-1 overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                                <div className={`text-[10px] line-clamp-5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                                                     dangerouslySetInnerHTML={{ __html: evolucao.descricao }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Modal de Detalhes da Evolução */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Detalhes da Evolução"
                    size="lg"
                >
                    {selectedEvolucao && (
                        <div className="space-y-6">
                            <div className={`flex flex-col md:flex-row justify-between gap-4 p-4 rounded-lg ${
                                isDark ? 'bg-gray-900/50' : 'bg-gray-50'
                            }`}>
                                <div>
                                    <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedEvolucao.nomeProfissional}
                                    </h4>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {selectedEvolucao.usuario}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {format(new Date(selectedEvolucao.dataEvolucao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Atendimento: {selectedEvolucao.numeroAtendimento}
                                    </div>
                                </div>
                            </div>

                            <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                                <div dangerouslySetInnerHTML={{ __html: selectedEvolucao.descricao }} />
                            </div>

                            {selectedEvolucao.dataLiberacao && (
                                <div className={`text-xs text-right pt-4 border-t ${
                                    isDark ? 'border-gray-700 text-green-400' : 'border-gray-200 text-green-600'
                                }`}>
                                    Liberado em: {format(new Date(selectedEvolucao.dataLiberacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </div>
                            )}
                        </div>
                    )}
                </Modal>

                {/* Modal de Nova Evolução */}
                {selectedPatient && (
                    <NovaEvolucaoModal
                        isOpen={isNewEvolutionModalOpen}
                        onClose={() => setIsNewEvolutionModalOpen(false)}
                        onSuccess={handleNewEvolutionSuccess}
                        pacienteId={selectedPatient.id}
                        pacienteNome={selectedPatient.nome}
                    />
                )}
            </div>
        </PageWrapper>
    )
}

export default EvolucaoPacientePage
