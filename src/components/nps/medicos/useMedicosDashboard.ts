'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import html2canvas from 'html2canvas'
import downloadjs from 'downloadjs'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import type { IMedico, INPSMedicoValues, ISatisfactionMedicos } from '@/types/nps'
import * as medicosService from '@/services/npsMedicosService'

const schema = Yup.object({
  startDate: Yup.string().required('Data inicial obrigatória'),
  endDate: Yup.string().required('Data final obrigatória'),
})

function aggregateSatisf(values: INPSMedicoValues[], key: 'satisfacaO_MEDICO' | 'satisfacaO_TEMPO_ESPERA'): ISatisfactionMedicos {
  return {
    muitO_SATISFEITO: values.reduce((s, v) => s + v[key].muitO_SATISFEITO, 0),
    satisfeito: values.reduce((s, v) => s + v[key].satisfeito, 0),
    indiferente: values.reduce((s, v) => s + v[key].indiferente, 0),
    insatisfeito: values.reduce((s, v) => s + v[key].insatisfeito, 0),
    muitO_INSATISFEITO: values.reduce((s, v) => s + v[key].muitO_INSATISFEITO, 0),
  }
}

function aggregateMedicoValues(values: INPSMedicoValues[]): INPSMedicoValues | null {
  if (!values.length) return null
  const totalAtend = values.reduce((s, v) => s + v.qtD_ATENDIMENTOS, 0)
  const weightedAvg = (field: 'mediA_TEMPO_ESPERA' | 'mediA_TEMPO_CONSULTA') =>
    totalAtend === 0 ? 0 : values.reduce((s, v) => s + v[field] * v.qtD_ATENDIMENTOS, 0) / totalAtend

  return {
    cD_MEDICO: values.map((v) => v.cD_MEDICO).join(','),
    qtD_ATENDIMENTOS: totalAtend,
    mediA_TEMPO_ESPERA: weightedAvg('mediA_TEMPO_ESPERA'),
    mediA_TEMPO_CONSULTA: weightedAvg('mediA_TEMPO_CONSULTA'),
    porcentageM_MEDICO: values.reduce((s, v) => s + v.porcentageM_MEDICO, 0) / values.length,
    porcentageM_GERAL: values.reduce((s, v) => s + v.porcentageM_GERAL, 0) / values.length,
    satisfacaO_MEDICO: aggregateSatisf(values, 'satisfacaO_MEDICO'),
    satisfacaO_TEMPO_ESPERA: aggregateSatisf(values, 'satisfacaO_TEMPO_ESPERA'),
  }
}

export function useMedicosDashboard() {
  const printRef = useRef<HTMLDivElement>(null)
  const [periodLegend, setPeriodLegend] = useState('')
  const [selectedMedicos, setSelectedMedicos] = useState<IMedico[]>([])
  const [searchParams, setSearchParams] = useState<{ start: string; end: string; listCdMedico: string } | null>(null)

  const medicosQuery = useQuery({
    queryKey: ['medicos-nps'],
    queryFn: medicosService.getMedicos,
    refetchOnWindowFocus: false,
  })

  const formik = useFormik({
    initialValues: { startDate: '', endDate: '' },
    validationSchema: schema,
    onSubmit: (values) => {
      if (!selectedMedicos.length) return
      const listCdMedico = selectedMedicos.map((m) => m.cD_PESSOA_FISICA).join(',')
      const legend = `${moment(values.startDate).format('DD/MMM/YYYY')} - ${moment(values.endDate).format('DD/MMM/YYYY')}`
      setPeriodLegend(legend)
      setSearchParams({ start: values.startDate, end: values.endDate, listCdMedico })
    },
  })

  const dashboardQuery = useQuery({
    queryKey: ['nps-medico-dashboard', searchParams],
    queryFn: () => medicosService.getMedicoDashboard(searchParams!.start, searchParams!.end, searchParams!.listCdMedico),
    enabled: !!searchParams,
    refetchOnWindowFocus: false,
  })

  const aggregated = useMemo(
    () => aggregateMedicoValues(dashboardQuery.data ?? []),
    [dashboardQuery.data],
  )

  const handleCaptureClick = useCallback(async () => {
    if (!printRef.current) return
    const canvas = await html2canvas(printRef.current)
    downloadjs(canvas.toDataURL('image/jpg'), 'nps-medicos.jpg', 'image/jpg')
  }, [])

  return {
    formik,
    printRef,
    periodLegend,
    selectedMedicos,
    setSelectedMedicos,
    medicoOptions: medicosQuery.data ?? [],
    isLoadingMedicos: medicosQuery.isLoading,
    aggregated,
    isFetching: dashboardQuery.isFetching,
    isSuccess: dashboardQuery.isSuccess,
    handleCaptureClick,
  }
}
