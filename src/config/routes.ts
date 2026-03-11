import {
  BarChart3,
  UserPlus,
  User,
  Layout,
  FileText,
  BarChart2,
  Activity,
  ClipboardCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Tipos de rota
export type RouteType = 'menu' | 'submenu'

// Interface para uma rota
export interface Route {
  type?: RouteType
  submenuFor?: string
  name: string
  path: string
  layout: string
  private: boolean
  defaultRoute?: boolean
  search?: boolean
  icon?: LucideIcon
  iconColor: string
  roles?: string[]
  divider?: boolean
  component?: string // Nome do componente para lazy loading futuro
  visible?: boolean // Controla se a opção deve ser mostrada no menu
}

// Array de todas as rotas da aplicação
export const routes: Route[] = [
  // Dashboard - Rota principal (disponível para todos os perfis)
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: BarChart3,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    defaultRoute: true,  // ✅ Dashboard é a página inicial padrão
    search: true,
    component: 'Dashboard',
    visible: true
    // ✅ Sem restrição de roles - disponível para todos os perfis
  },

  // Biblioteca de Componentes - Componentes reutilizáveis
  {
    path: '/biblioteca-componentes',
    name: 'Biblioteca de Componentes',
    icon: Layout,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'biblioteca-componentes',
    visible: true,
    roles: ['default_fullstackdev', 'Administrador']
  },

  // Gerenciador de PDFs - Sistema duplicado para gerenciamento avançado
  {
    path: '/gerenciador-pdfs',
    name: 'Gerenciador de PDFs',
    icon: FileText,
    iconColor: 'Warning',
    layout: '/admin',
    private: false,
    defaultRoute: false,  // ✅ Não é mais a rota padrão
    search: true,
    component: 'GerenciadorPDFs',
    visible: true,
    roles: ['default_fullstackdev', 'Administrador']
  },

  // Power BI - Dashboards e Relatórios
  {
    path: '/powerbi',
    name: 'Power BI',
    icon: BarChart2,
    iconColor: 'Success',
    layout: '/admin',
    private: false,
    search: true,
    component: 'PowerBI',
    visible: true,
    roles: ['default_fullstackdev', 'Administrador', 'Gerencial', 'Diretor']
  },

  // Usuários
  {
    path: '/usuarios',
    name: 'Usuários',
    icon: UserPlus,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'Usuarios',
    roles: ['default_fullstackdev', 'Administrador']
  },

  // Evolução Paciente
  {
    path: '/evolucao-paciente',
    name: 'Evolução Paciente',
    icon: Activity,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'EvolucaoPaciente',
    visible: true,
    roles: ['default_fullstackdev', 'Administrador', 'Gerencial', 'Diretor', 'Doctors', 'Nursing']
  },

  // NPS - Net Promoter Score (página unificada)
  {
    path: '/nps',
    name: 'NPS',
    icon: ClipboardCheck,
    iconColor: 'Success',
    layout: '/admin',
    private: false,
    search: true,
    component: 'Nps',
    visible: true,
    roles: ['default_fullstackdev', 'Administrador', 'Gerencial', 'Diretor']
  },

  // Seu Perfil
  {
    path: '/profile',
    name: 'Seu Perfil',
    icon: User,
    iconColor: 'Primary',
    layout: '/admin',
    private: true,
    search: true,
    component: 'UserProfilePage',
    roles: [
      'default_fullstackdev',
      'Recepção',
      'Gerencial',
      'Administrador',
      'Convidado',
      'Diretor',
      'Marketing',
      'Doctors',
      'Nursing'
    ]
  }
]

// Função para filtrar rotas por roles do usuário
export function filterRoutesByRoles(routes: Route[], userRoles: string[] = []): Route[] {
  return routes.filter(route => {
    // Se não tem roles definidas, é pública
    if (!route.roles || route.roles.length === 0) {
      return true
    }
    
    // Verifica se o usuário tem pelo menos um dos roles necessários
    return route.roles.some(role => userRoles.includes(role))
  })
}

// Função para obter apenas os menus principais (não submenus)
export function getMainMenus(routes: Route[]): Route[] {
  return routes.filter(route => route.type !== 'submenu')
}

// Função para obter submenus de um menu específico
export function getSubmenus(routes: Route[], menuName: string): Route[] {
  return routes.filter(route => 
    route.type === 'submenu' && route.submenuFor === menuName
  )
}

// Função para verificar se uma rota tem submenus
export function hasSubmenus(routes: Route[], menuName: string): boolean {
  return getSubmenus(routes, menuName).length > 0
}

// Função para filtrar rotas visíveis
export function filterVisibleRoutes(routes: Route[]): Route[] {
  return routes.filter(route => route.visible !== false) // Por padrão, se não especificado, é visível
}

// Função combinada para filtrar por roles e visibilidade
export function filterRoutesByRolesAndVisibility(routes: Route[], userRoles: string[] = []): Route[] {
  const roleFiltered = filterRoutesByRoles(routes, userRoles)
  return filterVisibleRoutes(roleFiltered)
}

export default routes
