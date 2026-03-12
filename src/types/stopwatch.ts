export type TMargem = 'P' | 'N'

export interface IPatientsAgendados {
  nR_SEQUENCIA: number
  cD_PESSOA_FISICA: string
  dT_AGENDA: string
  cD_ESTABELECIMENTO: number
  dT_CONFIRMACAO: string
  paciente: string
  dS_ABREV: string
}

export interface IAgendados {
  count: number
  listAgendaQuimioterapia: IPatientsAgendados[]
}

export interface IPercent {
  positive: number
  negative: number
}

export interface IPatients {
  nR_SEQ_PACIENTE: number
  cod: string
  paciente: string
  protocolo: string
  qT_TEMPO_MEDICACAO: number
  qT_TEMPO_PRE_MEDICACAO: number
  dS_LOCAL: string
  dS_PROFISSIONAL: string
  dT_REAL: string
  dT_RECEBIMENTO_MEDIC: string
  dT_ENTREGA_MEDICACAO: string
  dT_ACOLHIMENTO: string
  margeM_AC: TMargem
  miN_ATRASO_AC: number
  interV_AC_RE: number
  dT_CHEGADA: string
  margeM_RE: TMargem
  miN_ATRASO_RE: number
  interV_RE_TR: number
  dT_INICIO_TRIAGEM: string
  dT_FIM_TRIAGEM: string
  dT_APTO: string
  margeM_TR: TMargem
  miN_ATRASO_TR: number
  interV_TR_I_AC: number
  dT_ACOMODACAO: string
  iE_PRE_MEDICACAO: number
  margeM_TR_FA_SAT: TMargem
  miN_ATRASO_TR_FA_SAT: number
  interV_TR_FA_SAT: number
  dT_FA_SAT: string
  margeM_TR_FA: TMargem
  miN_ATRASO_TR_FA: number
  interV_TR_FA: number
  dT_FA_PROD: string
  margeM_FA_SAT_TT: TMargem
  miN_ATRASO_FA_SAT_TT: number
  interV_FA_SAT_TT: number
  dT_RECEBIMENTO_FAR_SAT: string
  margeM_FA_TT: TMargem
  miN_ATRASO_FA_TT: number
  interV_FA_TT: number
  dT_RECEBIMENTO_FAR_PROD: string
  dT_FARMACIA: string
  interV_TR_F_TT: number
  margeM_TT: TMargem
  miN_ATRASO_TT: number
  margeM_PRE_TT: TMargem
  miN_ATRASO_PRE_TT: number
  interV_ENF_PRE_TT: number
  dT_INICIO_PRE_TRATAMENTO: string
  interV_ENF_TT: number
  dT_INICIO_TRATAMENTO: string
  dT_FIM_TRATAMENTO: string
  dT_ALTA: string
  interV_CH_AL: number
  ac: boolean
  re: boolean
  tr: boolean
  fA_SAT: boolean
  fa: boolean
  tt: boolean
  margem: TMargem
}

export interface ISetor {
  count: number
  percent: IPercent
  patients: IPatients[]
}

export interface IFarmacia {
  satelite: ISetor
  producao: ISetor
}

export interface IDurationPatients {
  nR_SEQ_PACIENTE: number
  cod: string
  paciente: string
  dT_ACOLHIMENTO: string
  dT_ALTA?: string
  duration: number
  protocolo: string
}

export interface IDurationValues {
  count: number
  patients: IDurationPatients[]
}

export interface StopWatchHcancel {
  nR_ATENDIMENTO: number
  cD_PESSOA_FISICA: string
  nM_PESSOA_FISICA: string
  cD_ESTABELECIMENTO: number
  dT_ENTRADA: string
  nM_USUARIO: string
  cD_MEDICO_RESP: number
  dT_CANCELAMENTO: string
  nM_USUARIO_CANCELAMENTO: string
  dS_MOTIVO_CANCEL: string
}

export interface IStopwatchTodayHub {
  agendados: IAgendados
  acolhimento: ISetor
  recepcao: ISetor
  triagem: ISetor
  farmacia: IFarmacia
  acomodacao: ISetor
  tratamento: ISetor
  pre_Tratamento: ISetor
  durationPatients: IDurationValues
  stopWatchHCancel: StopWatchHcancel[]
}

export interface ReasonDelay {
  id?: number
  cod_PF: number
  nr_sequencia: number
  nomePF: string
  title: string
  body: string
  dt_registro: string
  dt_atualizacao: string
  re: boolean
  tr: boolean
  faSat: boolean
  fa: boolean
  preTT: boolean
  tt: boolean
  defaultMsn: boolean
}

export interface HistoryQTStopWatchH {
  nR_SEQ_PACIENTE: number
  cod: string
  paciente: string
  cD_PROTOCOLO: number
  protocolo: string
  qT_TEMPO_MEDICACAO: number
  qT_TEMPO_PRE_MEDICACAO: number
  dS_LOCAL: string
  dS_PROFISSIONAL: string
  dT_REAL: string
  dT_ACOLHIMENTO?: string
  interV_AC_RE: number
  dT_CHEGADA?: string
  interV_RE_TR: number
  dT_INICIO_TRIAGEM?: string
  dT_FIM_TRIAGEM?: string
  interV_TR_I_AC: number
  dT_ACOMODACAO?: string
  dT_FARMACIA?: string
  interV_TR_F_TT: number
  dT_RECEBIMENTO_FAR_SAT?: string
  interV_FA_SAT_TT: number
  dT_RECEBIMENTO_FAR_PROD?: string
  interV_FA_TT: number
  dT_RECEBIMENTO_MEDIC?: string
  dT_INICIO_PRE_TRATAMENTO?: string
  dT_ENTREGA_MEDICACAO?: string
  interV_ENF_PRE_TT: number
  dT_INICIO_TRATAMENTO?: string
  dT_FIM_TRATAMENTO?: string
  interV_ENF_TT: number
  dT_ALTA?: string
  interV_CH_AL: number
  qT_DURACAO_APLICACAO: number
  qT_DURACAO_APLICACAO_REAL: number
  duration?: number
  nR_SEQ_FILA_SENHA: number
  dT_CANCELAMENTO?: string
}

export interface DelayNotification {
  id: number
  setor: string
  paciente: string
  mensagem: string
  dt_registro: string
  confirmado: boolean
}

export type SetorKey = 'acolhimento' | 'recepcao' | 'triagem' | 'farmacia_satelite' | 'farmacia_producao' | 'acomodacao' | 'tratamento' | 'pre_tratamento'
