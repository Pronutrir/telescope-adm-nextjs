// Serviço de limpeza completa do navegador para logout seguro

export const cleanupService = {
  // Limpeza completa de todos os dados da aplicação
  async performCompleteCleanup(): Promise<void> {

    try {
      // ❌ Não limpar localStorage completamente - preservar dados não-sensíveis
      // const localStorageKeys = Object.keys(localStorage)
      // localStorageKeys.forEach(key => {
      //   localStorage.removeItem(key)
      // })
      
      // ✅ Limpar dados específicos e FORÇAR remoção de tokens residuais
      const sensitiveKeys = ['user', 'authState', 'sessionData', 'token', 'refreshToken', 'telescope_token']
      sensitiveKeys.forEach(key => {
        localStorage.removeItem(key)
      })
      
      // 2. Limpar sessionStorage
      sessionStorage.clear()
      
      // 3. Limpar todos os cookies do domínio
      const cookies = document.cookie.split(';')
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        if (name) {
          // Limpar com diferentes configurações
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure`
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict`
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.${window.location.hostname}`
        }
      })
      
      // 4. Limpar cache da aplicação
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
      }
      
      // 5. Limpar IndexedDB
      if ('indexedDB' in window) {
        const databases = ['telescope-app', 'auth-data', 'user-data']
        databases.forEach(dbName => {
          try {
            indexedDB.deleteDatabase(dbName)
          } catch (error) {
          }
        })
      }
      
      // 6. Limpar WebSQL (se suportado)
      if ('openDatabase' in window) {
        try {
          // @ts-expect-error - WebSQL está deprecated mas pode ainda existir
          const db = window.openDatabase('', '', '', '')
          if (db) {
            db.transaction((tx: { executeSql: (query: string) => void }) => {
              tx.executeSql('DROP TABLE IF EXISTS auth_data')
              tx.executeSql('DROP TABLE IF EXISTS user_data')
            })
          }
        } catch (error) {
        }
      }
      
      
    } catch (error) {
      console.error('❌ Erro durante limpeza completa:', error)
    }
  },

  // Limpeza específica apenas dos dados de autenticação
  clearAuthData(): void {
    
    // ❌ Tokens não ficam mais em localStorage (segurança)
    // ✅ Dados de auth específicos (sem tokens sensíveis)
    const authKeys = [
      'user',
      'userSession', 
      'authState',
      'lastLogin',
      'sessionExpiry'
    ]
    
    // Limpar dados específicos e FORÇAR remoção de tokens (incluindo residuais)
    authKeys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // ✅ LIMPEZA FORÇADA de tokens que possam ter sido criados por código antigo
    const tokenKeys = ['token', 'refreshToken', 'telescope_token', 'TOKEN_AUTH', 'REFRESH_TOKEN_AUTH']
    tokenKeys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Limpar sessionStorage (dados temporários OK)
    sessionStorage.clear()
    
    // Cookies de autenticação
    const authCookies = ['token', 'refreshToken', 'sessionId', 'authState', 'userSession']
    authCookies.forEach(cookieName => {
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })
    
  },

  // Verificar se ainda existem dados de sessão
  checkForRemainingData(): boolean {
    // ❌ Não verificar mais tokens em localStorage (segurança)
    const hasLocalStorageAuth = !!(
      localStorage.getItem('user')
    )
    
    const hasSessionStorageAuth = !!(
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('refreshToken') ||
      sessionStorage.getItem('user')
    )
    
    const hasAuthCookies = document.cookie.includes('token=') || 
                          document.cookie.includes('refreshToken=') ||
                          document.cookie.includes('sessionId=')
    
    const hasRemainingData = hasLocalStorageAuth || hasSessionStorageAuth || hasAuthCookies
    
    if (hasRemainingData) {
      return true
    }
    
    return false
  }
}
