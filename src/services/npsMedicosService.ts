import { Api, ApiNotify } from '@/lib/api'
import type { IMedico, IConvenio, INPSMedicoValues, INPSConvenioValues } from '@/types/nps'

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

export async function getMedicoDashboard(
  startDate: string,
  endDate: string,
  listCdMedico: string,
): Promise<INPSMedicoValues[]> {
  try {
    const { data } = await ApiNotify.get<INPSMedicoValues[]>(
      `Nps/GetListNpsConsultaMedicoMultiple?start=${startDate}&end=${endDate}&list_cd_medico=${listCdMedico}`,
    )
    return data ?? []
  } catch (err: any) {
    if (err?.response?.status === 404) return []
    throw err
  }
}

export async function getConvenioDashboard(
  startDate: string,
  endDate: string,
  cdConvenio: number,
): Promise<INPSConvenioValues> {
  const { data } = await ApiNotify.get<INPSConvenioValues>(
    `Nps/GetListNpsConsultaConvenio?start=${startDate}&end=${endDate}&cd_convenio=${cdConvenio}`,
  )
  return data
}
