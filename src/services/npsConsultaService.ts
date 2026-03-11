import { Api, ApiNotify } from '@/lib/api'
import type {
  IRating,
  IDashboardValues,
  ISubclassificacaoDashboardValues,
  ICustomMessage,
  ICustomMessage72h,
  IClassificationParams,
  IMedico,
  IConvenio,
  IEspecialidade,
  IDominio,
  IClassificationResult,
} from '@/types/nps'

// --- Listagem NPS ---

export async function getListaNps(queryDate: string): Promise<IRating[]> {
  try {
    const { data } = await ApiNotify.get<IRating[]>(
      `Nps/GetListNpsConsulta?querydate=${queryDate}`,
    )
    return data ?? []
  } catch (err: any) {
    if (err?.response?.status === 404) return []
    throw err
  }
}

// --- Envio de mensagens ---

export async function postDefaultMessages(items: IRating[]) {
  return ApiNotify.post(
    'Nps/SendDefaultNpsResponseAgendaConsultaMessageWhatsapp',
    items.map((item) => ({
      npsConsultaId: item.npsConsultaId,
      fone: item.fone,
    })),
  )
}

export async function postCustomMessage({ npsConsultaId, customMessage, fone }: ICustomMessage) {
  return ApiNotify.post('Nps/send/SendWhatsResponseConsultaNpsAppMessage', {
    npsId: npsConsultaId,
    recipientPhoneNumber: fone,
    message: customMessage,
  })
}

export async function postCustomMessage72h({ npsConsultaId, situacao, message, fone }: ICustomMessage72h) {
  return ApiNotify.post('Nps/SendTemplateNpsResponseAgendaConsultaMessageWhatsapp', [
    { npsConsultaId, situacao, message, fone },
  ])
}

// --- Classificação ---

export async function postClassification({ classification, subclassification, npsId }: IClassificationParams) {
  return ApiNotify.post('NpsClassification/AddClassification', {
    classification,
    subclassification,
    npsConsultaId: npsId,
  })
}

export async function getClassificationsTypes(): Promise<IDominio[]> {
  const { data } = await ApiNotify.get<IDominio[]>('ValorDominio/1')
  return data
}

export async function getSubclassifications(refValorDominio: string): Promise<IDominio[]> {
  const { data } = await ApiNotify.get<IDominio[]>(
    `ValorDominio/GetByIdAndRefValorDominio/2,${refValorDominio}`,
  )
  return data
}

export async function getClassificationHistory(npsConsultaId: string): Promise<IClassificationResult[]> {
  const { data } = await ApiNotify.get<IClassificationResult[]>(
    `NpsClassification/ListClassificationsByNpsConsultaId/${npsConsultaId}`,
  )
  return data
}

// --- Dashboard ---

export async function getClassificationsDashboardValues(
  startDate: string,
  endDate: string,
  cdEstabelecimento: number,
): Promise<IDashboardValues | null> {
  try {
    const { data } = await ApiNotify.get<IDashboardValues>(
      `NpsClassification/GetClassificationDashboardValues?startDate=${startDate}&endDate=${endDate}&estabelecimento=${cdEstabelecimento}`,
    )
    return data
  } catch {
    return null
  }
}

export async function getSubclassificationsDashboardValues(
  startDate: string,
  endDate: string,
  cdEstabelecimento: number,
): Promise<ISubclassificacaoDashboardValues[]> {
  try {
    const { data } = await ApiNotify.get<ISubclassificacaoDashboardValues[]>(
      `NpsClassification/GetSubclassificationDashboardValues?startDate=${startDate}&endDate=${endDate}&estabelecimento=${cdEstabelecimento}`,
    )
    return data
  } catch {
    return []
  }
}

// --- Filtros (Tasy) ---

interface IResultMedicos {
  result: IMedico[]
}

interface IResultConvenios {
  result: IConvenio[]
}

interface IResultEspecialidades {
  result: IEspecialidade[]
}

export async function getMedicos(): Promise<IMedico[]> {
  try {
    const { data: { result } } = await Api.get<IResultMedicos>('Medicos/FiltrarMedicosEmGeral')
    return result
  } catch {
    return []
  }
}

export async function getConvenios(): Promise<IConvenio[]> {
  try {
    const { data: { result } } = await Api.get<IResultConvenios>('Convenios')
    return result
  } catch {
    return []
  }
}

export async function getEspecialidades(): Promise<IEspecialidade[]> {
  try {
    const { data: { result } } = await Api.get<IResultEspecialidades>(
      'EspecialidadeMedica/ListarTodasEspecialidadesMedicas',
    )
    return result
  } catch {
    return []
  }
}
