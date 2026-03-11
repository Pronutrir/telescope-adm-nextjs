import { Api, ApiNotify } from '@/lib/api'
import type {
  IRatingTratamento,
  IRatingQuimio,
  ICustomMessageTratamento,
  ICustomMessage72hTratamento,
  IClassificationParamsTratamento,
  IClassificationResultTratamento,
  IDashboardValues,
  ISubclassificacaoDashboardValues,
  IMedico,
  IConvenio,
  IDominio,
} from '@/types/nps'

// --- Listagem NPS ---

export async function getListaNps(startDate: string, endDate: string): Promise<IRatingTratamento[]> {
  try {
    const { data } = await ApiNotify.get<IRatingTratamento[]>(
      `Nps/GetListNpsTratamentosNovos?start=${startDate}&end=${endDate}&PageNumber=1&RowsOfPage=100`,
    )
    return data ?? []
  } catch (err: any) {
    if (err?.response?.status === 404) return []
    throw err
  }
}

// --- Envio de mensagens ---

export async function postDefaultMessages(items: IRatingTratamento[]) {
  return ApiNotify.post(
    'Nps/SendDefaultNpsResponseTratamentoMessageWhatsapp',
    items.map((item) => ({
      npsTratamentoId: item.npsTratamentoId,
      fone: item.fone,
    })),
  )
}

export async function postCustomMessage({ npsTratamentoId, customMessage, fone }: ICustomMessageTratamento) {
  return ApiNotify.post('Nps/send/SendWhatsResponseTratamentoNpsAppMessage', {
    npsId: npsTratamentoId,
    recipientPhoneNumber: fone,
    message: customMessage,
  })
}

export async function postCustomMessage72h({ npsTratamentoId, situacao, message, fone }: ICustomMessage72hTratamento) {
  return ApiNotify.post('Nps/SendTemplateNpsResponseTratamentoMessageWhatsapp', [
    { npsTratamentoId, situacao, message, fone },
  ])
}

// --- Classificação ---

export async function postClassification({ classification, subclassification, npsId }: IClassificationParamsTratamento) {
  return ApiNotify.post('NpsClassification/AddClassification', {
    classification,
    subclassification,
    npsTratamentoId: npsId,
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

export async function getClassificationHistory(npsTratamentoId: string): Promise<IClassificationResultTratamento[]> {
  const { data } = await ApiNotify.get<IClassificationResultTratamento[]>(
    `NpsClassification/ListClassificationsByNpsTratamentoId/${npsTratamentoId}`,
  )
  return data
}

// --- Listagem Quimio (GetListNpsTratamentos - data única) ---

export async function getListaNpsQuimio(date: string): Promise<IRatingQuimio[]> {
  try {
    const { data } = await ApiNotify.get<IRatingQuimio[]>(
      `Nps/GetListNpsTratamentos?start=${date}&end=${date}&PageNumber=1&RowsOfPage=100`,
    )
    return data ?? []
  } catch (err: any) {
    if (err?.response?.status === 404) return []
    throw err
  }
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

interface IResultMedicos { result: IMedico[] }
interface IResultConvenios { result: IConvenio[] }

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
