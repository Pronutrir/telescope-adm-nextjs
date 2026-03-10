'use client'

import { useMemo } from 'react'
import { CheckCheck, X, PenSquare, Smile, Frown, Annoyed } from 'lucide-react'
import type { IRatingQuimio, NpsColumn, Order } from '@/types/nps'
import { renderUnidadeName, renderClassification, renderSubclassification, renderQuestStars } from '../npsHelpers'

function renderNpsIcon(valor?: string | null) {
  if (!valor) return <span className="text-gray-500 text-xs">--</span>
  const n = parseInt(valor)
  if (n < 7) return <span className="flex items-center justify-center gap-1 text-xs text-red-400"><Frown size={16} />{valor}</span>
  if (n < 9) return <span className="flex items-center justify-center gap-1 text-xs text-yellow-400"><Annoyed size={16} />{valor}</span>
  return <span className="flex items-center justify-center gap-1 text-xs text-green-400"><Smile size={16} />{valor}</span>
}

interface ColumnDeps {
  data: IRatingQuimio[]
  selected: IRatingQuimio[]
  order: Order
  orderBy: keyof IRatingQuimio
  isSelected: (item: IRatingQuimio) => boolean
  isCheckedAll: (data: IRatingQuimio[]) => boolean
  handleSelected: (item: IRatingQuimio) => void
  handleSelectedAll: (checked: boolean, data: IRatingQuimio[]) => void
  handleRequestSort: (property: keyof IRatingQuimio) => void
  handleOpenModal: (type: 'classification' | 'answer' | 'answer72h', data: IRatingQuimio) => void
}

export function useQuimioListColumns(deps: ColumnDeps): NpsColumn<IRatingQuimio>[] {
  const { data, selected, isSelected, isCheckedAll, handleSelected, handleSelectedAll, handleOpenModal } = deps

  return useMemo<NpsColumn<IRatingQuimio>[]>(() => [
    {
      id: 'checkbox', label: '', align: 'center', sticky: true, stickyLeft: 0, minWidth: 50,
      renderHeader: () => (
        <input type="checkbox" checked={isCheckedAll(data)} onChange={(e) => handleSelectedAll(e.target.checked, data)} className="accent-blue-500" />
      ),
      renderValue: (row) => (
        <input type="checkbox" disabled={!row.fone || row.reply || row.isExpired} checked={isSelected(row)} onChange={() => handleSelected(row)} className="accent-blue-500" />
      ),
    },
    {
      id: 'cliente', label: 'Cliente', align: 'center', sticky: true, stickyLeft: 50, minWidth: 250,
      sortable: true, sortKey: 'cliente',
      renderValue: (row) => <span className="whitespace-nowrap">{row.cliente}</span>,
    },
    { id: 'medico', label: 'Médico', align: 'center', minWidth: 200 },
    { id: 'fone', label: 'Fone', align: 'center', minWidth: 130 },
    ...((['quest1', 'quest2', 'quest3', 'quest4', 'quest5', 'quest6'] as const).map((q, i) => ({
      id: q,
      label: ['Facilidade Agendamento', 'Atend. Recepção', 'Tempo Espera', 'Acolhimento Enf.', 'Acesso Med/Enf', 'Satisf. Tratamento'][i],
      align: 'center' as const, minWidth: 130,
      renderValue: (row: IRatingQuimio) => {
        const stars = renderQuestStars(row[q])
        return stars ? <span>{stars}</span> : <span className="text-gray-500 text-xs">--</span>
      },
    }))),
    {
      id: 'nps', label: 'NPS', align: 'center', minWidth: 80,
      renderValue: (row) => renderNpsIcon(row.quest7),
    },
    {
      id: 'cd_estabelecimento', label: 'Unidade', align: 'center', minWidth: 160,
      renderValue: (row) => <span>{renderUnidadeName(row.cd_estabelecimento)}</span>,
    },
    {
      id: 'convenio', label: 'Convênio', align: 'center', minWidth: 160,
      renderValue: (row) => <span>{row.convenio?.split(' - ')[0]}</span>,
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
