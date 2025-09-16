/**
 * Hook customizado para gerenciar usuários do UserShield
 * Baseado no padrão usado no telescopeContext.tsx
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { userShieldService, UserShieldUser, UserShieldProfile, UserShieldRole } from '@/services/userShieldService'

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

  /**
   * Listar usuários do UserShield
   */
  const listarUsuarios = useCallback(async () => {
    setLoadingUsuarios(true)
    setErrorUsuarios(null)
    
    try {
      const data = await userShieldService.listarUsuarios()
      setUsuarios(data)
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

  // Carregar dados iniciais
  useEffect(() => {
    listarUsuarios()
  }, [listarUsuarios])

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
