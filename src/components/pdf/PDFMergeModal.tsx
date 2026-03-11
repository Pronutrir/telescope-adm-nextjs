'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Layers, Loader2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { NomeComposicao } from './usePDFMerge'

interface PDFMergeModalProps {
  isDark: boolean
  isOpen: boolean
  nomeComposicao: NomeComposicao
  isMerging: boolean
  onNomeChange: (field: keyof NomeComposicao, value: string) => void
  onConfirm: () => void
  onClose: () => void
}

const FIELDS: Array<{
  key: keyof NomeComposicao
  label: string
  placeholder: string
  required?: boolean
  hint?: string
  maxLength?: number
}> = [
  { key: 'nomePaciente', label: 'Nome do Paciente *', placeholder: 'Ex: João Silva', required: true, hint: '💡 Extraído automaticamente do primeiro PDF' },
  { key: 'numeroGuia', label: 'Número da Guia *', placeholder: 'Ex: 123456', required: true, hint: '💡 Buscado automaticamente com base no atendimento' },
  { key: 'numeroProtocolo', label: 'Número do Protocolo', placeholder: 'Ex: 789012', hint: '💡 Buscado automaticamente junto com a guia' },
  { key: 'numeroAtendimento', label: 'Número Atendimento *', placeholder: 'Ex: 337120', required: true },
  { key: 'dataUpload', label: 'Data Upload', placeholder: 'DDMMAAAA', maxLength: 8 },
  { key: 'hash', label: 'Hash', placeholder: 'Ex: ABC123', maxLength: 8 },
]

export const PDFMergeModal: React.FC<PDFMergeModalProps> = ({
  isDark, isOpen, nomeComposicao, isMerging,
  onNomeChange, onConfirm, onClose,
}) => {
  const canConfirm = !isMerging &&
    nomeComposicao.nomePaciente.trim() &&
    nomeComposicao.numeroGuia.trim() &&
    nomeComposicao.numeroAtendimento.trim()

  const handleFieldChange = (key: keyof NomeComposicao, value: string) => {
    if (key === 'dataUpload') value = value.replace(/\D/g, '').slice(0, 8)
    if (key === 'hash') value = value.toUpperCase()
    onNomeChange(key, value)
  }

  const { nomePaciente, numeroGuia, numeroProtocolo, numeroAtendimento, dataUpload, hash } = nomeComposicao

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Composição do Nome do Arquivo Unificado" size="lg">
      <div className="space-y-6">
        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
          Formato: <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">
            UNI_nomePaciente_numeroGuia_numeroProtocolo_numAtendimento_DDMMAAAA_hash.pdf
          </code>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIELDS.map(({ key, label, placeholder, required, hint, maxLength }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">{label}</label>
              <Input
                type="text"
                placeholder={placeholder}
                value={nomeComposicao[key]}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                className={cn('w-full', isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300')}
                required={required}
                readOnly
                maxLength={maxLength}
              />
              {hint && <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>{hint}</p>}
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className={cn('p-3 rounded-md border', isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-100 border-gray-200')}>
          <div className="text-sm">
            <span className="font-medium">Nome do arquivo:</span>
            <code className={cn('ml-2 px-2 py-1 rounded text-xs', isDark ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700')}>
              UNI_{nomePaciente || 'nomePaciente'}_{numeroGuia || 'numeroGuia'}_{numeroProtocolo || 'numeroProtocolo'}_{numeroAtendimento || 'numAtendimento'}_{dataUpload}_{hash || 'hash'}.pdf
            </code>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button onClick={onClose} variant="outline" disabled={isMerging}>Cancelar</Button>
          <Button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={cn(
              'inline-flex items-center gap-2',
              !canConfirm
                ? 'cursor-not-allowed opacity-50'
                : isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
            )}
          >
            {isMerging ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Unificando...</>
            ) : (
              <><Layers className="w-4 h-4" /> Confirmar Unificação</>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
