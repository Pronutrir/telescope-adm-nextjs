'use client'

import React from 'react'
import { PageWrapper } from '@/components/layout'
import { cn } from '@/lib/utils'
import { Activity } from 'lucide-react'
import {
    useEvolucaoPaciente,
    PatientSearchCard,
    PatientInfoCard,
    EvolutionHistorySection,
    EvolutionDetailModal,
    NovaEvolucaoModal,
} from '@/components/evolucao-paciente'

const EvolucaoPacientePage = () => {
    const {
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
    } = useEvolucaoPaciente()

    return (
        <PageWrapper maxWidth="full" spacing="xl" className="pb-48">
            <div className="w-full space-y-8 min-h-[calc(100vh-12rem)]">
                {/* Premium Hero Header */}
                <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -top-8" aria-hidden="true">
                        <div className={cn(
                            'w-72 h-72 rounded-full blur-3xl',
                            isDark ? 'bg-cyan-500/5' : 'bg-cyan-500/3',
                        )} />
                    </div>
                    <div className="relative">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div
                                className="flex items-center justify-center w-10 h-10 rounded-xl"
                                style={{ backgroundColor: '#06b6d415', color: '#06b6d4' }}
                            >
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                        <h1 className={cn(
                            'text-3xl font-bold tracking-tight mb-2',
                            isDark ? 'text-white' : 'text-slate-900',
                        )}>
                            Evolução do Paciente
                        </h1>
                        <p className={cn('text-base', isDark ? 'text-slate-400' : 'text-slate-500')}>
                            Acompanhamento e registro da evolução clínica dos pacientes
                        </p>
                    </div>
                </div>

                <PatientSearchCard
                    isDark={isDark}
                    value={selectedPatient?.nome || ''}
                    onSelect={handlePatientSelect}
                />

                {selectedPatient && (
                    <div className="space-y-6">
                        <PatientInfoCard isDark={isDark} patient={selectedPatient} />

                        <EvolutionHistorySection
                            isDark={isDark}
                            evolucoes={evolucoes}
                            isLoading={isLoadingEvolutions}
                            error={error}
                            onOpenDetail={handleOpenDetail}
                            onNewEvolution={() => setIsNewEvolutionModalOpen(true)}
                        />
                    </div>
                )}

                <EvolutionDetailModal
                    isDark={isDark}
                    isOpen={isModalOpen}
                    evolucao={selectedEvolucao}
                    onClose={handleCloseDetail}
                />

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
