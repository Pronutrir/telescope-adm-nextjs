'use client'

import { Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NpsTable } from '../NpsTable'
import { RecepcionistasListCards } from './RecepcionistasListCards'
import { NpsFilterMenuRecepcionistas } from './NpsFilterMenuRecepcionistas'
import { CustomMessageModalRecepcionistas } from './CustomMessageModalRecepcionistas'
import { useRecepcionistasList } from './useRecepcionistasList'
import { useRecepcionistasListColumns } from './useRecepcionistasListColumns'

const RecepcionistasList = () => {
  const hook = useRecepcionistasList()
  const columns = useRecepcionistasListColumns({
    data: hook.filteredData,
    selected: hook.selected,
    order: hook.order,
    orderBy: hook.orderBy,
    isSelected: hook.isSelected,
    isCheckedAll: hook.isCheckedAll,
    handleSelected: hook.handleSelected,
    handleSelectedAll: hook.handleSelectedAll,
    handleRequestSort: hook.handleRequestSort,
    handleOpenModal: hook.handleOpenModal,
  })

  return (
    <div className="space-y-6">
      {/* Date + search + filter */}
      <div className="bg-white dark:bg-[#212845] rounded-xl p-6 border border-gray-200 dark:border-gray-700/20 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-white">Data</label>
            <input
              type="date"
              value={hook.date}
              onChange={(e) => hook.setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            onClick={hook.handleSearch}
            disabled={!hook.date}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Pesquisar"
          >
            {hook.isFetching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Pesquisar
          </button>
          <NpsFilterMenuRecepcionistas
            optionsFilter={hook.optionsFilter}
            onChangeFilter={hook.handleChangeFilter}
            onSetAll={hook.handleSetAll}
            recepcionistas={hook.recepcionistas}
            locais={hook.locais}
          />
        </div>
      </div>

      {/* Summary cards */}
      <RecepcionistasListCards data={hook.data} isSuccess={hook.isSuccess} calcPercent={hook.calcPercent} />

      {/* Table */}
      <NpsTable<typeof hook.filteredData[number]>
        title="Pesquisa de Satisfação de Recepcionistas"
        columns={columns}
        data={hook.filteredData}
        order={hook.order}
        orderBy={hook.orderBy}
        page={hook.page}
        onChangePage={hook.setPage}
        rowsPerPageOptions={[5, 10, 20]}
        selectedCount={hook.selected.length}
        isSelectedRow={(item) => hook.isSelected(item)}
        keyExtractor={(item) => item.id}
      />

      {/* Send selected button */}
      <div className="flex justify-end">
        <button
          disabled={!hook.selected.length || hook.isLoadingSend}
          onClick={hook.handleSendMessages}
          className={cn(
            'rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors cursor-pointer',
            'hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          Enviar Selecionados
          {hook.isLoadingSend && <Loader2 className="ml-2 inline animate-spin" size={16} />}
        </button>
      </div>

      {/* Modal */}
      {hook.modalControl.open && (
        <CustomMessageModalRecepcionistas
          open={hook.modalControl.open}
          title={hook.modalControl.title}
          type={hook.modalControl.type}
          onClose={hook.handleCloseModal}
          dataSend={hook.customMessageData}
          sendCustomMessage={hook.sendCustomMessage}
          sendClassification={hook.sendClassification}
          isLoading={hook.isLoadingModal}
        />
      )}
    </div>
  )
}

export default RecepcionistasList
