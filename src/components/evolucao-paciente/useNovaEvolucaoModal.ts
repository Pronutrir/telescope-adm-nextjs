'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    listarEspecialidades,
    listarTiposEvolucao,
    criarEvolucaoPaciente,
    listarTextosPadroesReduzidos,
    obterTextoPadraoCompleto,
} from '@/app/actions/tasy'
import type { Especialidade, TipoEvolucao, PessoaFisica, TextoPadrao } from '@/types/tasy'

export const useNovaEvolucaoModal = (
    isOpen: boolean,
    pacienteId: string | number,
    onSuccess: () => void,
    onClose: () => void,
) => {
    const [dataEvolucao, setDataEvolucao] = useState('')
    const [medico, setMedico] = useState<PessoaFisica | null>(null)
    const [especialidadeId, setEspecialidadeId] = useState<number | string | ''>('')
    const [tipoEvolucaoId, setTipoEvolucaoId] = useState<number | string | ''>('')
    const [descricao, setDescricao] = useState('')
    const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
    const [tiposEvolucao, setTiposEvolucao] = useState<TipoEvolucao[]>([])
    const [textosPadroes, setTextosPadroes] = useState<TextoPadrao[]>([])
    const [textoPadraoSelecionado, setTextoPadraoSelecionado] = useState<number | ''>('')
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingTextos, setIsLoadingTextos] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen) return
        setIsLoading(true)
        Promise.all([listarEspecialidades(), listarTiposEvolucao()])
            .then(([espRes, tipoRes]) => {
                if (espRes.sucesso) setEspecialidades(espRes.especialidades)
                if (tipoRes.sucesso) setTiposEvolucao(tipoRes.tipos)
            })
            .catch(() => setError('Erro ao carregar listas de seleção.'))
            .finally(() => setIsLoading(false))

        setDataEvolucao(new Date().toISOString().slice(0, 16))
        setMedico(null)
        setEspecialidadeId('')
        setTipoEvolucaoId('')
        setTextoPadraoSelecionado('')
        setTextosPadroes([])
        setDescricao('')
        setError(null)
    }, [isOpen])

    useEffect(() => {
        if (!tipoEvolucaoId) {
            setTextosPadroes([])
            setTextoPadraoSelecionado('')
            return
        }
        setIsLoadingTextos(true)
        listarTextosPadroesReduzidos(tipoEvolucaoId)
            .then((res) => { if (res.sucesso) setTextosPadroes(res.textos) })
            .catch(() => {})
            .finally(() => setIsLoadingTextos(false))
    }, [tipoEvolucaoId])

    const handleTextoPadraoChange = useCallback(async (sequencia: number) => {
        setTextoPadraoSelecionado(sequencia || '')
        if (!sequencia) return
        setIsLoadingTextos(true)
        try {
            const res = await obterTextoPadraoCompleto(sequencia)
            if (res.sucesso && res.texto?.texto) setDescricao(res.texto.texto)
        } catch {
            setError('Erro ao carregar o texto padrão selecionado.')
        } finally {
            setIsLoadingTextos(false)
        }
    }, [])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!medico || !especialidadeId || !tipoEvolucaoId || !descricao || !dataEvolucao) {
            setError('Por favor, preencha todos os campos obrigatórios.')
            return
        }
        setIsSubmitting(true)
        setError(null)
        try {
            const res = await criarEvolucaoPaciente({
                dataEvolucao: new Date(dataEvolucao).toISOString(),
                medicoId: Number(medico.id),
                especialidadeId,
                tipoEvolucaoId,
                descricao,
                pacienteId,
            })
            if (res.sucesso) { onSuccess(); onClose() }
            else setError(res.erro || 'Erro ao salvar evolução.')
        } catch {
            setError('Ocorreu um erro inesperado ao salvar.')
        } finally {
            setIsSubmitting(false)
        }
    }, [medico, especialidadeId, tipoEvolucaoId, descricao, dataEvolucao, pacienteId, onSuccess, onClose])

    return {
        dataEvolucao, setDataEvolucao,
        medico, setMedico,
        especialidadeId, setEspecialidadeId,
        tipoEvolucaoId, setTipoEvolucaoId,
        descricao, setDescricao,
        especialidades, tiposEvolucao, textosPadroes,
        textoPadraoSelecionado, handleTextoPadraoChange,
        isLoading, isLoadingTextos, isSubmitting,
        error, handleSubmit,
    }
}
