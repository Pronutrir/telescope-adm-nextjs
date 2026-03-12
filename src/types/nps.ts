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

// ========================
// NPS Tratamento — Tipos
// ========================

export interface IRatingTratamento {
  npsTratamentoId: string
  cliente: string
  cd_medico: string
  medico: string
  cd_convenio: string
  convenio: string
  fone: string
  quest1?: string | null   // Facilidade de agendamento (estrelas 1-5)
  quest2?: string | null   // Atendimento na recepção (estrelas 1-5)
  quest3?: string | null   // Tempo de espera (estrelas 1-5)
  quest4?: string | null   // Acolhimento e atenção da enfermagem (estrelas 1-5)
  quest5?: string | null   // Acesso a equipe médica e enfermagem (estrelas 1-5)
  quest6?: string | null   // Satisfação com o tratamento (estrelas 1-5)
  quest7?: string | null   // NPS geral (0-10)
  quest8?: string | null   // Deseja receber retorno? (1=Sim, 0=Não)
  quest9?: string | null   // Comentário livre
  data_resposta: string | null
  cd_estabelecimento: string
  reply: boolean
  classificacao: string
  subclassificacao: string
  isExpired: boolean
}

export interface IOptionsFilterTratamento {
  onlyComments?: boolean
  nota?: string[]        // Detrator/Neutro/Promotor baseado em quest6
  unidade?: string[]
  profissional?: string[]
  convenio?: string[]
}

export type IOptionsFilterTratamentoQuests = Exclude<keyof IOptionsFilterTratamento, 'onlyComments'>

// --- Quimio (NPS Tratamento - GetListNpsTratamentos) ---
// IRatingQuimio é o mesmo que IRatingTratamento (quest1-quest9)
export type IRatingQuimio = IRatingTratamento

export interface IOptionsFilterQuimio {
  onlyComments?: boolean
  unidade?: string[]
  profissional?: string[]
  convenio?: string[]
}

export type IOptionsFilterQuimioQuests = Exclude<keyof IOptionsFilterQuimio, 'onlyComments'>

export interface ICustomMessageTratamento {
  npsTratamentoId: string
  customMessage: string
  fone: string
}

export interface ICustomMessage72hTratamento {
  npsTratamentoId: string
  situacao: string
  message: string
  fone: string
}

export interface IClassificationParamsTratamento {
  classification: string
  subclassification: string | null
  npsId: string
}

export interface IClassificationResultTratamento {
  id: string
  dt_Register: string
  dt_Update?: string
  classification: string
  subclassification: string
  npsTratamentoId: string
}

// --- Dashboard form ---

export interface IDashboardFormValues {
  startDate: string | null
  endDate: string | null
  cdUnidade: string
}

// ========================
// NPS Recepcionistas — Tipos
// ========================

export interface IRatingRecepcionistas {
  id: string
  cd_pessoa_fisica: string
  name: string
  fone?: string
  email: string
  questionDesc1: string
  resp1: string
  questionDesc2?: string
  resp2?: string
  data_resposta: string | null
  reply: boolean
  classificacao: string
  cd_estabelecimento: string
  ds_estabelecimento: string
  nr_sequencia_local: string
  ds_local: string
  subclassificacao: string
  isExpired: boolean
}

export interface IResponseRecepcionistas {
  percentResponses: number
  percentNotResponses: number
  percentComents: number
  percentNotComents: number
  quizzesResponses: IRatingRecepcionistas[]
}

export interface IOptionsFilterRecepcionistas {
  onlyComments?: boolean
  resp1?: string[]
  cd_pessoa_fisica?: string[]
  unidade?: string[]
  local?: string[]
}

export type IOptionsFilterRecepcionistasQuests = Exclude<keyof IOptionsFilterRecepcionistas, 'onlyComments'>

export interface ICustomMessageRecepcionistas {
  npsId: string
  customMessage: string
  fone: string
}

export interface ICustomMessage72hRecepcionistas {
  npsId: string
  situacao: string
  message: string
  fone: string
}

export interface IClassificationParamsRecepcionistas {
  classification: string
  subclassification: string | null
  npsId: string
}

export interface IClassificationResultRecepcionistas {
  id: string
  dt_Register: string
  dt_Update?: string
  classification: string
  subclassification: string
  npsConsultaId: string
}

// ========================
// NPS Médicos — Tipos
// ========================

export interface ISatisfactionMedicos {
  muitO_SATISFEITO: number
  satisfeito: number
  indiferente: number
  insatisfeito: number
  muitO_INSATISFEITO: number
}

export interface INPSMedicoValues {
  cD_MEDICO: string
  qtD_ATENDIMENTOS: number
  mediA_TEMPO_ESPERA: number
  mediA_TEMPO_CONSULTA: number
  porcentageM_MEDICO: number
  porcentageM_GERAL: number
  satisfacaO_MEDICO: ISatisfactionMedicos
  satisfacaO_TEMPO_ESPERA: ISatisfactionMedicos
}

export interface INPSConvenioValues {
  qtD_ATENDIMENTOS: number
  mediA_TEMPO_ESPERA: number
  mediA_TEMPO_CONSULTA: number
  porcentageM_CONVENIO: number
  porcentageM_GERAL: number
  satisfacaO_CONVENIO: ISatisfactionMedicos
  satisfacaO_TEMPO_ESPERA: ISatisfactionMedicos
}
