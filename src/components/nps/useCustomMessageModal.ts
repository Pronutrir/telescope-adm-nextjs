'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getClassificationsTypes,
  getSubclassifications,
  getClassificationHistory,
} from '@/services/npsConsultaService'
import type { IRating } from '@/types/nps'

export function useCustomMessageModal(dataSend: IRating | null) {
  // 24h state
  const [message24h, setMessage24h] = useState('')

  // 72h state
  const [situacao, setSituacao] = useState('')
  const [message72h, setMessage72h] = useState('')
  const [templatePreset, setTemplatePreset] = useState('')

  // Classification state
  const [classification, setClassification] = useState('')
  const [subClassification, setSubClassification] = useState('')

  const classificationsQuery = useQuery({
    queryKey: ['nps-classification-types'],
    queryFn: getClassificationsTypes,
    refetchOnWindowFocus: false,
  })

  const subclassificationsQuery = useQuery({
    queryKey: ['nps-subclassifications', classification],
    queryFn: () => getSubclassifications(classification),
    enabled: Boolean(classification),
    refetchOnWindowFocus: false,
  })

  const historicQuery = useQuery({
    queryKey: ['nps-classification-historic', dataSend?.npsConsultaId],
    queryFn: () => getClassificationHistory(dataSend?.npsConsultaId ?? ''),
    enabled: Boolean(dataSend?.npsConsultaId),
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
