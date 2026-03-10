'use client'

import { useMemo } from 'react'
import { CheckCheck, X, PenSquare } from 'lucide-react'
import type { IRatingRecepcionistas, NpsColumn, Order } from '@/types/nps'
import { renderUnidadeName, renderClassification, renderSubclassification, renderQuestStars } from '../npsHelpers'

interface ColumnDeps {
  data: IRatingRecepcionistas[]
  selected: IRatingRecepcionistas[]
  order: Order
  orderBy: keyof IRatingRecepcionistas
  isSelected: (item: IRatingRecepcionistas) => boolean
  isCheckedAll: (data: IRatingRecepcionistas[]) => boolean
  handleSelected: (item: IRatingRecepcionistas) => void
  handleSelectedAll: (checked: boolean, data: IRatingRecepcionistas[]) => void
  handleRequestSort: (property: keyof IRatingRecepcionistas) => void
  handleOpenModal: (type: 'classification' | 'answer', data: IRatingRecepcionistas) => void
}

export function useRecepcionistasListColumns(deps: ColumnDeps): NpsColumn<IRatingRecepcionistas>[] {
  const { data, selected, isSelected, isCheckedAll, handleSelected, handleSelectedAll, handleOpenModal } = deps

  return useMemo<NpsColumn<IRatingRecepcionistas>[]>(() => [
    {
      id: 'checkbox', label: '', align: 'center', sticky: true, stickyLeft: 0, minWidth: 50,
      renderHeader: () => (
        <input type="checkbox" checked={isCheckedAll(data)} onChange={(e) => handleSelectedAll(e.target.checked, data)} className="accent-blue-500" />
      ),
      renderValue: (row) => (
        <input
          type="checkbox"
          disabled={!row.fone || row.reply || row.isExpired}
          checked={isSelected(row)}
          onChange={() => handleSelected(row)}
          className="accent-blue-500"
        />
      ),
    },
    {
      id: 'cd_pessoa_fisica', label: 'Recepcionista', align: 'center', sticky: true, stickyLeft: 50, minWidth: 160,
      sortable: true, sortKey: 'cd_pessoa_fisica',
      renderValue: (row) => <span className="whitespace-nowrap">{row.cd_pessoa_fisica}</span>,
    },
    {
      id: 'name', label: 'Cliente', align: 'center', minWidth: 200,
      sortable: true, sortKey: 'name',
      renderValue: (row) => <span className="whitespace-nowrap">{row.name ?? '--'}</span>,
    },
    {
      id: 'fone', label: 'Fone', align: 'center', minWidth: 130,
      renderValue: (row) => <span>{row.fone ?? '--'}</span>,
    },
    {
      id: 'resp1', label: 'Avaliação', align: 'center', minWidth: 120,
      renderValue: (row) => <span>{renderQuestStars(row.resp1) ?? '--'}</span>,
    },
    {
      id: 'resp2', label: 'Comentário', align: 'center', minWidth: 300, maxWidth: 450,
      renderValue: (row) => (
        <div className="max-h-[60px] max-w-[450px] overflow-auto px-2 text-left text-xs scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
          {row.resp2 ?? '--'}
        </div>
      ),
    },
    {
      id: 'ds_estabelecimento', label: 'Unidade', align: 'center', minWidth: 160,
      renderValue: (row) => <span>{renderUnidadeName(row.cd_estabelecimento)}</span>,
    },
    {
      id: 'ds_local', label: 'Local', align: 'center', minWidth: 160,
      renderValue: (row) => (
        <div className="max-w-[150px] break-words whitespace-pre-wrap text-xs">
          {row.ds_local ?? '--'}
        </div>
      ),
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
      id: 'acao', label: '', align: 'center', sticky: true, stickyRight: 0, minWidth: 60,
      renderValue: (row) => (
        <button
          disabled={row.reply || row.isExpired || !row.fone}
          title={row.reply || row.isExpired ? 'Não disponível' : 'Escrever mensagem personalizada'}
          onClick={() => handleOpenModal('answer', row)}
          className="rounded p-1 text-white transition-colors hover:bg-gray-600 disabled:opacity-30"
        >
          <PenSquare size={18} />
        </button>
      ),
    },
  ], [data, selected, isSelected, isCheckedAll, handleSelected, handleSelectedAll, handleOpenModal])
}
