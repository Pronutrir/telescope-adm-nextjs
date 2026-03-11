'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Edit3, Info } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { EditPageGrid } from './EditPageGrid'
import type { EditState } from './usePDFEdit'

interface PDFEditModalProps {
  isDark: boolean
  editState: EditState
  onClose: () => void
  onSaveEdit: () => void
  onTogglePage: (pageNumber: number) => void
  onToggleAllPages: () => void
  onFileNameChange: (value: string) => void
}

export const PDFEditModal: React.FC<PDFEditModalProps> = ({
  isDark, editState, onClose, onSaveEdit,
  onTogglePage, onToggleAllPages, onFileNameChange,
}) => {
  const keptCount = editState.pages.filter(p => p.selected).length
  const removedCount = editState.pages.length - keptCount
  const allSelected = editState.pages.every(p => p.selected)

  return (
    <Modal isOpen={editState.isOpen} onClose={onClose} title="Editar PDF" size="xl">
      <div className="space-y-6">
        {/* Nome do arquivo */}
        <div>
          <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
            Nome do Arquivo *
          </label>
          <input
            type="text"
            value={editState.form.fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="nome-do-arquivo.pdf"
            className={cn(
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            )}
          />
          <p className={cn('text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-500')}>
            Altere apenas o nome, mantendo a extensão .pdf
          </p>
        </div>

        {/* Seleção de páginas */}
        <div className={cn('border rounded-lg p-4', isDark ? 'border-gray-600' : 'border-gray-200')}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>Páginas do Documento</h4>
              <p className={cn('text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}>
                Desmarque as páginas que deseja excluir
              </p>
            </div>
            {editState.pages.length > 0 && (
              <div className="flex items-center gap-4">
                <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-600')}>
                  {keptCount} de {editState.pages.length} mantidas
                </span>
                <Button size="sm" variant="outline" onClick={onToggleAllPages}>
                  {allSelected ? 'Desmarcar Todas' : 'Marcar Todas'}
                </Button>
              </div>
            )}
          </div>

          {editState.isLoadingPages ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <p className={cn('mt-2 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>Carregando páginas...</p>
            </div>
          ) : editState.pages.length > 0 ? (
            <>
              <EditPageGrid isDark={isDark} pages={editState.pages} onTogglePage={onTogglePage} />

              <div className={cn(
                'mt-4 text-xs p-3 rounded-lg flex items-center gap-2',
                isDark ? 'bg-blue-900/20 border border-blue-800/50 text-blue-300' : 'bg-blue-50 border border-blue-200 text-blue-700'
              )}>
                <Info className="w-4 h-4 shrink-0" />
                <span>Clique nas páginas para alternar entre &quot;Manter&quot; e &quot;Excluir&quot;. Páginas &quot;Excluir&quot; serão removidas permanentemente.</span>
              </div>

              {/* Resumo */}
              <div className={cn('mt-4 p-4 rounded-lg border', isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200')}>
                <h5 className={cn('font-medium mb-2', isDark ? 'text-white' : 'text-gray-900')}>Resumo</h5>
                <div className="grid grid-cols-3 gap-4 text-sm text-center">
                  <div>
                    <div className={cn('text-lg font-bold', isDark ? 'text-gray-300' : 'text-gray-600')}>{editState.pages.length}</div>
                    <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>Total</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">{keptCount}</div>
                    <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>Manter</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-500">{removedCount}</div>
                    <div className={cn('text-xs', isDark ? 'text-gray-400' : 'text-gray-500')}>Excluir</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className={cn('text-center py-8 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
              Não foi possível carregar as páginas
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={editState.isLoading}>Cancelar</Button>
          <Button
            onClick={onSaveEdit}
            disabled={!editState.form.fileName.trim() || keptCount === 0 || editState.isLoading}
            className="inline-flex items-center gap-2"
          >
            {editState.isLoading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Salvando...</>
            ) : (
              <><Edit3 className="w-4 h-4" /> Salvar Alterações</>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
