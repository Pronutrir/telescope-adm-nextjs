'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Search, User, Loader2, X, AlertCircle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { PessoaFisica } from '@/types/tasy'
import { buscarPessoaFisica } from '@/app/actions/tasy'

interface AutocompletePessoaProps {
  value: string
  onChange: (nome: string, pessoa?: PessoaFisica) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

/**
 * 🔍 Componente de Autocomplete para buscar Pessoa Física no TASY
 * 
 * Features:
 * - Busca via Server Action (seguro + rápido)
 * - Debounce (500ms)
 * - Dropdown com resultados
 * - Mostra: Nome, Código, CPF, Badge funcionário
 * - Feedback visual de seleção
 * - Dark/Light mode
 */
export const AutocompletePessoa: React.FC<AutocompletePessoaProps> = ({
  value,
  onChange,
  placeholder = 'Digite o nome para buscar...',
  required = false,
  disabled = false,
  className = ''
}) => {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState(value)
  const [pessoas, setPessoas] = useState<PessoaFisica[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedPessoa, setSelectedPessoa] = useState<PessoaFisica | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isSelectionRef = useRef(false) // Flag para indicar se a mudança vem de uma seleção

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Buscar pessoas via Server Action (debounce)
  useEffect(() => {
    // Se a mudança vem de uma seleção, não fazer busca
    if (isSelectionRef.current) {
      isSelectionRef.current = false
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (searchTerm.length < 3) {
      setPessoas([])
      setShowDropdown(false)
      setError(null)
      return
    }

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        console.log(`🔍 [AutocompletePessoa] Buscando via Server Action: ${searchTerm}`)
        
        const resultado = await buscarPessoaFisica(searchTerm)
        
        if (resultado.sucesso) {
          setPessoas(resultado.pessoas)
          setShowDropdown(true)
          console.log(`✅ [AutocompletePessoa] ${resultado.total} pessoas encontradas`)
        } else {
          console.error(`❌ [AutocompletePessoa] Erro: ${resultado.erro}`)
          setError(resultado.erro || 'Erro ao buscar pessoas')
          setPessoas([])
        }
      } catch (error) {
        console.error('❌ [AutocompletePessoa] Erro ao buscar pessoas:', error)
        setError('Erro ao buscar pessoas')
        setPessoas([])
      } finally {
        setIsLoading(false)
      }
    }, 500) // Debounce de 500ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setSelectedPessoa(null)
    setError(null)
    onChange(newValue)
  }

  const handleSelectPessoa = (pessoa: PessoaFisica) => {
    isSelectionRef.current = true // Marcar que é uma seleção, não digitação
    setSearchTerm(pessoa.nome)
    setSelectedPessoa(pessoa)
    setShowDropdown(false)
    setError(null)
    onChange(pessoa.nome, pessoa)
  }

  const handleClear = () => {
    setSearchTerm('')
    setSelectedPessoa(null)
    setPessoas([])
    setShowDropdown(false)
    setError(null)
    onChange('')
  }

  return (
    <div className={twMerge('relative', className)} ref={dropdownRef}>
      {/* Input com ícones */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className={twMerge(
              'w-5 h-5 animate-spin',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )} />
          ) : (
            <Search className={twMerge(
              'w-5 h-5',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )} />
          )}
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={twMerge(
            'w-full pl-10 pr-10 py-2.5 rounded-lg border transition-colors',
            'focus:outline-none focus:ring-2',
            isDark
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500',
            disabled && 'opacity-50 cursor-not-allowed',
            selectedPessoa && 'border-green-500',
            error && 'border-red-500'
          )}
        />

        {searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={twMerge(
              'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full',
              isDark
                ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && pessoas.length > 0 && (
        <div className={twMerge(
          'absolute z-50 w-full mt-2 rounded-lg border shadow-lg max-h-60 overflow-auto',
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        )}>
          {pessoas.map((pessoa) => (
            <button
              key={pessoa.id}
              type="button"
              onClick={() => handleSelectPessoa(pessoa)}
              className={twMerge(
                'w-full px-4 py-3 text-left transition-colors flex items-start gap-3',
                'hover:bg-opacity-50 first:rounded-t-lg last:rounded-b-lg',
                isDark
                  ? 'hover:bg-gray-700 border-b border-gray-700 last:border-0'
                  : 'hover:bg-gray-50 border-b border-gray-100 last:border-0'
              )}
            >
              <User className={twMerge(
                'w-5 h-5 mt-0.5 flex-shrink-0',
                isDark ? 'text-gray-400' : 'text-gray-500'
              )} />
              <div className="flex-1 min-w-0">
                <div className={twMerge(
                  'font-medium truncate',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {pessoa.nome}
                </div>
                <div className={twMerge(
                  'text-sm mt-1',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Código: {pessoa.id}
                  {pessoa.cpf && ` • CPF: ${pessoa.cpf}`}
                  {pessoa.isFuncionario && (
                    <span className={twMerge(
                      'ml-2 px-2 py-0.5 rounded text-xs font-medium',
                      isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                    )}>
                      Funcionário
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className={twMerge(
          'absolute z-50 w-full mt-2 rounded-lg border shadow-lg p-4',
          isDark
            ? 'bg-red-900/20 border-red-700'
            : 'bg-red-50 border-red-300'
        )}>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className={twMerge(
              'w-4 h-4 flex-shrink-0',
              isDark ? 'text-red-400' : 'text-red-600'
            )} />
            <span className={twMerge(
              isDark ? 'text-red-300' : 'text-red-700'
            )}>
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {showDropdown && pessoas.length === 0 && !isLoading && !error && searchTerm.length >= 3 && (
        <div className={twMerge(
          'absolute z-50 w-full mt-2 rounded-lg border shadow-lg p-4 text-center',
          isDark
            ? 'bg-gray-800 border-gray-700 text-gray-400'
            : 'bg-white border-gray-200 text-gray-600'
        )}>
          Nenhuma pessoa encontrada com {searchTerm}
        </div>
      )}

      {/* Informação da pessoa selecionada */}
      {selectedPessoa && (
        <div className={twMerge(
          'mt-2 p-3 rounded-lg border flex items-center gap-2',
          isDark
            ? 'bg-green-900/20 border-green-700 text-green-400'
            : 'bg-green-50 border-green-300 text-green-700'
        )}>
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            Pessoa selecionada: {selectedPessoa.nome} (Cód: {selectedPessoa.id})
          </span>
        </div>
      )}
    </div>
  )
}
