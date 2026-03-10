'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import html2canvas from 'html2canvas'
import downloadjs from 'downloadjs'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import type { IDashboardFormValues, TFilter } from '@/types/nps'
import * as npsTratamentoService from '@/services/npsTratamentoService'

const validationSchema = Yup.object({
  startDate: Yup.string().required('Data inicial obrigatória'),
  endDate: Yup.string().required('Data final obrigatória'),
  cdUnidade: Yup.string().required('Unidade obrigatória'),
})

const FILTER_TO_SUBCLASS: Record<keyof TFilter, number> = {
  general: 1, medicalTeam: 2, service: 3, parking: 4, infrastructure: 5,
  others: 6, delay: 7, coffeeWater: 8, authorizationDelay: 9,
  cleaning: 10, companyComunication: 11, services: 12, specialty: 13,
}

export function useTratamentoDashboard() {
  const printRef = useRef<HTMLDivElement>(null)
  const [periodLegend, setPeriodLegend] = useState('')
  const [searchParams, setSearchParams] = useState<{
    start: string; end: string; unidade: string
  } | null>(null)

  const [filter, setFilter] = useState<TFilter>({
    general: false, medicalTeam: false, service: false, parking: false,
    infrastructure: false, others: false, delay: false, coffeeWater: false,
    authorizationDelay: false, cleaning: false, companyComunication: false,
    services: false, specialty: false,
  })

  const formik = useFormik<IDashboardFormValues>({
    initialValues: { startDate: '', endDate: '', cdUnidade: '' },
    validationSchema,
    onSubmit: (values) => {
      const legend = `${moment(values.startDate).format('DD/MMM/YYYY')} - ${moment(values.endDate).format('DD/MMM/YYYY')}`
      setPeriodLegend(legend)
      setSearchParams({ start: values.startDate ?? '', end: values.endDate ?? '', unidade: values.cdUnidade ?? '' })
    },
  })

  const dashboardQuery = useQuery({
    queryKey: ['tratamento-dashboard-values', searchParams],
    queryFn: () =>
      npsTratamentoService.getClassificationsDashboardValues(
        searchParams!.start, searchParams!.end, Number(searchParams!.unidade),
      ),
    enabled: !!searchParams,
    refetchOnWindowFocus: false,
  })

  const subclassQuery = useQuery({
    queryKey: ['tratamento-subclassification-values', searchParams],
    queryFn: () =>
      npsTratamentoService.getSubclassificationsDashboardValues(
        searchParams!.start, searchParams!.end, Number(searchParams!.unidade),
      ),
    enabled: !!searchParams,
    refetchOnWindowFocus: false,
  })

  const filteredSubclassifications = useMemo(() => {
    if (!subclassQuery.isSuccess || !subclassQuery.data?.length) return []
    const activeFilters = Object.entries(filter).filter(([, v]) => v)
    if (activeFilters.length === 0) return subclassQuery.data
    const activeIds = activeFilters.map(([key]) => FILTER_TO_SUBCLASS[key as keyof TFilter])
    return subclassQuery.data.filter((item) => activeIds.includes(item.subclassificacao))
  }, [subclassQuery.data, subclassQuery.isSuccess, filter])

  const handleChangeFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.checked }))
  }, [])

  const handleCaptureClick = useCallback(async () => {
    if (!printRef.current) return
    const canvas = await html2canvas(printRef.current)
    const dataURL = canvas.toDataURL('image/jpg')
    downloadjs(dataURL, 'dashboard-nps-tratamento.jpg', 'image/jpg')
  }, [])

  return {
    formik,
    printRef,
    periodLegend,
    dashboardValues: dashboardQuery.data ?? null,
    filteredSubclassifications,
    isFetching: dashboardQuery.isFetching || subclassQuery.isFetching,
    isSuccess: dashboardQuery.isSuccess,
    filter,
    handleChangeFilter,
    handleCaptureClick,
  }
}
