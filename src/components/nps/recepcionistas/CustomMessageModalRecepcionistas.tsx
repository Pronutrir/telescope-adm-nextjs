'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import moment from 'moment'
import type { IRatingRecepcionistas, DialogType } from '@/types/nps'
import { renderClassificationName, renderSubclassificationName } from '../npsHelpers'
import { useCustomMessageModalRecepcionistas } from './useCustomMessageModalRecepcionistas'

interface Props {
  open: boolean
  title: string
  type: DialogType
  onClose: () => void
  dataSend: IRatingRecepcionistas | null
  sendCustomMessage: (message: string, item: IRatingRecepcionistas) => Promise<unknown>
  sendClassification: (classification: string, subclassification: string | null, item: IRatingRecepcionistas) => Promise<unknown>
  isLoading: boolean
}

export function CustomMessageModalRecepcionistas({ open, title, type, onClose, dataSend, sendCustomMessage, sendClassification, isLoading }: Props) {
  const hook = useCustomMessageModalRecepcionistas(dataSend)

  if (!open) return null

  function handleClose() { hook.resetAll(); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()} className="mx-4 max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1b2030] shadow-2xl">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 text-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>
        </div>

        <div className="px-6 py-4">
          {type === 'answer' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300"><b>Cliente:</b> {dataSend?.name}</p>
              <p className="text-sm text-gray-300"><b>Comentário:</b> {dataSend?.resp2}</p>
              <textarea
                placeholder="Escreva uma mensagem personalizada..."
                value={hook.message}
                onChange={(e) => hook.setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <ActionButton
                  label="Enviar mensagem"
                  disabled={!hook.message}
                  onClick={async () => {
                    if (hook.message && dataSend) {
                      await sendCustomMessage(hook.message, dataSend)
                      hook.setMessage('')
                    }
                  }}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {type === 'classification' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300"><b>Cliente:</b> {dataSend?.name}</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Classificação</label>
                <select
                  value={hook.classification}
                  onChange={(e) => { hook.setClassification(e.target.value); hook.setSubClassification('') }}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="">Selecione</option>
                  {hook.classificationsQuery.data?.map((c, idx) => (
                    <option key={`${c.dominio_Id}-${idx}`} value={c.vl_Dominio}>{c.ds_Valor_Dominio}</option>
                  ))}
                </select>
              </div>
              {hook.classification && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Subclassificação</label>
                  {hook.subclassificationsQuery.isLoading ? (
                    <Loader2 className="animate-spin text-gray-400" size={20} />
                  ) : (
                    <select
                      value={hook.subClassification}
                      onChange={(e) => hook.setSubClassification(e.target.value)}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white"
                    >
                      <option value="">Selecione</option>
                      {hook.subclassificationsQuery.data?.map((s, idx) => (
                        <option key={`${s.dominio_Id}-${idx}`} value={s.vl_Dominio}>{s.ds_Valor_Dominio}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Histórico</label>
                <div className="max-h-[200px] space-y-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
                  {hook.historicQuery.isLoading && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin text-gray-400" size={32} />
                    </div>
                  )}
                  {hook.historicQuery.data && hook.historicQuery.data.length > 0
                    ? hook.historicQuery.data.map((h) => (
                        <div key={h.id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252d45] px-3 py-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 dark:text-[#73808D]">
                            <span><b>Classificação:</b> {renderClassificationName(h.classification)}</span>
                            <span><b>Motivo:</b> {renderSubclassificationName(h.subclassification)}</span>
                            <span><b>Data:</b> {moment(h.dt_Register).format('DD/MM/YYYY HH:mm')}</span>
                          </div>
                        </div>
                      ))
                    : !hook.historicQuery.isLoading && (
                        <p className="py-4 text-center text-sm text-gray-500">Não há dados a serem exibidos</p>
                      )}
                </div>
              </div>
              <div className="flex justify-end">
                <ActionButton
                  label="Salvar Classificação"
                  disabled={!hook.classification}
                  onClick={async () => {
                    if (hook.classification && dataSend) {
                      await sendClassification(hook.classification, hook.subClassification || null, dataSend)
                      hook.setClassification('')
                      hook.setSubClassification('')
                      hook.historicQuery.refetch()
                    }
                  }}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionButton({ label, disabled, onClick, isLoading }: { label: string; disabled: boolean; onClick: () => void; isLoading: boolean }) {
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
