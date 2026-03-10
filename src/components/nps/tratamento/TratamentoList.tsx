'use client'

import { Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NpsTable } from '../NpsTable'
import { TratamentoListCards } from './TratamentoListCards'
import { NpsFilterMenuTratamento } from './NpsFilterMenuTratamento'
import { CustomMessageModalTratamento } from './CustomMessageModalTratamento'
import { useTratamentoList } from './useTratamentoList'
import { useTratamentoListColumns } from './useTratamentoListColumns'
import { NpsDatePicker } from '../NpsDatePicker'

const TratamentoList = () => {
  const hook = useTratamentoList()
  const columns = useTratamentoListColumns({
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
      {/* Date range + search + filter */}
      <div className="bg-white dark:bg-[#212845] rounded-xl p-6 border border-gray-200 dark:border-gray-700/20 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <NpsDatePicker
            label="Data início"
            name="startDate"
            value={hook.startDate}
            onChange={(_, val) => hook.setStartDate(val)}
            maxDate={new Date()}
          />
          <NpsDatePicker
            label="Data fim"
            name="endDate"
            value={hook.endDate}
            onChange={(_, val) => hook.setEndDate(val)}
            maxDate={new Date()}
          />
          <button
            onClick={hook.handleSearch}
            disabled={!hook.startDate || !hook.endDate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Pesquisar"
          >
            {hook.isFetching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Pesquisar
          </button>
          <NpsFilterMenuTratamento
            optionsFilter={hook.optionsFilter}
            onChangeFilter={hook.handleChangeFilter}
            onSetAll={hook.handleSetAll}
            medicos={hook.medicos}
            convenios={hook.convenios}
          />
        </div>
      </div>

      {/* Summary cards */}
      <TratamentoListCards data={hook.data} isSuccess={hook.isSuccess} calcPercent={hook.calcPercent} />

      {/* Table */}
      <NpsTable<typeof hook.filteredData[number]>
        title="Pesquisa de Satisfação de Tratamentos"
        columns={columns}
        data={hook.filteredData}
        order={hook.order}
        orderBy={hook.orderBy}
        page={hook.page}
        onChangePage={hook.setPage}
        rowsPerPageOptions={[5, 10, 20]}
        selectedCount={hook.selected.length}
        isSelectedRow={(item) => hook.isSelected(item)}
        keyExtractor={(item) => item.npsTratamentoId}
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
        <CustomMessageModalTratamento
          open={hook.modalControl.open}
          title={hook.modalControl.title}
          type={hook.modalControl.type}
          onClose={hook.handleCloseModal}
          dataSend={hook.customMessageData}
          sendCustomMessage={hook.sendCustomMessage}
          sendCustomMessage72h={hook.sendCustomMessage72h}
          sendClassification={hook.sendClassification}
          isLoading={hook.isLoadingModal}
        />
      )}
    </div>
  )
}

export default TratamentoList
