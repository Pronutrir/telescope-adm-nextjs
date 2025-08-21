import {
  BarChart3,
  Shield,
  Gavel,
  Users,
  Settings,
  Hospital,
  Droplets,
  UsersRound,
  AlarmClock,
  MessageSquare,
  Star,
  UserPlus,
  User,
  Siren,
  MessageCircle,
  Stethoscope,
  Layout,
  TrendingUp,
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
    defaultRoute: true,
    search: true,
    component: 'Dashboard',
    visible: true
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
    visible: true
  },

  // Biblioteca de PDFs - Gerenciamento de documentos
  {
    path: '/biblioteca-pdfs',
    name: 'Biblioteca de PDFs',
    icon: FileText,
    iconColor: 'Success',
    layout: '/admin',
    private: false,
    search: true,
    component: 'BibliotecaPDFs',
    visible: true
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
    visible: false // Exemplo: opção oculta por padrão
  },

  // Regra Médica (Primeira Consulta)
  {
    path: '/firstDoctorConsultationRule',
    name: 'Regra Médica',
    icon: Gavel,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'firstDoctorConsultationRule',
    roles: ['default_fullstackdev', 'Gerencial', 'Administrador'],
    visible: true
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

  // Gerenciador
  {
    path: '/gerenciador',
    name: 'Gerenciador',
    icon: Settings,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'Gerenciador',
    roles: ['default_fullstackdev', 'Administrador']
  },

  // Notify Dashboards (Power BI)
  {
    path: '/notifydashboard',
    name: 'Notify Dashboards',
    icon: BarChart3,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'NotifyDashboards',
    roles: ['default_fullstackdev', 'Administrador', 'Diretor', 'Gerencial']
  },

  // Alertas Escala NEWS
  {
    path: '/escalaNews',
    name: 'Alertas Escala NEWS',
    icon: Siren,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'EscalaNews',
    roles: ['default_fullstackdev', 'Doctors', 'Nursing', 'Triagem']
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
    roles: ['default_fullstackdev', 'Doctors', 'Nursing', 'Triagem']
  },

  // Agendas de Quimio
  {
    path: '/agendaQuimioterapia',
    name: 'Agendas de Quimio',
    icon: Droplets,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'AgendaQuimioterapia',
    roles: ['Doctors', 'Nursing', 'default_fullstackdev']
  },

  // Acompanhantes
  {
    path: '/acompanhantes',
    name: 'Acompanhantes',
    icon: UsersRound,
    iconColor: 'Primary',
    layout: '/admin',
    private: false,
    search: true,
    component: 'AcompanhantesPacientes',
    roles: ['Gerencial', 'Administrador', 'Diretor', 'default_fullstackdev']
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
      'Gerencial',
      'Administrador',
      'Diretor',
      'default_fullstackdev',
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
      'Gerencial',
      'Administrador',
      'Diretor',
      'default_fullstackdev',
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
      'Recepção',
      'Gerencial',
      'Administrador',
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
