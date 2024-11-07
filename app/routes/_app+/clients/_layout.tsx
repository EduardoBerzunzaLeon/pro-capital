import { useCallback, useMemo, useState } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Outlet, useLoaderData, useNavigate} from "@remix-run/react";

import { clientLoader } from "~/application/client/client.loader";
import { Credit } from "~/.server/domain/entity";
import { DropdownCanRenovate } from "~/components/ui/dropdowns/DropdownCanRenovate";
import { DropdownCreditStatus } from "~/components/ui/dropdowns/DropdownCreditStatus";
import { HandlerSuccess } from "~/.server/reponses";
import { Key, SortDirection, Selection } from "~/.server/interfaces";
import { TableDetail, RowPerPage, Pagination, InputFilter, RangePickerDateFilter, SliderFilter, CurpForm, ExportDropdown, ChipStatusCredit } from "~/components/ui";
import { useDropdownBoolean, useParamsPaginator, useRenderCell } from "~/application";
import { useDropdown } from "~/application/hook/useDropdown";
import { clientAction } from '../../../application/client/client.action';
import { CreditAction } from "~/components/ui/credit/CreditAction";

export {
   clientLoader as loader,
   clientAction as action
}

interface Loader {
  data: Credit[],
  P: number,
  l: number,
  c: string,
  d: SortDirection,
  s: {column: string, value: string}[] ,
  start: string,
  end: string,
  isActive: string,
  curp: string,
  folder: { name: string },
  client: string,
  aval: string,
  municipality: string,
  town: string,
  group: string,
  creditStart: string,
  creditEnd: string,
  captureStart: string,
  captureEnd: string,
  canRenovate: string,
  debt: number | number[],
  total: number,
  status: string[],
  pageCount: number,
  currentPage: number,
  nextPage: number | null,
}

const columns = [
  { key: 'client.fullname', label: 'CLIENTE',  sortable: true },
  { key: 'aval.fullname', label: 'AVAL',  sortable: true},
  { key: 'client.curp', label: 'CLIENTE CURP', sortable: true},
  { key: 'client.address', label: 'DIRECCIÓN CLIENTE'},
  { key: 'aval.address', label: 'DIRECCIÓN AVAL'},
  { key: 'client.reference', label: 'REFERENCIA CLIENTE'},
  { key: 'aval.reference', label: 'REFERENCIA AVAL'},
  { key: 'folder.name', label: 'CARPETA', sortable: true},
  { key: 'folder.town.name', label: 'LOCALIDAD', sortable: true},
  { key: 'folder.town.municipality.name', label: 'MUNICIPIO', sortable: true},
  { key: 'folder.route.name', label: 'RUTA'},
  { key: 'group.name', label: 'GRUPO'},
  { key: 'amount', label: 'PRESTAMO'},
  { key: 'paymentAmount', label: 'PAGO DE PRESTAMO'},
  { key: 'captureAt', label: 'FECHA DE CAPTURA', sortable: true},
  { key: 'creditAt', label: 'FECHA DEL CREDITO', sortable: true},
  { key: 'canRenovate', label: 'RENOVACIÓN'},
  { key: 'nextPayment', label: 'PROXIMO PAGO', sortable: true},
  { key: 'lastPayment', label: 'ULTIMO PAGO', sortable: true},
  { key: 'currentDebt', label: 'DEUDA ACTUAL', sortable: true},
  { key: 'status', label: 'ESTATUS', sortable: true},
  { key: 'actions', label: 'ACCIONES'},
]

const INITIAL_VISIBLE_COLUMNS = [
  'client.fullname', 'aval.fullname', 'folder.name', 'creditAt', 'status', 'canRenovate', 'actions'
];

export default function ClientsPage() {

  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS)); 
  const navigate = useNavigate();

  const { 
    defaultStatus: defaultCanRenovate, 
    handleStatusChange: handleCanRenovate
  } = useDropdownBoolean({
    value: loader?.serverData?.canRenovate,
    param: 'canRenovate',
    trueField: 'renovate',
    falseField: 'noRenovate'
  });

  const { defaultValue, handleValueChange } = useDropdown({
    param: 'status',
    type: 'string',
    value: loader?.serverData?.status
  });

  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({
    columnDefault: 'captureAt'
  });

  const { render } = useRenderCell({ isMoney: true }); 
   
  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === 'string') return columns;
    if (visibleColumns.has('all')) return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const renderCell = useCallback((credit: Credit, columnKey: Key) => {
    
    if(columnKey === 'canRenovate' && credit.canRenovate) {
      return <Button variant='ghost' color='primary' onPress={() => { navigate(`/clients/${credit.client.curp}/renovate/${credit.id}`) }}>Renovar</Button>
    }

    if(columnKey === 'actions') {
      return <CreditAction 
        creditId={credit.id}
      />
    }
    
    if(columnKey === 'status') {
      return ( <ChipStatusCredit status={credit.status} /> )
    }

    return <span className='capitalize'>{render(credit, columnKey)}</span>

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [visibleColumns])

  return <>
    <Outlet />
    <CurpForm />
    <ExportDropdown />
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
        defaultValue={loader?.serverData?.folder?.name}
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
        start={loader?.serverData.creditStart} 
        end={loader?.serverData.creditEnd} 
      />
      <DropdownCanRenovate 
        onSelectionChange={handleCanRenovate} 
        defaultSelectedKeys={defaultCanRenovate}
      />
      <DropdownCreditStatus 
        onSelectionChange={handleValueChange} 
        defaultSelectedKeys={defaultValue}
      />
      {/* TODO: traer de la base de datos el credito mas grande */}
      <SliderFilter 
        label='deuda'
        maxValue={10000}
        param='debt'
        value={loader?.serverData?.debt}
      />
    </div>
    <TableDetail 
        aria-label="credits table"
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
              Total {loader?.serverData.total || 0} Creditos
            </span>
            <RowPerPage
              onChange={handleRowPerPage} 
              checkParams
            />
          </div>
        } 
        columns={columns} 
        loadingState={loadingState} 
        emptyContent="No se encontraron creditos" 
        renderCell={renderCell} 
        data={loader?.serverData.data ?? []}    
    />
  </>
}