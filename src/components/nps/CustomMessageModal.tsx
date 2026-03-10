'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import moment from 'moment'
import type { IRating, DialogType } from '@/types/nps'
import { renderClassificationName, renderSubclassificationName } from './npsHelpers'
import { useCustomMessageModal } from './useCustomMessageModal'

// --- Templates 72h ---

const TEMPLATES_72H = [
  {
    key: 'elogio_promotor',
    label: 'Elogio (Promotor)',
    situacao: 'sua experiência positiva',
    message: 'Ficamos muito felizes em saber que você teve um bom atendimento!',
  },
  {
    key: 'reclamacao_detrator',
    label: 'Reclamação (Detrator)',
    situacao: 'os pontos de melhoria',
    message: 'Sentimos muito que sua experiência não tenha sido boa. Estamos analisando o seu relato com as áreas envolvidas com prioridade.',
  },
  {
    key: 'duvida_tecnica',
    label: 'Dúvida Técnica',
    situacao: 'sua dúvida enviada',
    message: 'Nossa equipe técnica vai analisar o seu relato e te dará um retorno detalhado em breve.',
  },
  {
    key: 'generico',
    label: 'Genérico',
    situacao: 'seu feedback',
    message: 'Agradecemos por nos ajudar a melhorar nossos processos continuamente.',
  },
]

// --- Props ---

interface CustomMessageModalProps {
  open: boolean
  title: string
  type: DialogType
  onClose: () => void
  dataSend: IRating | null
  sendCustomMessage: (message: string, item: IRating) => Promise<unknown>
  sendCustomMessage72h: (payload: { npsConsultaId: string; situacao: string; message: string; fone: string }) => Promise<unknown>
  sendClassification: (classification: string, subclassification: string | null, item: IRating) => Promise<unknown>
  isLoading: boolean
}

export function CustomMessageModal({
  open,
  title,
  type,
  onClose,
  dataSend,
  sendCustomMessage,
  sendCustomMessage72h,
  sendClassification,
  isLoading,
}: CustomMessageModalProps) {
  const hook = useCustomMessageModal(dataSend)

  if (!open) return null

  function handleClose() {
    hook.resetAll()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-4 max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border border-gray-700 bg-[#1b2030] shadow-2xl"
      >
        <div className="border-b border-gray-700 px-6 py-4 text-center">
          <h2 className="font-[Poppins] text-lg font-medium text-white">{title}</h2>
        </div>

        <div className="px-6 py-4">
          {type === 'answer' && (
            <ContentAnswer24h
              dataSend={dataSend}
              message={hook.message24h}
              setMessage={hook.setMessage24h}
              onSend={async () => {
                if (hook.message24h && dataSend) {
                  await sendCustomMessage(hook.message24h, dataSend)
                  hook.setMessage24h('')
                }
              }}
              isLoading={isLoading}
            />
          )}
          {type === 'answer72h' && (
            <ContentAnswer72h
              dataSend={dataSend}
              situacao={hook.situacao}
              setSituacao={hook.setSituacao}
              message={hook.message72h}
              setMessage={hook.setMessage72h}
              templatePreset={hook.templatePreset}
              setTemplatePreset={hook.setTemplatePreset}
              onSend={async () => {
                if (dataSend && hook.situacao && hook.message72h) {
                  await sendCustomMessage72h({
                    npsConsultaId: dataSend.npsConsultaId,
                    situacao: hook.situacao,
                    message: hook.message72h,
                    fone: dataSend.fone,
                  })
                  hook.setSituacao('')
                  hook.setMessage72h('')
                }
              }}
              isLoading={isLoading}
            />
          )}
          {type === 'classification' && (
            <ContentClassification
              dataSend={dataSend}
              classification={hook.classification}
              setClassification={hook.setClassification}
              subClassification={hook.subClassification}
              setSubClassification={hook.setSubClassification}
              classificationsQuery={hook.classificationsQuery}
              subclassificationsQuery={hook.subclassificationsQuery}
              historicQuery={hook.historicQuery}
              onSend={async () => {
                if (hook.classification && dataSend) {
                  await sendClassification(hook.classification, hook.subClassification || null, dataSend)
                  hook.setClassification('')
                  hook.setSubClassification('')
                  hook.historicQuery.refetch()
                }
              }}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// --- 24h Content ---

function ContentAnswer24h({
  dataSend, message, setMessage, onSend, isLoading,
}: {
  dataSend: IRating | null; message: string; setMessage: (v: string) => void
  onSend: () => Promise<void>; isLoading: boolean
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-300"><b>Cliente:</b> {dataSend?.cliente}</p>
      <p className="text-sm text-gray-300"><b>Comentário:</b> {dataSend?.comentario}</p>
      <textarea
        placeholder="Escreva uma mensagem personalizada..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-gray-600 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex justify-end">
        <ActionButton label="Enviar mensagem" disabled={!message} onClick={onSend} isLoading={isLoading} />
      </div>
    </div>
  )
}

// --- 72h Content ---

function ContentAnswer72h({
  dataSend, situacao, setSituacao, message, setMessage,
  templatePreset, setTemplatePreset, onSend, isLoading,
}: {
  dataSend: IRating | null; situacao: string; setSituacao: (v: string) => void
  message: string; setMessage: (v: string) => void
  templatePreset: string; setTemplatePreset: (v: string) => void
  onSend: () => Promise<void>; isLoading: boolean
}) {
  function handleSelectTemplate(key: string) {
    setTemplatePreset(key)
    const t = TEMPLATES_72H.find((t) => t.key === key)
    if (t) { setSituacao(t.situacao); setMessage(t.message) }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-yellow-600/40 bg-yellow-900/20 px-3 py-2 text-sm text-yellow-300">
        Resposta após 24h (janela 72h). Você pode usar um modelo ou escrever do zero.
      </div>
      <p className="text-sm text-gray-300"><b>Cliente:</b> {dataSend?.cliente}</p>
      <p className="text-sm text-gray-300"><b>Comentário:</b> {dataSend?.comentario}</p>

      <select
        value={templatePreset}
        onChange={(e) => handleSelectTemplate(e.target.value)}
        className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-white"
      >
        <option value="">Selecione um modelo</option>
        {TEMPLATES_72H.map((t) => (
          <option key={t.key} value={t.key}>{t.label}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder='Situação (ex.: "seu feedback")'
        value={situacao}
        onChange={(e) => setSituacao(e.target.value)}
        className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
      />
      <textarea
        placeholder="Escreva uma mensagem personalizada..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-gray-600 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
      />
      <div className="flex justify-end">
        <ActionButton label="Enviar mensagem" disabled={!situacao || !message} onClick={onSend} isLoading={isLoading} />
      </div>
    </div>
  )
}

// --- Classification Content ---

function ContentClassification({
  dataSend, classification, setClassification, subClassification, setSubClassification,
  classificationsQuery, subclassificationsQuery, historicQuery, onSend, isLoading,
}: {
  dataSend: IRating | null
  classification: string; setClassification: (v: string) => void
  subClassification: string; setSubClassification: (v: string) => void
  classificationsQuery: ReturnType<typeof useCustomMessageModal>['classificationsQuery']
  subclassificationsQuery: ReturnType<typeof useCustomMessageModal>['subclassificationsQuery']
  historicQuery: ReturnType<typeof useCustomMessageModal>['historicQuery']
  onSend: () => Promise<void>; isLoading: boolean
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-300"><b>Cliente:</b> {dataSend?.cliente}</p>

      {/* Classification select */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-400">Classificação</label>
        <select
          value={classification}
          onChange={(e) => { setClassification(e.target.value); setSubClassification('') }}
          className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-white"
        >
          <option value="">Selecione</option>
          {classificationsQuery.data?.map((c, idx) => (
            <option key={`${c.dominio_Id}-${idx}`} value={c.vl_Dominio}>{c.ds_Valor_Dominio}</option>
          ))}
        </select>
      </div>

      {/* Subclassification select */}
      {classification && (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Subclassificação</label>
          {subclassificationsQuery.isLoading ? (
            <Loader2 className="animate-spin text-gray-400" size={20} />
          ) : (
            <select
              value={subClassification}
              onChange={(e) => setSubClassification(e.target.value)}
              className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-white"
            >
              <option value="">Selecione</option>
              {subclassificationsQuery.data?.map((s, idx) => (
                <option key={`${s.dominio_Id}-${idx}`} value={s.vl_Dominio}>{s.ds_Valor_Dominio}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Historic */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-400">Histórico</label>
        <div className="max-h-[200px] space-y-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
          {historicQuery.isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          )}
          {historicQuery.data && historicQuery.data.length > 0
            ? historicQuery.data.map((h) => (
                <div key={h.id} className="rounded-lg border border-gray-700 bg-[#f4f7ff] px-3 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#73808D]">
                    <span><b>Classificação:</b> {renderClassificationName(h.classification)}</span>
                    <span><b>Motivo:</b> {renderSubclassificationName(h.subclassification)}</span>
                    <span><b>Data:</b> {moment(h.dt_Register).format('DD/MM/YYYY HH:mm')}</span>
                  </div>
                </div>
              ))
            : !historicQuery.isLoading && (
                <p className="py-4 text-center text-sm text-gray-500">Não há dados a serem exibidos</p>
              )}
        </div>
      </div>

      <div className="flex justify-end">
        <ActionButton label="Salvar Classificação" disabled={!classification} onClick={onSend} isLoading={isLoading} />
      </div>
    </div>
  )
}

// --- Shared button ---

function ActionButton({
  label, disabled, onClick, isLoading,
}: {
  label: string; disabled: boolean; onClick: () => void; isLoading: boolean
}) {
  return (
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer',
        'hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      {isLoading && <Loader2 className="animate-spin" size={16} />}
      {label}
    </button>
  )
}

export default CustomMessageModal
