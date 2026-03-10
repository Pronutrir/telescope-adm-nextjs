'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import moment from 'moment'
import type { IRatingTratamento, DialogType, ICustomMessage72hTratamento } from '@/types/nps'
import { renderClassificationName, renderSubclassificationName } from '../npsHelpers'
import { useCustomMessageModalTratamento } from './useCustomMessageModalTratamento'

const TEMPLATES_72H = [
  { key: 'elogio_promotor', label: 'Elogio (Promotor)', situacao: 'sua experiência positiva', message: 'Ficamos muito felizes em saber que você teve um bom atendimento!' },
  { key: 'reclamacao_detrator', label: 'Reclamação (Detrator)', situacao: 'os pontos de melhoria', message: 'Sentimos muito que sua experiência não tenha sido boa. Estamos analisando o seu relato com as áreas envolvidas com prioridade.' },
  { key: 'duvida_tecnica', label: 'Dúvida Técnica', situacao: 'sua dúvida enviada', message: 'Nossa equipe técnica vai analisar o seu relato e te dará um retorno detalhado em breve.' },
  { key: 'generico', label: 'Genérico', situacao: 'seu feedback', message: 'Agradecemos por nos ajudar a melhorar nossos processos continuamente.' },
]

interface Props {
  open: boolean
  title: string
  type: DialogType
  onClose: () => void
  dataSend: IRatingTratamento | null
  sendCustomMessage: (message: string, item: IRatingTratamento) => Promise<unknown>
  sendCustomMessage72h: (payload: ICustomMessage72hTratamento) => Promise<unknown>
  sendClassification: (classification: string, subclassification: string | null, item: IRatingTratamento) => Promise<unknown>
  isLoading: boolean
}

export function CustomMessageModalTratamento({ open, title, type, onClose, dataSend, sendCustomMessage, sendCustomMessage72h, sendClassification, isLoading }: Props) {
  const hook = useCustomMessageModalTratamento(dataSend)

  if (!open) return null

  function handleClose() { hook.resetAll(); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()} className="mx-4 max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border border-gray-700 bg-[#1b2030] shadow-2xl">
        <div className="border-b border-gray-700 px-6 py-4 text-center">
          <h2 className="font-[Poppins] text-lg font-medium text-white">{title}</h2>
        </div>

        <div className="px-6 py-4">
          {type === 'answer' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-300"><b>Cliente:</b> {dataSend?.cliente}</p>
              <p className="text-sm text-gray-300"><b>Comentário:</b> {dataSend?.quest7}</p>
              <textarea
                placeholder="Escreva uma mensagem personalizada..."
                value={hook.message24h}
                onChange={(e) => hook.setMessage24h(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-600 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <ActionButton label="Enviar mensagem" disabled={!hook.message24h} onClick={async () => { if (hook.message24h && dataSend) { await sendCustomMessage(hook.message24h, dataSend); hook.setMessage24h('') } }} isLoading={isLoading} />
              </div>
            </div>
          )}

          {type === 'answer72h' && (
            <div className="space-y-3">
              <div className="rounded-md border border-yellow-600/40 bg-yellow-900/20 px-3 py-2 text-sm text-yellow-300">
                Resposta após 24h (janela 72h). Você pode usar um modelo ou escrever do zero.
              </div>
              <p className="text-sm text-gray-300"><b>Cliente:</b> {dataSend?.cliente}</p>
              <p className="text-sm text-gray-300"><b>Comentário:</b> {dataSend?.quest7}</p>
              <select
                value={hook.templatePreset}
                onChange={(e) => { const t = TEMPLATES_72H.find((t) => t.key === e.target.value); hook.setTemplatePreset(e.target.value); if (t) { hook.setSituacao(t.situacao); hook.setMessage72h(t.message) } }}
                className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-white"
              >
                <option value="">Selecione um modelo</option>
                {TEMPLATES_72H.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
              <input type="text" placeholder='Situação (ex.: "seu feedback")' value={hook.situacao} onChange={(e) => hook.setSituacao(e.target.value)} className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" />
              <textarea placeholder="Escreva uma mensagem personalizada..." value={hook.message72h} onChange={(e) => hook.setMessage72h(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-600 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none" />
              <div className="flex justify-end">
                <ActionButton
                  label="Enviar mensagem"
                  disabled={!hook.situacao || !hook.message72h}
                  onClick={async () => {
                    if (dataSend && hook.situacao && hook.message72h) {
                      await sendCustomMessage72h({ npsTratamentoId: dataSend.npsTratamentoId, situacao: hook.situacao, message: hook.message72h, fone: dataSend.fone })
                      hook.setSituacao(''); hook.setMessage72h('')
                    }
                  }}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {type === 'classification' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-300"><b>Cliente:</b> {dataSend?.cliente}</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Classificação</label>
                <select value={hook.classification} onChange={(e) => { hook.setClassification(e.target.value); hook.setSubClassification('') }} className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-white">
                  <option value="">Selecione</option>
                  {hook.classificationsQuery.data?.map((c, idx) => <option key={`${c.dominio_Id}-${idx}`} value={c.vl_Dominio}>{c.ds_Valor_Dominio}</option>)}
                </select>
              </div>
              {hook.classification && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-400">Subclassificação</label>
                  {hook.subclassificationsQuery.isLoading ? <Loader2 className="animate-spin text-gray-400" size={20} /> : (
                    <select value={hook.subClassification} onChange={(e) => hook.setSubClassification(e.target.value)} className="w-full rounded border border-gray-600 bg-transparent px-3 py-2 text-sm text-white">
                      <option value="">Selecione</option>
                      {hook.subclassificationsQuery.data?.map((s, idx) => <option key={`${s.dominio_Id}-${idx}`} value={s.vl_Dominio}>{s.ds_Valor_Dominio}</option>)}
                    </select>
                  )}
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Histórico</label>
                <div className="max-h-[200px] space-y-2 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
                  {hook.historicQuery.isLoading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-400" size={32} /></div>}
                  {hook.historicQuery.data && hook.historicQuery.data.length > 0
                    ? hook.historicQuery.data.map((h) => (
                        <div key={h.id} className="rounded-lg border border-gray-700 bg-[#f4f7ff] px-3 py-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#73808D]">
                            <span><b>Classificação:</b> {renderClassificationName(h.classification)}</span>
                            <span><b>Motivo:</b> {renderSubclassificationName(h.subclassification)}</span>
                            <span><b>Data:</b> {moment(h.dt_Register).format('DD/MM/YYYY HH:mm')}</span>
                          </div>
                        </div>
                      ))
                    : !hook.historicQuery.isLoading && <p className="py-4 text-center text-sm text-gray-500">Não há dados a serem exibidos</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <ActionButton label="Salvar Classificação" disabled={!hook.classification} onClick={async () => { if (hook.classification && dataSend) { await sendClassification(hook.classification, hook.subClassification || null, dataSend); hook.setClassification(''); hook.setSubClassification(''); hook.historicQuery.refetch() } }} isLoading={isLoading} />
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
