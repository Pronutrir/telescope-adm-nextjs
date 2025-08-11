import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

// Tipos para os ícones (Material Icons ou Lucide)
export type IconType = LucideIcon | React.ComponentType<{ className?: string; size?: number | string }>

// Interface para um item de menu
export interface MenuItem {
  id: string
  name: string
  path: string
  icon?: IconType
  iconColor?: string
  badge?: string | number
  children?: MenuItem[]
  description?: string
  disabled?: boolean
  external?: boolean
  target?: '_blank' | '_self'
}

// Grupos de menus para organização
export interface MenuGroup {
  id: string
  title?: string
  items: MenuItem[]
  divider?: boolean
}

// Interface para navegação completa
export interface NavigationConfig {
  groups: MenuGroup[]
}

// Interface para breadcrumbs
export interface BreadcrumbItem {
  name: string
  path?: string
  icon?: IconType
}

// Interface para notificações
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

// Interface para perfil do usuário no layout
export interface UserProfile {
  name: string
  email: string
  avatar?: string
  role: string
  lastLogin?: Date
}

// Props para componentes de layout
export interface LayoutProps {
  children: ReactNode
}

export interface NavbarProps {
  className?: string
}

export interface SidebarProps {
  className?: string
}

export interface ContentProps {
  children: ReactNode
  className?: string
}

// Estados do layout
export interface LayoutState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  isMobile: boolean
  searchOpen: boolean
  notificationsOpen: boolean
}

// Interface para configurações do layout
export interface LayoutConfig {
  sidebar: {
    defaultOpen: boolean
    collapsible: boolean
    width: {
      expanded: number
      collapsed: number
    }
  }
  navbar: {
    height: number
    fixed: boolean
  }
  search: {
    enabled: boolean
    placeholder: string
  }
  notifications: {
    enabled: boolean
    maxVisible: number
  }
}
