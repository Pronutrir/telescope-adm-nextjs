'use client'

import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueries } from '@tanstack/react-query'
import { useNotifications } from '@/contexts/NotificationContext'
import type { IRating, IOptionsFilter, IOptionsFilterQuests, ModalControl, Order, DialogType } from '@/types/nps'
import * as npsService from '@/services/npsConsultaService'

export function useAnswersList() {
  const { showSuccess, showError } = useNotifications()

  const [selected, setSelected] = useState<IRating[]>([])
  const [dataNps, setDataNps] = useState('')
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof IRating>('cliente')
  const [modalControl, setModalControl] = useState<ModalControl>({ open: false, title: '', type: 'default' })
  const [customMessageData, setCustomMessageData] = useState<IRating | null>(null)
  const [optionsFilter, setOptionsFilter] = useState<IOptionsFilter>({
    onlyComments: false,
    quest1: [], quest2: [], quest3: [], quest4: [],
    nota: [], unidade: [], profissional: [], convenio: [], especialidade: [],
  })

  // --- Queries ---
  const listQuery = useQuery({
    queryKey: ['listagem-pesquisa-consultas', dataNps],
    queryFn: () => npsService.getListaNps(dataNps),
    enabled: false,
    refetchOnWindowFocus: false,
  })

  const [medicosQ, conveniosQ, especialidadesQ] = useQueries({
    queries: [
      { queryKey: ['medicos'], queryFn: npsService.getMedicos, refetchOnWindowFocus: false },
      { queryKey: ['convenios'], queryFn: npsService.getConvenios, refetchOnWindowFocus: false },
      { queryKey: ['especialidades'], queryFn: npsService.getEspecialidades, refetchOnWindowFocus: false },
    ],
  })

  // --- Mutations ---
  const sendMessagesMut = useMutation({
    mutationFn: () => npsService.postDefaultMessages(selected),
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagens enviadas com sucesso'); setSelected([]) },
    onError: () => showError('Erro ao enviar mensagens'),
  })

  const sendCustomMut = useMutation({
    mutationFn: npsService.postCustomMessage,
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagem enviada'); handleCloseModal() },
    onError: () => showError('Erro ao enviar mensagem'),
  })

  const sendCustom72hMut = useMutation({
    mutationFn: npsService.postCustomMessage72h,
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagem 72h enviada'); handleCloseModal() },
    onError: () => showError('Erro ao enviar mensagem 72h'),
  })

  const classificationMut = useMutation({
    mutationFn: npsService.postClassification,
    onSuccess: () => { listQuery.refetch(); showSuccess('Classificação salva') },
    onError: () => showError('Erro ao salvar classificação'),
  })

  // --- Handlers ---
  const handleSearch = useCallback(() => {
    if (!dataNps) return
    setSelected([])
    setPage(1)
    listQuery.refetch()
  }, [dataNps, listQuery])

  const filterEnabledArray = (arr: IRating[]) => arr.filter((i) => i.fone && !i.reply && !i.isExpired)

  const isSelected = useCallback(
    (item: IRating) => selected.some((s) => s.npsConsultaId === item.npsConsultaId),
    [selected],
  )

  const isCheckedAll = useCallback(
    (data: IRating[]) => selected.length > 0 && selected.length === filterEnabledArray(data).length,
    [selected],
  )

  const handleSelected = useCallback((item: IRating) => {
    setSelected((prev) =>
      prev.some((s) => s.npsConsultaId === item.npsConsultaId)
        ? prev.filter((s) => s.npsConsultaId !== item.npsConsultaId)
        : [...prev, item],
    )
  }, [])

  const handleSelectedAll = useCallback((checked: boolean, data: IRating[]) => {
    setSelected(checked ? filterEnabledArray(data) : [])
  }, [])

  function handleRequestSort(property: keyof IRating) {
    setOrder(orderBy === property && order === 'asc' ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleOpenModal = useCallback((type: DialogType, data?: IRating) => {
    if (!data || type === 'default') return
    const titles: Record<Exclude<DialogType, 'default'>, string> = {
      answer: 'Mensagem personalizada - 24h',
      answer72h: 'Mensagem personalizada - 72h',
      classification: 'Classificação da avaliação',
    }
    setModalControl({ open: true, type, title: titles[type] })
    setCustomMessageData(data)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalControl({ open: false, title: '', type: 'default' })
    setCustomMessageData(null)
  }, [])

  // --- Filter logic ---
  function filterRatings(ratings: IRating[], opts: IOptionsFilter) {
    return ratings.filter((r) => (
      (!opts.onlyComments || r.comentario != null) &&
      (!opts.quest1?.length || opts.quest1.some((q) => q === r.quest1?.replace(/[⭐️]/g, '').trim())) &&
      (!opts.quest2?.length || opts.quest2.some((q) => q === r.quest2?.replace(/[⭐️]/g, '').trim())) &&
      (!opts.quest3?.length || opts.quest3.some((q) => q === r.quest3?.replace(/[⭐️]/g, '').trim())) &&
      (!opts.quest4?.length || opts.quest4.some((q) => q === r.quest4?.replace(/[⭐️]/g, '').trim())) &&
      (!opts.unidade?.length || opts.unidade.includes(r.unidade)) &&
      (!opts.profissional?.length || opts.profissional.includes(r.cd_medico)) &&
      (!opts.convenio?.length || opts.convenio.includes(r.cd_convenio.toString())) &&
      (!opts.especialidade?.length || opts.especialidade.includes(r.cd_especialidade.toString()))
    ))
  }

  const filteredData = useMemo(() => {
    if (!listQuery.isSuccess || !listQuery.data?.length) return []
    return filterRatings(listQuery.data, optionsFilter)
  }, [listQuery.data, listQuery.isSuccess, optionsFilter])

  const handleChangeFilter = useCallback((name: string, value: string, checked: boolean) => {
    if (name === 'onlyComments') {
      return setOptionsFilter((prev) => ({ ...prev, onlyComments: checked }))
    }
    setOptionsFilter((prev) => ({
      ...prev,
      [name]: checked
        ? [...(prev[name as IOptionsFilterQuests] ?? []), value]
        : (prev[name as IOptionsFilterQuests] ?? []).filter((v) => v !== value),
    }))
  }, [])

  const handleSetAllQuestions = useCallback((quest: string, checked: boolean) => {
    const all = ['Muito insatisfeito', 'Insatisfeito', 'Indiferente', 'Satisfeito', quest === 'quest1' ? 'Muito_satisfeito' : 'Muito satisfeito']
    setOptionsFilter((prev) => ({ ...prev, [quest]: checked ? all : [] }))
  }, [])

  const handleSetAll = useCallback(<T,>(quest: IOptionsFilterQuests, checked: boolean, array: T[]) => {
    setOptionsFilter((prev) => ({ ...prev, [quest]: checked ? array : [] }))
  }, [])

  const calcPercent = (total: number, part: number) => (total > 0 ? ((part / total) * 100).toFixed(0) : '0')

  return {
    selected, dataNps, setDataNps, page, setPage, order, orderBy,
    modalControl, customMessageData, optionsFilter,
    data: listQuery.data ?? [], filteredData,
    isFetching: listQuery.isFetching, isSuccess: listQuery.isSuccess,
    medicos: medicosQ.data ?? [], convenios: conveniosQ.data ?? [], especialidades: especialidadesQ.data ?? [],
    isLoadingSend: sendMessagesMut.isPending,
    isLoadingModal: sendCustomMut.isPending || classificationMut.isPending,
    handleSearch, handleRequestSort, isSelected, isCheckedAll,
    handleSelected, handleSelectedAll, handleOpenModal, handleCloseModal,
    handleSendMessages: () => sendMessagesMut.mutateAsync(),
    sendCustomMessage: async (message: string, item: IRating) =>
      sendCustomMut.mutateAsync({ npsConsultaId: item.npsConsultaId, customMessage: message, fone: item.fone }),
    sendCustomMessage72h: sendCustom72hMut.mutateAsync,
    sendClassification: async (classification: string, subclassification: string | null, item: IRating) =>
      classificationMut.mutateAsync({ classification, subclassification, npsId: item.npsConsultaId }),
    handleChangeFilter, handleSetAllQuestions, handleSetAll, calcPercent,
  }
}
