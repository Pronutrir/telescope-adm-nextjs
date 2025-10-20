// Tipos de autenticação migrados da aplicação original

export interface IPerfis {
  id: number
  nomePerfil: string
  dataRegistro: string
  dataAtualizacao: string
  statusPerfil: string
  usuario: string
  roles: IRoles[]
}

export interface IRoles {
  id: number
  dataRegistro: string
  dataAtualizacao: string
  usuario: string
  perfisId: number
  usuarioId: number
  perfis: IPerfis
}

export interface IUser {
  ativo: boolean
  celular: string
  cnpj: string
  cpf: string
  dataAtualizacao: string
  dataExpira: string
  dataHoraValidado: string
  dataRegistro: string
  email: string
  endereco: string
  estabelecimento: number
  id: number
  integraApi: boolean
  jwtToken: string
  nomeCompleto: string
  passUpdate: boolean
  refreshToken: string
  roles: IRoles[]
  telefone: string
  tempoAcesso: number
  tipoUsuario: string
  username: string
  usuario: string
  avatar?: string
  createdAt?: string
}

export interface IAuthLoginResponse extends IUser {
  idUsuario: number
  mensagem: string
  pass: boolean
  senha: boolean
  token: string
}

export interface IUserDataType {
  username: string
  password: string
}

export interface IUserResponse {
  result: IUser
}

export interface ILoginForm {
  User: string
  Password: string
}

export interface IRecoveryForm {
  username: string
  newPassword: string
  confirmPassword: string
}

export interface IAuthState {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface INotification {
  isOpen: boolean
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
}
