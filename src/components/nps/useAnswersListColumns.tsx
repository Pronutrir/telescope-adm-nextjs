'use client'

import { useMemo } from 'react'
import { CheckCheck, X, PenSquare, Smile, Frown, Annoyed } from 'lucide-react'
import type { IRating, NpsColumn, Order } from '@/types/nps'
import { renderQuestStars, renderUnidadeName, renderClassification, renderSubclassification } from './npsHelpers'

interface ColumnDeps {
  data: IRating[]
  selected: IRating[]
  order: Order
  orderBy: keyof IRating
  isSelected: (item: IRating) => boolean
  isCheckedAll: (data: IRating[]) => boolean
  handleSelected: (item: IRating) => void
  handleSelectedAll: (checked: boolean, data: IRating[]) => void
  handleRequestSort: (property: keyof IRating) => void
  handleOpenModal: (type: 'classification' | 'answer' | 'answer72h', data: IRating) => void
}

export function useAnswersListColumns(deps: ColumnDeps): NpsColumn<IRating>[] {
  const { data, selected, isSelected, isCheckedAll, handleSelected, handleSelectedAll, handleOpenModal } = deps

  return useMemo<NpsColumn<IRating>[]>(() => [
    {
      id: 'checkbox', label: '', align: 'center', sticky: true, stickyLeft: 0, minWidth: 50,
      renderHeader: () => (
        <input type="checkbox" checked={isCheckedAll(data)} onChange={(e) => handleSelectedAll(e.target.checked, data)} className="accent-blue-500" />
      ),
      renderValue: (row) => (
        <input type="checkbox" disabled={row.reply || row.isExpired} checked={isSelected(row)} onChange={() => handleSelected(row)} className="accent-blue-500" />
      ),
    },
    {
      id: 'cliente', label: 'Cliente', align: 'center', sticky: true, stickyLeft: 50, minWidth: 250,
      sortable: true, sortKey: 'cliente',
      renderValue: (row) => <span className="whitespace-nowrap">{row.cliente}</span>,
    },
    { id: 'ds_Medico', label: 'Médico', align: 'center', minWidth: 200 },
    { id: 'ds_especialidade', label: 'Especialidade', align: 'center', minWidth: 200 },
    { id: 'fone', label: 'Fone', align: 'center', minWidth: 130 },
    ...((['quest1', 'quest2', 'quest3', 'quest4', 'quest5', 'quest6'] as const).map((q, i) => ({
      id: q, label: ['Limpeza/Org.', 'Experiência', 'Atendimento', 'T. Espera', 'Comunicação', 'Atend./Médico'][i],
      align: 'center' as const, minWidth: 120,
      renderValue: (row: IRating) => <span>{renderQuestStars(row[q])}</span>,
    }))),
    {
      id: 'nota', label: 'NPS', align: 'center', minWidth: 60,
      renderValue: (row) => {
        const q7 = parseInt(row.quest7 ?? '0')
        if (q7 < 7) return <span title={`Detrator, nota: ${row.quest7}`}><Frown size={20} color="rgba(255,25,1,1)" /></span>
        if (q7 < 9) return <span title={`Neutro, nota: ${row.quest7}`}><Annoyed size={20} color="rgba(255,255,0,1)" /></span>
        return <span title={`Promotor, nota: ${row.quest7}`}><Smile size={20} color="rgba(85,255,1,1)" /></span>
      },
    },
    {
      id: 'comentario', label: 'Comentário', align: 'center', minWidth: 300, maxWidth: 450,
      renderValue: (row) => (
        <div className="max-h-[60px] max-w-[450px] overflow-auto px-2 text-left text-xs scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
          {row.comentario}
        </div>
      ),
    },
    {
      id: 'unidade', label: 'Unidade', align: 'center', minWidth: 160,
      renderValue: (row) => <span>{renderUnidadeName(row.unidade)}</span>,
    },
    {
      id: 'ds_convenio', label: 'Convênio', align: 'center', minWidth: 160,
      renderValue: (row) => <span>{row.ds_convenio?.split(' - ')[0]}</span>,
    },
    {
      id: 'classificacao', label: 'Classificação', align: 'center', minWidth: 120,
      renderValue: (row) => (
        <button className="cursor-pointer underline-offset-2 hover:underline" onClick={() => handleOpenModal('classification', row)}>
          {renderClassification(row.classificacao)}
        </button>
      ),
    },
    {
      id: 'subclassificacao', label: 'Motivo', align: 'center', minWidth: 120,
      renderValue: (row) => <span>{renderSubclassification(row.subclassificacao)}</span>,
    },
    {
      id: 'reply', label: 'Respondido?', align: 'center', minWidth: 100,
      renderValue: (row) => row.reply
        ? <span title="Respondido"><CheckCheck size={18} color="greenyellow" /></span>
        : <span title="Não respondido"><X size={18} color="indianred" /></span>,
    },
    {
      id: 'acao', label: 'Resposta', align: 'center', sticky: true, stickyRight: 0, minWidth: 60,
      renderValue: (row) => {
        const is24h = !row.isExpired
        return (
          <button
            disabled={row.reply}
            title={row.reply ? 'Já respondido' : is24h ? 'Resposta 24h' : 'Resposta 72h'}
            onClick={() => handleOpenModal(is24h ? 'answer' : 'answer72h', row)}
            className="rounded p-1 text-white transition-colors hover:bg-gray-600 disabled:opacity-30"
          >
            <PenSquare size={18} />
          </button>
        )
      },
    },
  ], [data, selected, isSelected, isCheckedAll, handleSelected, handleSelectedAll, handleOpenModal])
}
