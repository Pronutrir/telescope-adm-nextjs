import { routes, Route } from '@/config/routes'
import { IUser } from '@/lib/auth-types'

/**
 * Verifica se o usuário tem permissão para acessar uma rota específica
 */
export const hasRouteAccess = (route: Route, userRoles: string[]): boolean => {
  // Se a rota não tem roles definidas, está disponível para todos
  if (!route.roles || route.roles.length === 0) {
    return true
  }

  // Verifica se o usuário tem pelo menos uma das roles necessárias
  return route.roles.some(requiredRole => 
    userRoles.some(userRole => userRole === requiredRole)
  )
}

/**
 * Obtém a primeira rota disponível para o usuário baseada em suas permissões
 * Prioriza rotas com defaultRoute=true, depois a primeira acessível
 */
export const getFirstAvailableRoute = (user: IUser | null): string => {
  // Se não há usuário, redireciona para login
  if (!user) {
    return '/auth/login'
  }

  // Extrai as roles do usuário
  const userRoles = user.roles?.map(role => role.perfis.nomePerfil) || []

  // Filtra rotas visíveis e acessíveis (não submenus)
  const accessibleRoutes = routes.filter(route => 
    route.type !== 'submenu' && // Ignora submenus
    route.visible !== false && // Ignora rotas ocultas
    hasRouteAccess(route, userRoles)
  )

  // Se não há rotas acessíveis, redireciona para página de acesso negado
  if (accessibleRoutes.length === 0) {
    console.warn('⚠️ Nenhuma rota acessível encontrada para o usuário:', user.username)
    return '/auth/no-access'
  }

  // Tenta encontrar a rota padrão
  const defaultRoute = accessibleRoutes.find(route => route.defaultRoute === true)
  if (defaultRoute) {
    console.log('✅ Rota padrão encontrada:', defaultRoute.layout + defaultRoute.path)
    return defaultRoute.layout + defaultRoute.path
  }

  // Se não há rota padrão, usa a primeira disponível
  const firstRoute = accessibleRoutes[0]
  console.log('✅ Primeira rota disponível:', firstRoute.layout + firstRoute.path)
  return firstRoute.layout + firstRoute.path
}

/**
 * Obtém todas as rotas acessíveis para o usuário
 */
export const getAccessibleRoutes = (user: IUser | null): Route[] => {
  if (!user) {
    return []
  }

  const userRoles = user.roles?.map(role => role.perfis.nomePerfil) || []

  return routes.filter(route => 
    route.visible !== false &&
    hasRouteAccess(route, userRoles)
  )
}

/**
 * Verifica se o usuário tem acesso a uma rota específica pelo path
 */
export const canAccessRoute = (user: IUser | null, routePath: string): boolean => {
  if (!user) {
    return false
  }

  const userRoles = user.roles?.map(role => role.perfis.nomePerfil) || []
  const route = routes.find(r => (r.layout + r.path) === routePath)

  if (!route) {
    return false
  }

  return hasRouteAccess(route, userRoles)
}
