'use client'

import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNotifications } from '@/contexts/NotificationContext'
import type {
  IRatingRecepcionistas,
  IOptionsFilterRecepcionistas,
  IOptionsFilterRecepcionistasQuests,
  ModalControl,
  Order,
  DialogType,
} from '@/types/nps'
import * as recepcionistasService from '@/services/npsRecepcionistasService'

export function useRecepcionistasList() {
  const { showSuccess, showError } = useNotifications()

  const [selected, setSelected] = useState<IRatingRecepcionistas[]>([])
  const [date, setDate] = useState('')
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof IRatingRecepcionistas>('name')
  const [modalControl, setModalControl] = useState<ModalControl>({ open: false, title: '', type: 'default' })
  const [customMessageData, setCustomMessageData] = useState<IRatingRecepcionistas | null>(null)
  const [optionsFilter, setOptionsFilter] = useState<IOptionsFilterRecepcionistas>({
    onlyComments: false,
    resp1: [],
    cd_pessoa_fisica: [],
    unidade: [],
    local: [],
  })

  // --- Query ---
  const listQuery = useQuery({
    queryKey: ['listagem-pesquisa-recepcionistas', date],
    queryFn: () => recepcionistasService.getListaNps(date),
    enabled: false,
    refetchOnWindowFocus: false,
  })

  const rawData = listQuery.data?.quizzesResponses ?? []

  // --- Mutations ---
  const sendMessagesMut = useMutation({
    mutationFn: () => recepcionistasService.postDefaultMessages(selected),
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagens enviadas com sucesso'); setSelected([]) },
    onError: () => showError('Erro ao enviar mensagens'),
  })

  const sendCustomMut = useMutation({
    mutationFn: recepcionistasService.postCustomMessage,
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagem enviada'); handleCloseModal() },
    onError: () => showError('Erro ao enviar mensagem'),
  })

  const sendCustom72hMut = useMutation({
    mutationFn: recepcionistasService.postCustomMessage72h,
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagem 72h enviada'); handleCloseModal() },
    onError: () => showError('Erro ao enviar mensagem 72h'),
  })

  const classificationMut = useMutation({
    mutationFn: recepcionistasService.postClassification,
    onSuccess: () => { listQuery.refetch(); showSuccess('Classificação salva') },
    onError: () => showError('Erro ao salvar classificação'),
  })

  // --- Handlers ---
  const handleSearch = useCallback(() => {
    if (!date) return
    setSelected([])
    setPage(1)
    listQuery.refetch()
  }, [date, listQuery])

  const filterEnabledArray = (arr: IRatingRecepcionistas[]) =>
    arr.filter((i) => i.fone && !i.reply && !i.isExpired)

  const isSelected = useCallback(
    (item: IRatingRecepcionistas) => selected.some((s) => s.id === item.id),
    [selected],
  )

  const isCheckedAll = useCallback(
    (data: IRatingRecepcionistas[]) => selected.length > 0 && selected.length === filterEnabledArray(data).length,
    [selected],
  )

  const handleSelected = useCallback((item: IRatingRecepcionistas) => {
    setSelected((prev) =>
      prev.some((s) => s.id === item.id)
        ? prev.filter((s) => s.id !== item.id)
        : [...prev, item],
    )
  }, [])

  const handleSelectedAll = useCallback((checked: boolean, data: IRatingRecepcionistas[]) => {
    setSelected(checked ? filterEnabledArray(data) : [])
  }, [])

  function handleRequestSort(property: keyof IRatingRecepcionistas) {
    setOrder(orderBy === property && order === 'asc' ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleOpenModal = useCallback((type: DialogType, data?: IRatingRecepcionistas) => {
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
  function filterRatings(ratings: IRatingRecepcionistas[], opts: IOptionsFilterRecepcionistas) {
    return ratings.filter((r) => {
      if (opts.onlyComments && !r.resp2) return false
      if (opts.resp1?.length && !opts.resp1.includes(r.resp1)) return false
      if (opts.cd_pessoa_fisica?.length && !opts.cd_pessoa_fisica.includes(r.cd_pessoa_fisica)) return false
      if (opts.unidade?.length && !opts.unidade.includes(r.cd_estabelecimento)) return false
      if (opts.local?.length && !opts.local.includes(r.nr_sequencia_local)) return false
      return true
    })
  }

  const filteredData = useMemo(() => {
    if (!listQuery.isSuccess || !rawData.length) return []
    return filterRatings(rawData, optionsFilter)
  }, [rawData, listQuery.isSuccess, optionsFilter])

  const handleChangeFilter = useCallback((name: string, value: string, checked: boolean) => {
    if (name === 'onlyComments') {
      return setOptionsFilter((prev) => ({ ...prev, onlyComments: checked }))
    }
    setOptionsFilter((prev) => {
      const current = (prev[name as keyof IOptionsFilterRecepcionistas] as string[] | undefined) ?? []
      return {
        ...prev,
        [name]: checked ? [...current, value] : current.filter((v) => v !== value),
      }
    })
  }, [])

  const handleSetAll = useCallback(<T,>(quest: IOptionsFilterRecepcionistasQuests, checked: boolean, array: T[]) => {
    setOptionsFilter((prev) => ({ ...prev, [quest]: checked ? array : [] }))
  }, [])

  // Derive unique recepcionistas and locais from loaded data
  const recepcionistas = useMemo(() => {
    const seen = new Set<string>()
    return rawData
      .filter((r) => { if (seen.has(r.cd_pessoa_fisica)) return false; seen.add(r.cd_pessoa_fisica); return true })
      .map((r) => ({ cd_pessoa_fisica: r.cd_pessoa_fisica }))
      .sort((a, b) => a.cd_pessoa_fisica.localeCompare(b.cd_pessoa_fisica))
  }, [rawData])

  const locais = useMemo(() => {
    const seen = new Set<string>()
    return rawData
      .filter((r) => { if (seen.has(r.nr_sequencia_local)) return false; seen.add(r.nr_sequencia_local); return true })
      .map((r) => ({ nr_sequencia_local: r.nr_sequencia_local, ds_local: r.ds_local }))
      .sort((a, b) => a.ds_local.localeCompare(b.ds_local))
  }, [rawData])

  const calcPercent = (total: number, part: number) => (total > 0 ? ((part / total) * 100).toFixed(0) : '0')

  return {
    selected, date, setDate,
    page, setPage, order, orderBy,
    modalControl, customMessageData, optionsFilter,
    data: rawData, filteredData,
    isFetching: listQuery.isFetching, isSuccess: listQuery.isSuccess,
    recepcionistas, locais,
    isLoadingSend: sendMessagesMut.isPending,
    isLoadingModal: sendCustomMut.isPending || sendCustom72hMut.isPending || classificationMut.isPending,
    handleSearch, handleRequestSort, isSelected, isCheckedAll,
    handleSelected, handleSelectedAll, handleOpenModal, handleCloseModal,
    handleSendMessages: () => sendMessagesMut.mutateAsync(),
    sendCustomMessage: async (message: string, item: IRatingRecepcionistas) =>
      sendCustomMut.mutateAsync({ npsId: item.id, customMessage: message, fone: item.fone! }),
    sendCustomMessage72h: sendCustom72hMut.mutateAsync,
    sendClassification: async (classification: string, subclassification: string | null, item: IRatingRecepcionistas) =>
      classificationMut.mutateAsync({ classification, subclassification, npsId: item.id }),
    handleChangeFilter, handleSetAll, calcPercent,
  }
}
