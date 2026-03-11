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

        <button
          type="button"
          onClick={handleClear}
          className={twMerge(
            'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-opacity duration-200',
            searchTerm && !disabled 
              ? 'opacity-100 cursor-pointer' 
              : 'opacity-0 pointer-events-none',
            isDark
              ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          )}
          tabIndex={searchTerm && !disabled ? 0 : -1}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && pessoas.length > 0 && (
        <div className={twMerge(
          'absolute z-[100] w-full mt-2 rounded-lg border shadow-lg max-h-60 overflow-auto scrollbar-hidden',
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
                'w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-4 group',
                'hover:pl-5',
                isDark
                  ? 'hover:bg-gray-700/80 border-b border-gray-700/50 last:border-0'
                  : 'hover:bg-blue-50/80 border-b border-gray-100 last:border-0'
              )}
            >
              <div className={twMerge(
                'p-2 rounded-full transition-colors',
                isDark ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-blue-100'
              )}>
                  <User className={twMerge(
                    'w-5 h-5',
                    isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-blue-600'
                  )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={twMerge(
                  'font-semibold text-base truncate mb-0.5',
                  isDark ? 'text-gray-100' : 'text-gray-800'
                )}>
                  {pessoa.nome}
                </div>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className={twMerge(
                        'px-1.5 py-0.5 rounded',
                        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                    )}>
                        Cód: {pessoa.id}
                    </span>
                    {pessoa.cpf && (
                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>•</span>
                    )}
                    {pessoa.cpf && (
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            CPF: {pessoa.cpf}
                        </span>
                    )}
                </div>
              </div>

              {pessoa.isFuncionario && (
                <span className={twMerge(
                  'px-2 py-1 rounded-full text-xs font-medium border',
                  isDark 
                    ? 'bg-blue-900/20 text-blue-300 border-blue-800/50' 
                    : 'bg-blue-50 text-blue-700 border-blue-100'
                )}>
                  Func
                </span>
              )}
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

    </div>
  )
}
