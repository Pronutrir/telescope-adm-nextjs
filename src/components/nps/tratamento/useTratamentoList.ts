'use client'

import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueries } from '@tanstack/react-query'
import { useNotifications } from '@/contexts/NotificationContext'
import type {
  IRatingTratamento,
  IOptionsFilterTratamento,
  IOptionsFilterTratamentoQuests,
  ModalControl,
  Order,
  DialogType,
} from '@/types/nps'
import * as tratamentoService from '@/services/npsTratamentoService'

export function useTratamentoList() {
  const { showSuccess, showError } = useNotifications()

  const [selected, setSelected] = useState<IRatingTratamento[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof IRatingTratamento>('cliente')
  const [modalControl, setModalControl] = useState<ModalControl>({ open: false, title: '', type: 'default' })
  const [customMessageData, setCustomMessageData] = useState<IRatingTratamento | null>(null)
  const [optionsFilter, setOptionsFilter] = useState<IOptionsFilterTratamento>({
    onlyComments: false,
    nota: [], unidade: [], profissional: [], convenio: [],
  })

  // --- Queries ---
  const listQuery = useQuery({
    queryKey: ['listagem-pesquisa-tratamentos', startDate, endDate],
    queryFn: () => tratamentoService.getListaNps(startDate, endDate),
    enabled: false,
    refetchOnWindowFocus: false,
  })

  const [medicosQ, conveniosQ] = useQueries({
    queries: [
      { queryKey: ['medicos'], queryFn: tratamentoService.getMedicos, refetchOnWindowFocus: false },
      { queryKey: ['convenios'], queryFn: tratamentoService.getConvenios, refetchOnWindowFocus: false },
    ],
  })

  // --- Mutations ---
  const sendMessagesMut = useMutation({
    mutationFn: () => tratamentoService.postDefaultMessages(selected),
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagens enviadas com sucesso'); setSelected([]) },
    onError: () => showError('Erro ao enviar mensagens'),
  })

  const sendCustomMut = useMutation({
    mutationFn: tratamentoService.postCustomMessage,
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagem enviada'); handleCloseModal() },
    onError: () => showError('Erro ao enviar mensagem'),
  })

  const sendCustom72hMut = useMutation({
    mutationFn: tratamentoService.postCustomMessage72h,
    onSuccess: () => { listQuery.refetch(); showSuccess('Mensagem 72h enviada'); handleCloseModal() },
    onError: () => showError('Erro ao enviar mensagem 72h'),
  })

  const classificationMut = useMutation({
    mutationFn: tratamentoService.postClassification,
    onSuccess: () => { listQuery.refetch(); showSuccess('Classificação salva') },
    onError: () => showError('Erro ao salvar classificação'),
  })

  // --- Handlers ---
  const handleSearch = useCallback(() => {
    if (!startDate || !endDate) return
    setSelected([])
    setPage(1)
    listQuery.refetch()
  }, [startDate, endDate, listQuery])

  const filterEnabledArray = (arr: IRatingTratamento[]) =>
    arr.filter((i) => i.fone && !i.reply && !i.isExpired)

  const isSelected = useCallback(
    (item: IRatingTratamento) => selected.some((s) => s.npsTratamentoId === item.npsTratamentoId),
    [selected],
  )

  const isCheckedAll = useCallback(
    (data: IRatingTratamento[]) => selected.length > 0 && selected.length === filterEnabledArray(data).length,
    [selected],
  )

  const handleSelected = useCallback((item: IRatingTratamento) => {
    setSelected((prev) =>
      prev.some((s) => s.npsTratamentoId === item.npsTratamentoId)
        ? prev.filter((s) => s.npsTratamentoId !== item.npsTratamentoId)
        : [...prev, item],
    )
  }, [])

  const handleSelectedAll = useCallback((checked: boolean, data: IRatingTratamento[]) => {
    setSelected(checked ? filterEnabledArray(data) : [])
  }, [])

  function handleRequestSort(property: keyof IRatingTratamento) {
    setOrder(orderBy === property && order === 'asc' ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleOpenModal = useCallback((type: DialogType, data?: IRatingTratamento) => {
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
  function filterRatings(ratings: IRatingTratamento[], opts: IOptionsFilterTratamento) {
    return ratings.filter((r) => {
      if (opts.onlyComments && !r.quest9) return false
      if (opts.nota?.length) {
        const nps = parseInt(r.quest7 ?? '0')
        const cat = nps < 7 ? 'Detrator' : nps <= 8 ? 'Neutro' : 'Promotor'
        if (!opts.nota.includes(cat)) return false
      }
      if (opts.unidade?.length && !opts.unidade.includes(r.cd_estabelecimento)) return false
      if (opts.profissional?.length && !opts.profissional.includes(r.cd_medico)) return false
      if (opts.convenio?.length && !opts.convenio.includes(r.cd_convenio)) return false
      return true
    })
  }

  const filteredData = useMemo(() => {
    if (!listQuery.isSuccess || !listQuery.data?.length) return []
    return filterRatings(listQuery.data, optionsFilter)
  }, [listQuery.data, listQuery.isSuccess, optionsFilter])

  const handleChangeFilter = useCallback((name: string, value: string, checked: boolean) => {
    if (name === 'onlyComments') {
      return setOptionsFilter((prev) => ({ ...prev, onlyComments: checked }))
    }
    setOptionsFilter((prev) => {
      const current = (prev[name as keyof IOptionsFilterTratamento] as string[] | undefined) ?? []
      return {
        ...prev,
        [name]: checked ? [...current, value] : current.filter((v) => v !== value),
      }
    })
  }, [])

  const handleSetAll = useCallback(<T,>(quest: IOptionsFilterTratamentoQuests, checked: boolean, array: T[]) => {
    setOptionsFilter((prev) => ({ ...prev, [quest]: checked ? array : [] }))
  }, [])

  const calcPercent = (total: number, part: number) => (total > 0 ? ((part / total) * 100).toFixed(0) : '0')

  return {
    selected, startDate, setStartDate, endDate, setEndDate,
    page, setPage, order, orderBy,
    modalControl, customMessageData, optionsFilter,
    data: listQuery.data ?? [], filteredData,
    isFetching: listQuery.isFetching, isSuccess: listQuery.isSuccess,
    medicos: medicosQ.data ?? [], convenios: conveniosQ.data ?? [],
    isLoadingSend: sendMessagesMut.isPending,
    isLoadingModal: sendCustomMut.isPending || sendCustom72hMut.isPending || classificationMut.isPending,
    handleSearch, handleRequestSort, isSelected, isCheckedAll,
    handleSelected, handleSelectedAll, handleOpenModal, handleCloseModal,
    handleSendMessages: () => sendMessagesMut.mutateAsync(),
    sendCustomMessage: async (message: string, item: IRatingTratamento) =>
      sendCustomMut.mutateAsync({ npsTratamentoId: item.npsTratamentoId, customMessage: message, fone: item.fone }),
    sendCustomMessage72h: sendCustom72hMut.mutateAsync,
    sendClassification: async (classification: string, subclassification: string | null, item: IRatingTratamento) =>
      classificationMut.mutateAsync({ classification, subclassification, npsId: item.npsTratamentoId }),
    handleChangeFilter, handleSetAll, calcPercent,
  }
}
