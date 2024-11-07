import { SortDirection, Selection, Key } from '~/.server/interfaces';
import { paymentLoader } from '../../../application/payment/payment.loader';
import { Payment } from '~/.server/domain/entity';
import { useLoaderData } from '@remix-run/react';
import { useCallback, useMemo, useState } from 'react';
import { HandlerSuccess } from '~/.server/reponses';
import { useParamsPaginator, useRenderCell } from '~/application';
import { Select, SelectItem, } from '@nextui-org/react';
import { InputFilter, Pagination, RangePickerDateFilter, RowPerPage, SliderFilter, TableDetail } from '~/components/ui';
import { DropdownPaymentStatus } from '~/components/ui/dropdowns/DropDownPaymentStatus';
import { useDropdown } from '~/application/hook/useDropdown';

export {
    paymentLoader as loader
}

interface Loader {
    data: Payment[],
    P: number,
    l: number,
    c: string,
    d: SortDirection,
    s: {column: string, value: string}[] ,
    start: string,
    end: string,
    isActive: string,
    curp: string,
    folder: string,
    client: string,
    aval: string,
    agent: string,
    municipality: string,
    town: string,
    group: string,
    captureStart: string,
    captureEnd: string,
    debt: number | number[],
    total: number,
    status: string[],
    paymentAmount: number,
    paymentStart: string,
    paymentEnd: string,
    pageCount: number,
    currentPage: number,
    nextPage: number | null,
  }

  const columns = [
    { key: 'credit.client.fullname', label: 'CLIENTE',  sortable: true },
    { key: 'credit.aval.fullname', label: 'AVAL',  sortable: true},
    { key: 'credit.client.curp', label: 'CLIENTE CURP', sortable: true},
    { key: 'credit.folder.name', label: 'CARPETA', sortable: true},
    { key: 'credit.folder.town.name', label: 'LOCALIDAD', sortable: true},
    { key: 'credit.folder.town.municipality.name', label: 'MUNICIPIO', sortable: true},
    { key: 'credit.folder.route.name', label: 'RUTA'},
    { key: 'credit.group.name', label: 'GRUPO'},
    { key: 'paymentAmount', label: 'PAGO'},
    { key: 'captureAt', label: 'FECHA DE CAPTURA', sortable: true},
    { key: 'paymentDate', label: 'FECHA DEL PAGO', sortable: true},
    { key: 'credit.currentDebt', label: 'DEUDA ACTUAL', sortable: true},
    { key: 'status', label: 'ESTATUS', sortable: true},
    { key: 'folio', label: 'FOLIO', sortable: true},
    { key: 'notes', label: 'NOTAS' },
    { key: 'agent.fullName', label: 'AGENTE' },
    { key: 'actions', label: 'ACCIONES'},
  ]

  const INITIAL_VISIBLE_COLUMNS = [
    'credit.client.fullname', 'credit.folder.name','credit.group.name', 'paymentAmount', 'folio', 'actions'
  ]

export default function PaymentPage( ) {
    const loader = useLoaderData<HandlerSuccess<Loader>>();
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS)); 

  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({ columnDefault: 'captureAt' });

  const { render } = useRenderCell({ isMoney: true }); 

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === 'string') return columns;
    if (visibleColumns.has('all')) return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const renderCell = useCallback((payment: Payment, columnKey: Key) => {
    
    // if(columnKey === 'canRenovate' && credit.canRenovate) {
    //   return <Button variant='ghost' color='primary' onPress={() => { navigate(`/clients/${credit.client.curp}/renovate/${credit.id}`) }}>Renovar</Button>
    // }

    // if(columnKey === 'actions') {
    //   return <CreditAction 
    //     creditId={credit.id}
    //   />
    // }
    
    // if(columnKey === 'status') {
    //   return ( <ChipStatusCredit status={credit.status} /> )
    // }

    return <span className='capitalize'>{render(payment, columnKey)}</span>

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  const { defaultValue, handleValueChange } = useDropdown({
    param: 'status',
    type: 'string',
    value: loader?.serverData?.status
  });


  const topContent = useMemo(() => {
    return (<Select
      label="Columnas"
      placeholder="Seleccione una columna"
      selectionMode="multiple"
      variant="bordered"
      labelPlacement="outside"
      className="max-w-xs"
      disallowEmptySelection
      selectedKeys={visibleColumns}
      onSelectionChange={setVisibleColumns}
    >
      {columns.map((column) => (
        <SelectItem key={column.key}>
          {column.label}
        </SelectItem>
      ))}
    </Select>)
  }, [visibleColumns]);

  return (<>
   <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
      <InputFilter 
        param="client" 
        name="clientFullname" 
        label="Cliente" 
        id="clientFullname"
        className='w-full md:max-w-[30%]' 
        placeholder="Nombre del cliente"      
        defaultValue={loader?.serverData?.client}
      />
      <InputFilter 
        param="agent" 
        name="agentFullname" 
        label="Agente" 
        id="agentFullname"
        className='w-full md:max-w-[30%]' 
        placeholder="Nombre del asesor"      
        defaultValue={loader?.serverData?.agent}
      />
      <InputFilter 
        param="aval" 
        name="avalFullname" 
        label="Aval" 
        id="avalFullname" 
        className='w-full md:max-w-[30%]'
        placeholder="Nombre del Aval"      
        defaultValue={loader?.serverData?.aval}
      />
      <InputFilter 
        param="curp" 
        name="curp" 
        label="CURP" 
        id="curp" 
        className='w-full md:max-w-[30%]'
        placeholder="CURP del cliente"      
        defaultValue={loader?.serverData?.curp}
      />
      <InputFilter 
        param="municipality" 
        name="municipality" 
        label="Municipio" 
        id="municipality" 
        className='w-full md:max-w-[30%]'
        placeholder="Nombre del municipio"      
        defaultValue={loader?.serverData?.municipality}
      />
      <InputFilter 
        param="town" 
        name="town" 
        label="Localidad" 
        id="town" 
        className='w-full md:max-w-[30%]'
        placeholder="Nombre de la localidad"      
        defaultValue={loader?.serverData?.town}
      />
      <InputFilter 
        param="folder" 
        name="folder" 
        label="Carpeta" 
        id="folder" 
        className='w-full md:max-w-[30%]'
        placeholder="Nombre de la carpeta"      
        defaultValue={loader?.serverData?.folder}
      />
      <InputFilter 
        param="group" 
        name="group" 
        label="Grupo" 
        id="group" 
        className='w-full md:max-w-[30%]'
        placeholder="Número del grupo"      
        defaultValue={loader?.serverData?.group}
      />
      <RangePickerDateFilter 
        label="Rango de la fecha de captura" 
        startName="captureStart" 
        endName="captureEnd"
        start={loader?.serverData.captureStart} 
        end={loader?.serverData.captureEnd} 
      />
      <RangePickerDateFilter 
        label="Rango de la fecha de asignación" 
        startName="creditStart" 
        endName="creditEnd"
        start={loader?.serverData.paymentStart} 
        end={loader?.serverData.paymentEnd} 
      />
      <DropdownPaymentStatus 
        onSelectionChange={handleValueChange} 
        defaultSelectedKeys={defaultValue}
      />
        {/* TODO: traer de la base de datos el credito mas grande */}
      <SliderFilter 
        label='Deuda'
        maxValue={10000}
        param='debt'
        value={loader?.serverData?.debt}
        />
        {/* TODO: traer de la base de datos el pago mas grande */}
      <SliderFilter 
        label='Monto del Pago'
        maxValue={10000}
        param='debt'
        value={loader?.serverData?.paymentAmount}
      />
    </div>
    <TableDetail 
        aria-label="payments table"
        onSortChange={handleSort}
        sortDescriptor={sortDescriptor}
        headerColumns={headerColumns}
        bottomContent={
          <Pagination
            pageCount={loader?.serverData?.pageCount}
            currentPage={loader?.serverData?.currentPage}
            onChange={handlePagination} 
          />
        }
        topContent={
          <div className="flex justify-between items-center">
            {topContent}
            <span className="text-default-400 text-small">
              Total {loader?.serverData.total || 0} Pagos
            </span>
            <RowPerPage
              onChange={handleRowPerPage} 
              checkParams
            />
          </div>
        } 
        columns={columns} 
        loadingState={loadingState} 
        emptyContent="No se encontraron pagos" 
        renderCell={renderCell} 
        data={loader?.serverData.data ?? []}    
    />
  </>)

}