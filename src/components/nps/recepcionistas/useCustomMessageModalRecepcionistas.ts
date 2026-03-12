'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getClassificationsTypes,
  getSubclassifications,
  getClassificationHistory,
} from '@/services/npsRecepcionistasService'
import type { IRatingRecepcionistas } from '@/types/nps'

export function useCustomMessageModalRecepcionistas(dataSend: IRatingRecepcionistas | null) {
  const [message, setMessage] = useState('')
  const [situacao, setSituacao] = useState('')
  const [message72h, setMessage72h] = useState('')
  const [templatePreset, setTemplatePreset] = useState('')
  const [classification, setClassification] = useState('')
  const [subClassification, setSubClassification] = useState('')

  const classificationsQuery = useQuery({
    queryKey: ['nps-recepcionistas-classification-types'],
    queryFn: getClassificationsTypes,
    refetchOnWindowFocus: false,
  })

  const subclassificationsQuery = useQuery({
    queryKey: ['nps-recepcionistas-subclassifications', classification],
    queryFn: () => getSubclassifications(classification),
    enabled: Boolean(classification),
    refetchOnWindowFocus: false,
  })

  const historicQuery = useQuery({
    queryKey: ['nps-recepcionistas-classification-historic', dataSend?.id],
    queryFn: () => getClassificationHistory(dataSend?.id ?? ''),
    enabled: Boolean(dataSend?.id),
    refetchOnWindowFocus: false,
  })

  function resetAll() {
    setMessage('')
    setSituacao('')
    setMessage72h('')
    setTemplatePreset('')
    setClassification('')
    setSubClassification('')
  }

  return {
    message, setMessage,
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
