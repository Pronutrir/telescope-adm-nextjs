import {
  BarChart3,
  Shield,
  Users,
  Hospital,
  AlarmClock,
  MessageSquare,
  Star,
  UserPlus,
  User,
  MessageCircle,
  Stethoscope,
  Layout,
  FileText
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
  // Dashboard - Rota principal
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: BarChart3,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    defaultRoute: false,
    search: true,
    component: 'Dashboard',
    visible: true,
    roles: ['default_fullstackdev', 'Administrador']
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
    defaultRoute: true,
    search: true,
    component: 'GerenciadorPDFs',
    visible: true,
    roles: ['default_fullstackdev', 'Administrador']
  },

  // Bloqueios
  {
    path: '/bloqueios',
    name: 'Bloqueios',
    icon: Shield,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'Bloqueios',
    roles: ['default_fullstackdev', 'Gerencial', 'Administrador'],
    visible: true // Exemplo: opção oculta por padrão
  },

  // Médicos Exclusivos
  {
    path: '/medicosExclusivos',
    name: 'Médicos exclusivos',
    icon: Users,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'MedicosExclusivos',
    roles: ['default_fullstackdev', 'Gerencial', 'Administrador']
  },

  // Evolução Médica
  {
    path: '/evolucaoMedica',
    name: 'Evolução Medica',
    icon: Hospital,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'EvolucaoMedica',
    roles: ['default_fullstackdev', 'Administrador', 'Doctors', 'Nursing', 'Triagem']
  },

  // Stopwatch H
  {
    path: '/stopwatchH',
    name: 'Stopwatch H',
    icon: AlarmClock,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'Stopwatch',
    roles: [
      'default_fullstackdev',
      'Administrador',
      'Gerencial',
      'Diretor',
      'Doctors',
      'Recepção',
      'Triagem',
      'Farmacia',
      'Nursing'
    ]
  },

  // Menu Principal: Pesquisas (com submenus)
  {
    type: 'menu',
    path: '/pesquisas',
    layout: '/admin',
    name: 'Pesquisas',
    icon: MessageSquare,
    iconColor: 'Primary',
    private: false,
    search: true,
    roles: [
      'default_fullstackdev',
      'Gerencial',
      'Administrador',
      'Diretor',
      'Marketing'
    ]
  },

  // Submenu: Consultas
  {
    type: 'submenu',
    submenuFor: 'Pesquisas',
    layout: '/admin',
    path: '/satisfacaoConsultas',
    name: 'Consultas',
    icon: MessageCircle,
    iconColor: 'Primary',
    private: false,
    search: true,
    component: 'AnswersReviews',
    roles: [
      'default_fullstackdev',
      'Gerencial',
      'Administrador',
      'Diretor',
      'Marketing'
    ]
  },

  // Submenu: Novos Tratamentos
  {
    type: 'submenu',
    submenuFor: 'Pesquisas',
    layout: '/admin',
    path: '/satisfacaoNovosTratamentos',
    name: 'Novos Tratamentos',
    icon: MessageCircle,
    iconColor: 'Primary',
    private: false,
    search: true,
    component: 'NpsNewTreatments',
    roles: [
      'default_fullstackdev',
      'Gerencial',
      'Administrador',
      'Diretor',
      'Marketing'
    ]
  },

  // Submenu: Recepcionistas
  {
    type: 'submenu',
    submenuFor: 'Pesquisas',
    layout: '/admin',
    path: '/satisfacaoRecepcionistas',
    name: 'Recepcionistas',
    icon: MessageCircle,
    iconColor: 'Primary',
    private: false,
    search: true,
    component: 'PesquisaRecepcionistas',
    roles: [
      'default_fullstackdev',
      'Gerencial',
      'Administrador',
      'Diretor',
      'Marketing'
    ]
  },

  // Submenu: Quimio
  {
    type: 'submenu',
    submenuFor: 'Pesquisas',
    layout: '/admin',
    path: '/satisfacaoQuimio',
    name: 'Quimio',
    icon: MessageCircle,
    iconColor: 'Primary',
    private: false,
    search: true,
    component: 'PesquisaQuimio',
    roles: [
      'default_fullstackdev',
      'Gerencial',
      'Administrador',
      'Diretor',
      'Marketing'
    ]
  },

  // Submenu: Médicos
  {
    type: 'submenu',
    submenuFor: 'Pesquisas',
    layout: '/admin',
    path: '/satisfacaoMedicos',
    name: 'Médicos',
    icon: Stethoscope,
    iconColor: 'Primary',
    private: false,
    search: true,
    component: 'NpsDashboard',
    roles: [
      'default_fullstackdev',
      'Gerencial',
      'Administrador',
      'Diretor',
      'Marketing'
    ]
  },

  // Fila Rápida
  {
    path: '/filaRapida',
    name: 'Fila Rápida',
    icon: Users,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'QuickQueue',
    roles: [
      'default_fullstackdev',
      'Administrador',
      'Gerencial',
      'Diretor',
      'Doctors',
      'Farmacia',
      'Nursing'
    ]
  },

  // Avaliações
  {
    path: '/avaliacoes',
    name: 'Avaliações',
    icon: Star,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'Avaliacoes',
    roles: [
      'default_fullstackdev',
      'Administrador',
      'Recepção',
      'Gerencial',
      'Diretor',
      'Marketing'
    ]
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
