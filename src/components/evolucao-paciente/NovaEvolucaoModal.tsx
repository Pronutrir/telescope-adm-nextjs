'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useTheme } from '@/contexts/ThemeContext'
import { AutocompletePessoa } from '@/components/pdf/AutocompletePessoa'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { 
    listarEspecialidades, 
    listarTiposEvolucao, 
    criarEvolucaoPaciente,
    listarTextosPadroesReduzidos,
    obterTextoPadraoCompleto
} from '@/app/actions/tasy'
import type { Especialidade, TipoEvolucao, PessoaFisica, TextoPadrao } from '@/types/tasy'
import { Save, AlertCircle, Loader2 } from 'lucide-react'

interface NovaEvolucaoModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    pacienteId: string | number
    pacienteNome: string
}

export const NovaEvolucaoModal: React.FC<NovaEvolucaoModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    pacienteId,
    pacienteNome
}) => {
    const { isDark } = useTheme()
    
    // Estados do formulário
    const [dataEvolucao, setDataEvolucao] = useState('')
    const [medico, setMedico] = useState<PessoaFisica | null>(null)
    const [especialidadeId, setEspecialidadeId] = useState<number | string | ''>('')
    const [tipoEvolucaoId, setTipoEvolucaoId] = useState<number | string | ''>('')
    const [descricao, setDescricao] = useState('')
    
    // Estados de dados auxiliares
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
    const [tiposEvolucao, setTiposEvolucao] = useState<TipoEvolucao[]>([])
    const [textosPadroes, setTextosPadroes] = useState<TextoPadrao[]>([])
    const [textoPadraoSelecionado, setTextoPadraoSelecionado] = useState<number | ''>('')
    
    // Estados de controle
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingTextos, setIsLoadingTextos] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Carregar dados auxiliares ao abrir
    useEffect(() => {
        if (isOpen) {
            loadAuxiliaryData()
            // Reset form
            setDataEvolucao(new Date().toISOString().slice(0, 16)) // Current datetime-local format
            setMedico(null)
            setEspecialidadeId('')
            setTipoEvolucaoId('')
            setTextoPadraoSelecionado('')
            setTextosPadroes([])
            setDescricao('')
            setError(null)
        }
    }, [isOpen])

    // Carregar textos padrões quando o tipo de evolução mudar
    useEffect(() => {
        if (tipoEvolucaoId) {
            // Agora aceitamos string ou number, pois a API suporta ambos
            loadTextosPadroes(tipoEvolucaoId)
        } else {
            setTextosPadroes([])
            setTextoPadraoSelecionado('')
        }
    }, [tipoEvolucaoId])

    const loadAuxiliaryData = async () => {
        setIsLoading(true)
        try {
            const [espResponse, tipoResponse] = await Promise.all([
                listarEspecialidades(),
                listarTiposEvolucao()
            ])

            if (espResponse.sucesso) setEspecialidades(espResponse.especialidades)
            if (tipoResponse.sucesso) setTiposEvolucao(tipoResponse.tipos)
        } catch (err) {
            console.error('Erro ao carregar dados auxiliares:', err)
            setError('Erro ao carregar listas de seleção.')
        } finally {
            setIsLoading(false)
        }
    }

    const loadTextosPadroes = async (tipoId: number | string) => {
        setIsLoadingTextos(true)
        try {
            const response = await listarTextosPadroesReduzidos(tipoId)
            if (response.sucesso) {
                setTextosPadroes(response.textos)
            }
        } catch (err) {
            console.error('Erro ao carregar textos padrões:', err)
        } finally {
            setIsLoadingTextos(false)
        }
    }

    const handleTextoPadraoChange = async (sequencia: number) => {
        setTextoPadraoSelecionado(sequencia || '')
        if (!sequencia) return

        setIsLoadingTextos(true)
        try {
            const response = await obterTextoPadraoCompleto(sequencia)
            if (response.sucesso && response.texto?.texto) {
                setDescricao(response.texto.texto)
            }
        } catch (err) {
            console.error('Erro ao carregar conteúdo do texto padrão:', err)
            setError('Erro ao carregar o texto padrão selecionado.')
        } finally {
            setIsLoadingTextos(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!medico || !especialidadeId || !tipoEvolucaoId || !descricao || !dataEvolucao) {
            setError('Por favor, preencha todos os campos obrigatórios.')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await criarEvolucaoPaciente({
                dataEvolucao: new Date(dataEvolucao).toISOString(),
                medicoId: Number(medico.id),
                especialidadeId: especialidadeId,
                tipoEvolucaoId: tipoEvolucaoId,
                descricao,
                pacienteId
            })

            if (response.sucesso) {
                onSuccess()
                onClose()
            } else {
                setError(response.erro || 'Erro ao salvar evolução.')
            }
        } catch (err) {
            console.error('Erro ao salvar:', err)
            setError('Ocorreu um erro inesperado ao salvar.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nova Evolução"
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Paciente (Read-only) */}
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Paciente
                        </label>
                        <div className={`h-[42px] px-2.5 flex items-center rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                            {pacienteNome}
                        </div>
                    </div>

                    {/* Profissional */}
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Profissional <span className="text-red-500">*</span>
                        </label>
                        <AutocompletePessoa
                            value={medico?.nome || ''}
                            onChange={(_, pessoa) => setMedico(pessoa || null)}
                            placeholder="Busque pelo nome..."
                            className="w-full"
                        />
                    </div>

                    {/* Data da Evolução */}
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Data da Nota Clínica <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={dataEvolucao}
                            onChange={(e) => setDataEvolucao(e.target.value)}
                            className={`w-full p-2.5 rounded-lg border outline-none transition-colors ${
                                isDark 
                                    ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                            }`}
                            required
                        />
                    </div>

                    {/* Especialidade */}
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                            Especialidade <span className="text-red-500">*</span>
                            {isLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                        </label>
                        <select
                            value={especialidadeId}
                            onChange={(e) => setEspecialidadeId(e.target.value === '' ? '' : e.target.value)}
                            className={`w-full p-2.5 rounded-lg border outline-none transition-colors ${
                                isDark 
                                    ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                            }`}
                            required
                            disabled={isLoading}
                        >
                            <option value="">
                                {isLoading ? 'Carregando...' : 'Selecione...'}
                            </option>
                            {especialidades.map(esp => (
                                <option key={esp.id} value={esp.id}>{esp.descricao}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo de Evolução */}
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                            Nota Clínica <span className="text-red-500">*</span>
                            {isLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                        </label>
                        <select
                            value={tipoEvolucaoId}
                            onChange={(e) => setTipoEvolucaoId(e.target.value === '' ? '' : e.target.value)}
                            className={`w-full p-2.5 rounded-lg border outline-none transition-colors ${
                                isDark 
                                    ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                            }`}
                            required
                            disabled={isLoading}
                        >
                            <option value="">
                                {isLoading ? 'Carregando...' : 'Selecione...'}
                            </option>
                            {tiposEvolucao.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>
                            ))}
                        </select>
                    </div>

                    {/* Texto Padrão da Instituição */}
                    <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                            Texto Padrão da Instituição
                            {isLoadingTextos && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                        </label>
                        <select
                            value={textoPadraoSelecionado}
                            onChange={(e) => handleTextoPadraoChange(e.target.value === '' ? 0 : Number(e.target.value))}
                            className={`w-full p-2.5 rounded-lg border outline-none transition-colors ${
                                isDark 
                                    ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500 disabled:bg-gray-800 disabled:text-gray-500' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400'
                            }`}
                            disabled={isLoadingTextos || !tipoEvolucaoId || textosPadroes.length === 0}
                        >
                            <option value="">
                                {isLoadingTextos 
                                    ? 'Carregando...' 
                                    : !tipoEvolucaoId 
                                        ? 'Selecione Nota...'
                                        : textosPadroes.length === 0 
                                            ? 'Nenhum modelo' 
                                            : 'Selecione...'}
                            </option>
                            {textosPadroes.map(texto => (
                                <option key={texto.sequencia} value={texto.sequencia}>{texto.titulo}</option>
                            ))}
                        </select>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2 md:col-span-3">
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                            Conteúdo da Evolução <span className="text-red-500">*</span>
                            {isLoadingTextos && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                        </label>
                        <RichTextEditor
                            value={descricao}
                            onChange={setDescricao}
                            placeholder="Digite o conteúdo da evolução..."
                            disabled={isLoadingTextos}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDark 
                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Registrar Evolução
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
