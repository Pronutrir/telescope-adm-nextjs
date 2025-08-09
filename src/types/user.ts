// Tipos para usuário e autenticação
export interface User {
  id: string | number
  username: string
  nomeCompleto?: string
  cpf?: string
  cnpj?: string
  email: string
  telefone?: string
  celular?: string
  endereco?: string
  estabelecimento?: number | string
  tipoUsuario?: string
  ativo?: boolean
  integraApi?: boolean
  tempoAcesso?: number
  perfil?: string
  permissoes?: string[]
  roles?: string[]
  avatar?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

// Tipos para estabelecimentos
export interface Estabelecimento {
  value: number
  label: string
  nome?: string
  cidade?: string
  estado?: string
}

// Tipos para perfis de usuário
export interface TipoUsuario {
  value: string
  label: string
  descricao?: string
  nivel?: number
}

// Interface para dados de autenticação
export interface AuthData {
  user: User
  token: string
  refreshToken?: string
  expiresIn?: number
}

// Interface para login
export interface LoginCredentials {
  username: string
  password: string
  remember?: boolean
}

// Interface para contexto de autenticação
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuth: () => Promise<void>
}

// Tipos para permissões
export interface Permission {
  id: string
  name: string
  description?: string
  resource?: string
  action?: string
  level?: number
}

// Interface para resposta da API de usuário
export interface UserResponse {
  success: boolean
  data: User
  message?: string
  errors?: Record<string, string>
}

// Interface para formulário de perfil
export interface UserProfileFormData {
  nomeCompleto: string
  email: string
  telefone?: string
  celular?: string
  endereco?: string
  estabelecimento: number | string
  cpf?: string
  cnpj?: string
}

// Tipos para notificações
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export default User
