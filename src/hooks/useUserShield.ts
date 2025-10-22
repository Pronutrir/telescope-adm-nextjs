/**
 * Hook customizado para gerenciar usuários do UserShield
 * Baseado no padrão usado no telescopeContext.tsx
 * 
 * Features:
 * - Cache global de requisições em andamento (previne chamadas duplicadas)
 * - Controle de inicialização para evitar múltiplas chamadas
 * - Logs de performance detalhados
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { userShieldService, UserShieldUser, UserShieldProfile, UserShieldRole } from '@/services/userShieldService'

// Cache global de promises em andamento (deduplicação)
const pendingRequests = new Map<string, Promise<any>>()

// Função helper para cachear requisições
async function getCachedRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  // Se já existe uma requisição em andamento, retorna ela
  if (pendingRequests.has(key)) {
    console.log(`🔄 [Cache] Requisição duplicada detectada para: ${key}`)
    return pendingRequests.get(key) as Promise<T>
  }

  // Cria nova requisição e adiciona ao cache
  console.log(`🚀 [Cache] Nova requisição iniciada: ${key}`)
  const promise = requestFn()
    .finally(() => {
      // Remove do cache quando completar (sucesso ou erro)
      pendingRequests.delete(key)
      console.log(`✅ [Cache] Requisição finalizada: ${key}`)
    })

  pendingRequests.set(key, promise)
  return promise
}

export interface UseUserShieldReturn {
  // Dados
  usuarios: UserShieldUser[]
  perfis: UserShieldProfile[]
  roles: UserShieldRole[]
  
  // Estados de loading
  loadingUsuarios: boolean
  loadingPerfis: boolean
  loadingRoles: boolean
  
  // Funções
  listarUsuarios: () => Promise<void>
  listarPerfis: () => Promise<void>
  listarRoles: (userName?: string) => Promise<void>
  buscarUsuarios: (searchTerm: string) => Promise<UserShieldUser[]>
  
  // Estados de erro
  errorUsuarios: string | null
  errorPerfis: string | null
  errorRoles: string | null
  
  // Funções utilitárias
  refreshAll: () => Promise<void>
  clearErrors: () => void
}

export function useUserShield(): UseUserShieldReturn {
  // Estados dos dados
  const [usuarios, setUsuarios] = useState<UserShieldUser[]>([])
  const [perfis, setPerfis] = useState<UserShieldProfile[]>([])
  const [roles, setRoles] = useState<UserShieldRole[]>([])
  
  // Estados de loading
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)
  const [loadingPerfis, setLoadingPerfis] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(false)
  
  // Estados de erro
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null)
  const [errorPerfis, setErrorPerfis] = useState<string | null>(null)
  const [errorRoles, setErrorRoles] = useState<string | null>(null)
  
  // Flag para evitar carregamentos duplicados
  const [initialized, setInitialized] = useState(false)

  /**
   * Listar usuários do UserShield (com cache otimizado e deduplicação)
   */
  const listarUsuarios = useCallback(async () => {
    const startTime = Date.now()
    console.log('🚀 [PERF Frontend] Iniciando busca de usuários...')
    
    setLoadingUsuarios(true)
    setErrorUsuarios(null)
    
    try {
      // Usar cache global para evitar requisições duplicadas
      const data = await getCachedRequest('usuarios', async () => {
        const fetchStart = Date.now()
        // Usar API com dados reais da UserShield
        const response = await fetch('/api/usershield/usuarios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(`⏱️ [PERF Frontend] Fetch API: ${Date.now() - fetchStart}ms`)

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`)
        }

        const parseStart = Date.now()
        const result = await response.json()
        console.log(`⏱️ [PERF Frontend] Parse JSON: ${Date.now() - parseStart}ms`)
        return result
      })
      
      if (data.success) {
        const setStateStart = Date.now()
        setUsuarios(data.result || [])
        console.log(`⏱️ [PERF Frontend] setState: ${Date.now() - setStateStart}ms`)
        console.log(`🏁 [PERF Frontend] TEMPO TOTAL: ${Date.now() - startTime}ms`)
        console.log('✅ Usuários carregados:', data.result?.length || 0)
      } else {
        throw new Error(data.error || 'Erro desconhecido')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar usuários'
      setErrorUsuarios(errorMessage)
      console.error('Erro ao listar usuários:', error)
    } finally {
      setLoadingUsuarios(false)
    }
  }, [])

  /**
   * Listar perfis do UserShield
   */
  const listarPerfis = useCallback(async () => {
    setLoadingPerfis(true)
    setErrorPerfis(null)
    
    try {
      const data = await userShieldService.listarPerfis()
      setPerfis(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar perfis'
      setErrorPerfis(errorMessage)
      console.error('Erro ao listar perfis:', error)
    } finally {
      setLoadingPerfis(false)
    }
  }, [])

  /**
   * Listar roles do UserShield
   */
  const listarRoles = useCallback(async (userName?: string) => {
    setLoadingRoles(true)
    setErrorRoles(null)
    
    try {
      const data = await userShieldService.listarRoles(userName)
      setRoles(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar roles'
      setErrorRoles(errorMessage)
      console.error('Erro ao listar roles:', error)
    } finally {
      setLoadingRoles(false)
    }
  }, [])

  /**
   * Buscar usuários por termo
   */
  const buscarUsuarios = useCallback(async (searchTerm: string): Promise<UserShieldUser[]> => {
    try {
      return await userShieldService.buscarUsuarios(searchTerm)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return usuarios // Retorna lista atual em caso de erro
    }
  }, [usuarios])

  /**
   * Atualizar todos os dados
   */
  const refreshAll = useCallback(async () => {
    await Promise.all([
      listarUsuarios(),
      listarPerfis(),
      listarRoles()
    ])
  }, [listarUsuarios, listarPerfis, listarRoles])

  /**
   * Limpar todos os erros
   */
  const clearErrors = useCallback(() => {
    setErrorUsuarios(null)
    setErrorPerfis(null)
    setErrorRoles(null)
  }, [])

  // Carregar dados iniciais APENAS UMA VEZ
  useEffect(() => {
    if (!initialized) {
      console.log('🔄 [useUserShield] Carregamento inicial de usuários')
      setInitialized(true)
      listarUsuarios()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Array vazio = executa apenas uma vez

  return {
    // Dados
    usuarios,
    perfis,
    roles,
    
    // Estados de loading
    loadingUsuarios,
    loadingPerfis,
    loadingRoles,
    
    // Funções
    listarUsuarios,
    listarPerfis,
    listarRoles,
    buscarUsuarios,
    
    // Estados de erro
    errorUsuarios,
    errorPerfis,
    errorRoles,
    
    // Funções utilitárias
    refreshAll,
    clearErrors
  }
}
