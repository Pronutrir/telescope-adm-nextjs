'use client'

import { useEffect, useState } from 'react'

/**
 * Hook que retorna true apenas após a hidratação no cliente
 * Útil para evitar problemas de SSR/CSR mismatch
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook para aguardar a hidratação completa
 * Similar ao useIsClient mas com nome mais específico
 */
export function useIsHydrated() {
  return useIsClient()
}
