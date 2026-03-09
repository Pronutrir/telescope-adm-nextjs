// ========================
// NPS Consultas — Tipos
// ========================

// --- Entidades principais ---

export interface IRating {
  npsConsultaId: string
  cliente: string
  cd_medico: string
  ds_Medico: string
  fone: string
  quest1?: string | null
  quest2?: string | null
  quest3?: string | null
  quest4?: string | null
  quest5?: string | null
  quest6?: string | null
  quest7?: string | null
  comentario: string | null
  dataResposta: string | null
  unidade: string
  cd_convenio: string
  ds_convenio: string
  cd_especialidade: string
  reply: boolean
  classificacao: string
  subclassificacao: string
  isExpired: boolean
}

export interface IDashboardValues {
  percentuaL_RESPOSTAS: number
  percentuaL_COMENTARIOS: number
  qtD_QUEIXAS_MELHORIAS: number
  percentuaL_ELOGIOS_RESPONDIDOS_24H: number
  percentuaL_ELOGIOS_RESPONDIDOS_72H: number
  percentuaL_QUEIXAS_RESPONDIDAS_24H: number
  percentuaL_QUEIXAS_RESPONDIDAS_72H: number
  qtD_NAO_RESPONDIDOS: number
}

export interface ISubclassificacaoDashboardValues {
  subclassificacao: number
  dS_SUBCLASSIFICACAO: string
  elogio: number
  queixa: number
  melhoria: number
  notificacao: number
  sugestao: number
  agradecimento: number
  neutro: number
}

// --- Filtros ---

export interface IOptionsFilter {
  onlyComments?: boolean
  quest1?: string[]
  quest2?: string[]
  quest3?: string[]
  quest4?: string[]
  nota?: string[]
  unidade?: string[]
  profissional?: string[]
  convenio?: string[]
  especialidade?: string[]
}

export type IOptionsFilterQuests = Exclude<keyof IOptionsFilter, 'onlyComments'>

export type TFilter = {
  general: boolean
  medicalTeam: boolean
  service: boolean
  parking: boolean
  infrastructure: boolean
  others: boolean
  delay: boolean
  coffeeWater: boolean
  authorizationDelay: boolean
  cleaning: boolean
  companyComunication: boolean
  services: boolean
  specialty: boolean
}

// --- Unidades ---

export interface IUnidades {
  cdUnidade: string
  dsUnidade: string
}

// --- Dados de filtro (API Tasy) ---

export interface IMedico {
  cD_PESSOA_FISICA: string
  nR_CRM: string
  nM_GUERRA: string
  iE_VINCULO_MEDICO: number
  dT_ATUALIZACAO: string
  nM_USUARIO: string
  iE_CORPO_CLINICO: string
  iE_CORPO_ASSIST: string
  cD_ESPECIALIDADE: number
  dS_ESPECIALIDADE: string
  iE_SITUACAO: string
  cD_ESTABELECIMENTO: number
  nM_FANTASIA_ESTAB: string
  iE_DIA_SEMANA: number
}

export interface IConvenio {
  cD_CONVENIO: number
  coD_CONVENIO: string
  dS_CONVENIO: string
  cD_PLANO: string
  dS_PLANO: string
  iE_TIPO_CONVENIO: number
  cD_CGC: string
  cD_MEDICO: number
  cD_CATEGORIA: number
  dS_CATEGORIA: string
  vL_MEDICO: number
  nM_PESSOA_FISICA: string
  nM_GUERRA: string
  iE_SITUACAO: string
  dS_ESPECIALIDADE: string
  cD_ESTABELECIMENTO: number
  iE_PERMITE: string
  cD_AGENDA: number
  cD_ESPECIALIDADE: number
  cD_TIPO_ACOMODACAO: number
}

export interface IEspecialidade {
  cD_ESPECIALIDADE: number
  dS_ESPECIALIDADE: string
  dT_ATUALIZACAO: string
  iE_SITUACAO: string
  cD_ESPECIALIDADE_AGRUP: number
  nM_USUARIO: string
}

// --- Classificação / Domínio ---

export interface IDominio {
  dominio_Id: number
  vl_Dominio: string
  ds_Valor_Dominio: string
  dt_Created: string
  ie_Situacao: string
  ref_Valor_Dominio?: string
}

export interface IClassificationResult {
  id: string
  dt_Register: string
  dt_Update?: string
  classification: string
  subclassification: string
  npsConsultaId: string
}

// --- Payloads de API ---

export interface ICustomMessage {
  npsConsultaId: string
  customMessage: string
  fone: string
}

export interface ICustomMessage72h {
  npsConsultaId: string
  situacao: string
  message: string
  fone: string
}

export interface IClassificationParams {
  classification: string
  subclassification: string | null
  npsId: string
}

// --- Modal ---

export type DialogType = 'classification' | 'answer' | 'answer72h' | 'default'

export interface ModalControl {
  open: boolean
  title: string
  type: DialogType
}

// --- Tabela ---

export type Order = 'asc' | 'desc'

export interface NpsColumn<T> {
  id: string
  label: string
  minWidth?: number
  maxWidth?: number
  sticky?: boolean
  stickyLeft?: number
  stickyRight?: number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  sortKey?: keyof T
  renderHeader?: () => React.ReactNode
  renderValue?: (row: T) => React.ReactNode
}

// --- Dashboard form ---

export interface IDashboardFormValues {
  startDate: string | null
  endDate: string | null
  cdUnidade: string
}
