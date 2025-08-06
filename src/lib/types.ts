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

export type IOptionsFilterQuests = Exclude<keyof IOptionsFilter, "onlyComments">
export type Order = "asc" | "desc"

export interface Column<T> {
  id: keyof T | "action"
  label: string
  align: "left" | "center" | "right"
  type: "string" | "action"
  renderHeader?: (props: { column: Column<T> }) => React.ReactNode
  renderValue?: (value: T) => React.ReactNode
}
