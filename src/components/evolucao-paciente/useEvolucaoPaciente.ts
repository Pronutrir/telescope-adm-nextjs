'use client'

import { useState, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { listarEvolucoesPaciente } from '@/app/actions/tasy'
import type { PessoaFisica, EvolucaoPaciente } from '@/types/tasy'

export const useEvolucaoPaciente = () => {
    const { isDark } = useTheme()
    const [selectedPatient, setSelectedPatient] = useState<PessoaFisica | null>(null)
    const [evolucoes, setEvolucoes] = useState<EvolucaoPaciente[]>([])
    const [isLoadingEvolutions, setIsLoadingEvolutions] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedEvolucao, setSelectedEvolucao] = useState<EvolucaoPaciente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isNewEvolutionModalOpen, setIsNewEvolutionModalOpen] = useState(false)

    const fetchEvolutions = useCallback(async (patientId: string) => {
        setIsLoadingEvolutions(true)
        setError(null)
        setEvolucoes([])
        try {
            const response = await listarEvolucoesPaciente(patientId)
            if (response.sucesso) {
                setEvolucoes(response.evolucoes)
            } else {
                setError(response.erro || 'Erro ao buscar evoluções')
            }
        } catch {
            setError('Ocorreu um erro inesperado ao buscar as evoluções.')
        } finally {
            setIsLoadingEvolutions(false)
        }
    }, [])

    const handlePatientSelect = useCallback((nome: string, pessoa?: PessoaFisica) => {
        if (pessoa) {
            setSelectedPatient(pessoa)
            fetchEvolutions(pessoa.id)
        } else {
            setSelectedPatient(null)
            setEvolucoes([])
            setError(null)
        }
    }, [fetchEvolutions])

    const handleOpenDetail = useCallback((evolucao: EvolucaoPaciente) => {
        setSelectedEvolucao(evolucao)
        setIsModalOpen(true)
    }, [])

    const handleCloseDetail = useCallback(() => {
        setIsModalOpen(false)
        setTimeout(() => setSelectedEvolucao(null), 300)
    }, [])

    const handleNewEvolutionSuccess = useCallback(() => {
        if (selectedPatient) fetchEvolutions(selectedPatient.id)
    }, [selectedPatient, fetchEvolutions])

    return {
        isDark,
        selectedPatient,
        evolucoes,
        isLoadingEvolutions,
        error,
        selectedEvolucao,
        isModalOpen,
        isNewEvolutionModalOpen,
        setIsNewEvolutionModalOpen,
        handlePatientSelect,
        handleOpenDetail,
        handleCloseDetail,
        handleNewEvolutionSuccess,
    }
}
