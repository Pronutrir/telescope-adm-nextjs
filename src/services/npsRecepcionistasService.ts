import { ApiNotify } from '@/lib/api'
import type {
  IResponseRecepcionistas,
  IRatingRecepcionistas,
  ICustomMessageRecepcionistas,
  IClassificationParamsRecepcionistas,
  IClassificationResultRecepcionistas,
  IDominio,
} from '@/types/nps'

export async function getListaNps(date: string): Promise<IResponseRecepcionistas | null> {
  const { data } = await ApiNotify.get<IResponseRecepcionistas>(
    `Quizzes/GetListPercentQuizRecepcionistas?start=${date}&end=${date}&PageNumber=1&RowsOfPage=100`,
  )
  return data
}

export async function postDefaultMessages(items: IRatingRecepcionistas[]) {
  return ApiNotify.post(
    'Nps/SendDefaultNpsResponseAgendaConsultaMessageWhatsapp',
    items.map((item) => ({ npsConsultaId: item.id, fone: item.fone })),
  )
}

export async function postCustomMessage({ npsId, customMessage, fone }: ICustomMessageRecepcionistas) {
  return ApiNotify.post('Quizzes/SendWhatsResponseQuizzesAppMessage', {
    npsId,
    recipientPhoneNumber: fone,
    message: customMessage,
  })
}

export async function postClassification({ classification, subclassification, npsId }: IClassificationParamsRecepcionistas) {
  return ApiNotify.post('NpsClassification/AddClassification', {
    classification,
    subclassification,
    quizId: npsId,
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

export async function getClassificationHistory(quizId: string): Promise<IClassificationResultRecepcionistas[]> {
  const { data } = await ApiNotify.get<IClassificationResultRecepcionistas[]>(
    `NpsClassification/ListClassificationsByQuizId/${quizId}`,
  )
  return data
}
