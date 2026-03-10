'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getClassificationsTypes,
  getSubclassifications,
  getClassificationHistory,
} from '@/services/npsTratamentoService'
import type { IRatingTratamento } from '@/types/nps'

export function useCustomMessageModalTratamento(dataSend: IRatingTratamento | null) {
  const [message24h, setMessage24h] = useState('')
  const [situacao, setSituacao] = useState('')
  const [message72h, setMessage72h] = useState('')
  const [templatePreset, setTemplatePreset] = useState('')
  const [classification, setClassification] = useState('')
  const [subClassification, setSubClassification] = useState('')

  const classificationsQuery = useQuery({
    queryKey: ['nps-tratamento-classification-types'],
    queryFn: getClassificationsTypes,
    refetchOnWindowFocus: false,
  })

  const subclassificationsQuery = useQuery({
    queryKey: ['nps-tratamento-subclassifications', classification],
    queryFn: () => getSubclassifications(classification),
    enabled: Boolean(classification),
    refetchOnWindowFocus: false,
  })

  const historicQuery = useQuery({
    queryKey: ['nps-tratamento-classification-historic', dataSend?.npsTratamentoId],
    queryFn: () => getClassificationHistory(dataSend?.npsTratamentoId ?? ''),
    enabled: Boolean(dataSend?.npsTratamentoId),
    refetchOnWindowFocus: false,
  })

  function resetAll() {
    setMessage24h('')
    setSituacao('')
    setMessage72h('')
    setTemplatePreset('')
    setClassification('')
    setSubClassification('')
  }

  return {
    message24h, setMessage24h,
    situacao, setSituacao,
    message72h, setMessage72h,
    templatePreset, setTemplatePreset,
    classification, setClassification,
    subClassification, setSubClassification,
    classificationsQuery,
    subclassificationsQuery,
    historicQuery,
    resetAll,
  }
}
