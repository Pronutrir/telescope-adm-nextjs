'use client'

import React, { useState, useCallback } from 'react'
import { usePacientes, IPaciente } from '@/hooks/usePacientes'
import { Input } from '@/components/ui/Input'
import { Search, X, Loader2 } from 'lucide-react'

interface IAutocompletePacientesProps {
    value?: IPaciente | null
    onChange: (paciente: IPaciente | null) => void
    disabled?: boolean
    error?: boolean
    placeholder?: string
}

const AutocompletePacientes: React.FC<IAutocompletePacientesProps> = ({
    value,
    onChange,
    disabled = false,
    error = false,
    placeholder = 'Digite o nome do paciente...'
}) => {
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ isOpen, setIsOpen ] = useState(false)

    // Usar o hook para buscar pacientes
    const {
        data: pacientes = [],
        isLoading,
        isFetching,
        error: searchError
    } = usePacientes({
        searchTerm,
        enabled: searchTerm.length >= 2
    })

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSearchTerm(newValue)

        if (!newValue && value) {
            onChange(null)
            setIsOpen(false)
        } else if (newValue.length >= 2) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }, [ value, onChange ])

    const handleSelectPaciente = useCallback((paciente: IPaciente) => {
        setSearchTerm(paciente.nM_PESSOA_FISICA)
        setIsOpen(false)
        onChange(paciente)
    }, [ onChange ])

    const handleClear = useCallback(() => {
        setSearchTerm('')
        setIsOpen(false)
        onChange(null)
    }, [ onChange ])

    const shouldShowDropdown = isOpen && searchTerm.length >= 2 && (pacientes.length > 0 || isLoading || searchError)

    return (
        <div className="relative w-full">
            <div className="relative">
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    error={error ? 'Campo obrigatório' : undefined}
                    className="pr-16"
                />

                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                            disabled={disabled}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    {isFetching ? (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : (
                        <Search className="w-4 h-4 text-gray-400" />
                    )}
                </div>
            </div>

            {shouldShowDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {isLoading && (
                        <div className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Buscando pacientes...
                            </div>
                        </div>
                    )}

                    {searchError && (
                        <div className="p-3 text-center text-sm text-red-600 dark:text-red-400">
                            Erro ao buscar pacientes. Tente novamente.
                        </div>
                    )}

                    {!isLoading && !searchError && pacientes.length === 0 && searchTerm.length >= 2 && (
                        <div className="p-3 text-center text-sm text-gray-600 dark:text-gray-400">
                            Nenhum paciente encontrado
                        </div>
                    )}

                    {!isLoading && !searchError && pacientes.length > 0 && (
                        <ul className="py-1">
                            {pacientes.map((paciente) => (
                                <li key={paciente.cD_PESSOA_FISICA}>
                                    <button
                                        type="button"
                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => handleSelectPaciente(paciente)}
                                        disabled={disabled}
                                    >
                                        <div className="space-y-1">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {paciente.nM_PESSOA_FISICA}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Atendimento: {paciente.nR_ATENDIMENTO || 'N/A'}
                                                {paciente.dT_NASCIMENTO && (
                                                    <span className="ml-2">
                                                        • Nascimento: {new Date(paciente.dT_NASCIMENTO).toLocaleDateString('pt-BR')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default AutocompletePacientes
