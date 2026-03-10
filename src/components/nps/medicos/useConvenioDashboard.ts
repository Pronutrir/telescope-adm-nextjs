'use client'

import { useState, useCallback, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import html2canvas from 'html2canvas'
import downloadjs from 'downloadjs'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import * as medicosService from '@/services/npsMedicosService'

const schema = Yup.object({
  startDate: Yup.string().required('Data inicial obrigatória'),
  endDate: Yup.string().required('Data final obrigatória'),
  cdConvenio: Yup.string().required('Selecione um convênio'),
})

export function useConvenioDashboard() {
  const printRef = useRef<HTMLDivElement>(null)
  const [periodLegend, setPeriodLegend] = useState('')
  const [searchParams, setSearchParams] = useState<{
    start: string; end: string; cdConvenio: number
  } | null>(null)

  const conveniosQuery = useQuery({
    queryKey: ['convenios-nps'],
    queryFn: medicosService.getConvenios,
    refetchOnWindowFocus: false,
  })

  const formik = useFormik({
    initialValues: { startDate: '', endDate: '', cdConvenio: '' },
    validationSchema: schema,
    onSubmit: (values) => {
      const legend = `${moment(values.startDate).format('DD/MMM/YYYY')} - ${moment(values.endDate).format('DD/MMM/YYYY')}`
      setPeriodLegend(legend)
      setSearchParams({ start: values.startDate, end: values.endDate, cdConvenio: Number(values.cdConvenio) })
    },
  })

  const dashboardQuery = useQuery({
    queryKey: ['nps-convenio-dashboard', searchParams],
    queryFn: () => medicosService.getConvenioDashboard(searchParams!.start, searchParams!.end, searchParams!.cdConvenio),
    enabled: !!searchParams,
    refetchOnWindowFocus: false,
  })

  const handleCaptureClick = useCallback(async () => {
    if (!printRef.current) return
    const canvas = await html2canvas(printRef.current)
    downloadjs(canvas.toDataURL('image/jpg'), 'nps-convenio.jpg', 'image/jpg')
  }, [])

  return {
    formik,
    printRef,
    periodLegend,
    convenioOptions: conveniosQuery.data ?? [],
    isLoadingConvenios: conveniosQuery.isLoading,
    data: dashboardQuery.data ?? null,
    isFetching: dashboardQuery.isFetching,
    isSuccess: dashboardQuery.isSuccess,
    handleCaptureClick,
  }
}
