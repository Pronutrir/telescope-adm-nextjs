'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PDFItem } from '@/types/pdf'
import PDFManagerService from '@/services/pdfManager/pdfManagerService'

export interface MergeProgress {
  show: boolean
  message: string
  type: 'info' | 'success' | 'error'
}

export interface NomeComposicao {
  nomePaciente: string
  numeroGuia: string
  numeroProtocolo: string
  numeroAtendimento: string
  dataUpload: string
  hash: string
}

interface UsePDFMergeParams {
  filteredPdfs: PDFItem[]
  selectedForMerge: Set<string>
  selectionOrder: string[]
  disableSelectionMode: () => void
  showSuccess: (msg: string) => void
  showError: (msg: string) => void
  showWarning: (msg: string) => void
}

const formatDateDDMMAAAA = (): string => {
  const d = new Date()
  return `${d.getDate().toString().padStart(2, '0')}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getFullYear()}`
}

const generateHash = () => Math.random().toString(36).substring(2, 8).toUpperCase()

export const usePDFMerge = ({
  filteredPdfs, selectedForMerge, selectionOrder,
  disableSelectionMode, showSuccess, showError, showWarning,
}: UsePDFMergeParams) => {
  const router = useRouter()
  const [isMerging, setIsMerging] = useState(false)
  const [mergeProgress, setMergeProgress] = useState<MergeProgress>({ show: false, message: '', type: 'info' })
  const [showCompositionModal, setShowCompositionModal] = useState(false)
  const [nomeComposicao, setNomeComposicao] = useState<NomeComposicao>({
    nomePaciente: '', numeroGuia: '', numeroProtocolo: '',
    numeroAtendimento: '', dataUpload: formatDateDDMMAAAA(), hash: generateHash(),
  })
  const [isLoadingGuia, setIsLoadingGuia] = useState(false)

  const buscarNumeroGuia = useCallback(async (numeroAtendimento: string) => {
    if (!numeroAtendimento) return
    setIsLoadingGuia(true)
    try {
      const response = await fetch(`/api/tasy/numero-guia?numeroAtendimento=${encodeURIComponent(numeroAtendimento)}`)
      if (response.ok) {
        const data = await response.json()
        setNomeComposicao(prev => ({
          ...prev,
          numeroGuia: data.numeroGuia || '',
          numeroProtocolo: data.numeroProtocolo || '',
        }))
        const msgs = []
        if (data.numeroGuia) msgs.push(`Guia: ${data.numeroGuia}`)
        if (data.numeroProtocolo) msgs.push(`Protocolo: ${data.numeroProtocolo}`)
        if (msgs.length > 0) showSuccess(msgs.join(' | '))
        else showWarning('Dados encontrados mas sem número de guia ou protocolo')
      } else {
        showWarning(`Nenhum dado encontrado para o atendimento ${numeroAtendimento}. Informe manualmente.`)
      }
    } catch {
      showError('Erro ao buscar dados. Por favor, informe manualmente.')
    } finally {
      setIsLoadingGuia(false)
    }
  }, [showSuccess, showError, showWarning])

  const handleMergePDFs = useCallback(() => {
    if (selectedForMerge.size < 2) {
      setMergeProgress({ show: true, message: '⚠️ Selecione pelo menos 2 PDFs para unificação', type: 'error' })
      setTimeout(() => setMergeProgress(prev => ({ ...prev, show: false })), 3000)
      return
    }

    const firstId = selectionOrder[0] || Array.from(selectedForMerge)[0]
    const firstPdf = filteredPdfs.find(p => p.id === firstId)
    const composicao: NomeComposicao = {
      nomePaciente: '', numeroGuia: '', numeroProtocolo: '',
      numeroAtendimento: '', dataUpload: formatDateDDMMAAAA(), hash: generateHash(),
    }

    if (firstPdf) {
      const parts = firstPdf.fileName.replace('.pdf', '').split('_')
      const hasPrefix = parts[0].length <= 3 && /^[A-Z]+$/.test(parts[0])
      const si = hasPrefix ? 1 : 0

      for (let i = si; i < parts.length; i++) {
        if (!/^\d+$/.test(parts[i]) && parts[i].length !== 8) {
          composicao.nomePaciente = parts[i].trim()
          break
        }
      }
      if (!composicao.nomePaciente && firstPdf.title) {
        composicao.nomePaciente = firstPdf.title.replace('.pdf', '').trim()
      }
      if (parts.length >= si + 4) {
        composicao.numeroAtendimento = parts[si + 1] || ''
        composicao.dataUpload = parts[si + 2] || composicao.dataUpload
        composicao.hash = parts[si + 3] || composicao.hash
      }
      if (composicao.numeroAtendimento) {
        setTimeout(() => buscarNumeroGuia(composicao.numeroAtendimento), 500)
      }
    }

    setNomeComposicao(composicao)
    setShowCompositionModal(true)
  }, [selectedForMerge, selectionOrder, filteredPdfs, buscarNumeroGuia])

  const handleConfirmMerge = useCallback(async () => {
    const { nomePaciente, numeroGuia, numeroAtendimento, dataUpload, numeroProtocolo, hash } = nomeComposicao
    if (!nomePaciente.trim()) return showWarning('Nome do Paciente é obrigatório')
    if (!numeroGuia.trim()) return showWarning('Número da Guia é obrigatório')
    if (!numeroAtendimento.trim()) return showWarning('Número do Atendimento é obrigatório')
    if (!dataUpload.trim() || dataUpload.length !== 8)
      return showWarning('Data deve estar no formato DDMMAAAA (8 dígitos)')

    const [day, month, year] = [
      parseInt(dataUpload.substring(0, 2)),
      parseInt(dataUpload.substring(2, 4)),
      parseInt(dataUpload.substring(4, 8)),
    ]
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100)
      return showWarning('Data inválida. Use o formato DDMMAAAA.')

    setShowCompositionModal(false)
    try {
      setIsMerging(true)
      setMergeProgress({ show: true, message: '🔄 Iniciando unificação...', type: 'info' })

      const orderedIds = selectionOrder.filter(id => selectedForMerge.has(id))
      const nome = `UNI_${nomePaciente}_${numeroGuia}_${numeroProtocolo}_${numeroAtendimento}_${dataUpload}_${hash}`

      setMergeProgress({ show: true, message: `📄 Unificando ${orderedIds.length} PDFs: "${nome}.pdf"...`, type: 'info' })
      const result = await PDFManagerService.mergePDFs(orderedIds, nome, true, true)

      if (result.success) {
        setMergeProgress({ show: true, message: `✅ Unificado com sucesso: "${result.mergedFileName}"`, type: 'success' })
        disableSelectionMode()
        setNomeComposicao(prev => ({ ...prev, hash: generateHash() }))
        setTimeout(() => router.push('/admin/gerenciador-pdfs/unificados'), 2000)
      } else {
        throw new Error(result.errorMessage || 'Erro na unificação')
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro inesperado'
      setMergeProgress({ show: true, message: `❌ Erro na unificação: ${msg}`, type: 'error' })
      setTimeout(() => setMergeProgress(prev => ({ ...prev, show: false })), 5000)
    } finally {
      setIsMerging(false)
    }
  }, [nomeComposicao, selectionOrder, selectedForMerge, disableSelectionMode, showWarning, router])

  return {
    isMerging, mergeProgress, showCompositionModal, setShowCompositionModal,
    nomeComposicao, setNomeComposicao, isLoadingGuia,
    handleMergePDFs, handleConfirmMerge,
  }
}
