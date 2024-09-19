
import { Generic, Key, SortDirection, Selection, Color } from "~/.server/interfaces";
// import dayjs from 'dayjs';
import { json, LoaderFunction } from "@remix-run/node";
import { HandlerSuccess, handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Credit } from "~/.server/domain/entity";
import { useParamsPaginator, useRenderCell } from "~/application";
import { TableDetail, RowPerPage, Pagination, InputFilter, RangePickerDateFilter } from "~/components/ui";
import { Button, Chip, Select, SelectItem, Slider } from "@nextui-org/react";
import { Status } from "~/.server/domain/entity/credit.entity";
import { DropdownCanRenovate } from "~/components/ui/dropdowns/DropdownCanRenovate";
import { DropdownCreditStatus } from "~/components/ui/dropdowns/DropdownCreditStatus";
import { FaSearch } from "react-icons/fa";


const columnsFilter = [
  'client.fullname', 'aval.fullname', 'captureAt', 'creditAt', 'folder.name',
  'group.name.fullname', 'folder.town.name', 'status', 'currentDebt', 'folder.town.municipality.name'
];

const columnSortNames: Generic = {
  curp: 'client.curp',
  client: 'client.fullname',
  aval: 'aval.fullname',
  captureAt: 'captureAt',
  creditAt: 'creditAt',
  status: 'status',
  folder: 'folder.name',
  town: 'folder.town.name',
  municipality: 'folder.town.municipality.name',
  nextPayment: 'nextPayment',
  lastPayment: 'lastPayment',
  currentDebt: 'currentDebt'
}

export const loader: LoaderFunction = async ({ request }) => {
  
  const url = new URL(request.url);
  // const start = url.searchParams.get('start') || '';
  // const end = url.searchParams.get('end') || '';
  const curp = url.searchParams.get('curp') || '';
  const aval = url.searchParams.get('aval') || '';
  const client = url.searchParams.get('client') || '';
  const folder = url.searchParams.get('folder') || '';
  const municipality = url.searchParams.get('municipality') || '';
  const town = url.searchParams.get('town') || '';
  const group = url.searchParams.get('group') || '';
  const creditStart = url.searchParams.get('creditStart') || '';
  const creditEnd = url.searchParams.get('creditEnd') || '';
  const captureStart = url.searchParams.get('captureStart') || '';
  const captureEnd = url.searchParams.get('captureEnd') || '';
  const status = url.searchParams.get('status') || '';
  const canRenovate = url.searchParams.get('canRenovate') || '';
  const debt = url.searchParams.get('debt') || '';
  // const client = url.searchParams.get('client') || '';
  // const status = url.searchParams.get('status') || '';
  // const town = url.searchParams.get('town') || '';
  // const municipality = url.searchParams.get('municipality') || '';


  const debtParsed = debt
    ? JSON.parse(debt)
    : '';

  const debtFormatted = {
    column: 'currentDebt',
    value: ''
  };

  if(Array.isArray(debtParsed) && debtParsed.length === 2) {
    debtFormatted.value = {
        start: Number(debtParsed[0]),
        end: Number(debtParsed[1])
    }
  }
   
  let statusParsed = status
    ? JSON.parse(status)
    : 'notUndefined';

  if(!Array.isArray(statusParsed)) {
    statusParsed = 'notUndefined';
  }
  
  let canRenovateParsed = canRenovate
    ? JSON.parse(canRenovate+'')
    : 'notUndefined';

  if(Array.isArray(canRenovateParsed) && canRenovateParsed.length === 1) {
    canRenovateParsed = Boolean(canRenovateParsed[0]);
  }

  if(Array.isArray(canRenovateParsed) && canRenovateParsed.length === 2) {
    canRenovateParsed = 'notUndefined'
  } 

  try {
  
      // const isActiveFormatted = { column: 'isActive', value: isActiveParsed };
      const curpParsed = { column: 'curp', value: curp };
      const folderParsed = { column: 'folder.name', value: folder.toLowerCase() };
      const fullnameParsed = { column: 'client.fullname', value: client.toLowerCase() };
      const statusFormatted = { column: 'status', value: statusParsed };
      const canRenovateFormatted = { column: 'canRenovate', value: canRenovateParsed };

      // const datesParsed = (!start || !end) 
      // ? { column: 'anniversaryDate', value: ''}
      // : { column:  'anniversaryDate', value: {
      //   start: dayjs(start+'T00:00:00.000Z').toDate(),
      //   end: dayjs(end).toDate()
      // }}
    
    const {
      page, limit, column, direction
    } = handlerPaginationParams(request.url, 'captureAt', columnsFilter);

    const data = await Service.credit.findAll({
      page, 
      limit, 
      column: columnSortNames[column] ?? 'captureAt', 
      direction,
      search: [
        curpParsed, 
        folderParsed, 
        fullnameParsed, 
        statusFormatted, 
        canRenovateFormatted,
        debtFormatted
     ]
    });
    
    return handlerSuccess(200, { 
      ...data,
      p: page,
      l: limit,
      c: column,
      d: direction,
      s: [curpParsed, folderParsed, fullnameParsed],
      curp,
      folder,
      aval: 
      client,
      municipality,
      status: statusParsed,
      canRenovate: canRenovateParsed,
      town,
      creditStart,
      creditEnd,
      captureStart,
      debt: debtParsed,
      captureEnd,
      group
    });
  } catch (error) {
    console.log({error});
      return json(getEmptyPagination({
        client,
        aval,
        curp,
        municipality,
        town,
        group,
        creditStart,
        creditEnd,
        canRenovate: canRenovateParsed,
        status: statusParsed,
        captureStart,
        debt: debtParsed,
        captureEnd,
      }));
  }
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
  // { key: 'id', label: 'ID' },
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

const statusRef: Record<Status, Color> = {
  ACTIVO: 'warning',
  VENCIDO: 'danger',
  LIQUIDADO: 'success',
  RENOVADO: 'primary',
  FALLECIDO: 'secondary'
}

export default function ClientsPage() {

  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));  
  const [ , setSearchParams] = useSearchParams();
  const [debt, setDebt] = useState<number | number[]>([0, 10000]);

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
    
    if(columnKey === 'canRenovate') {
      return <span className='capitalize'>{credit.canRenovate}</span>
    }

    if(columnKey === 'actions') {
      return <span className='capitalize'>ACCIONES</span>
    }
    
    if(columnKey === 'status') {
      const color = statusRef[credit.status] ?? 'secondary';
      return ( <Chip color={color} variant="bordered">{credit.status}</Chip>)
    }

    return <span className='capitalize'>{render(credit, columnKey)}</span>

  }, [])

  const defaultStatus: Selection = useMemo(() => {

    if(!loader?.serverData?.status) {
      return 'all';
    }

    const { status } = loader.serverData;

    if(!Array.isArray(status) ) {
      return 'all'
    }

    const areStrings =  status.every((value) => typeof value === 'string');

    if(!areStrings) {
      return 'all';
    }

    return new Set(status);

  }, [loader])

  useEffect(() => {

    if(!loader?.serverData?.debt) {
      setDebt([0, 10000]);
      return;
    }
    
    const {debt} = loader.serverData;
    if(typeof debt === 'number') {
      setDebt([0, debt]);
      return;
    }

    const areNumbers = debt.every((value) => !isNaN(value));

    if(!areNumbers) {
      setDebt([0, 10000]);
      return;
    }

    if(debt.length !== 2) {
      setDebt([0, 10000]);
      return;
    }

    setDebt([debt[0], debt[1]]);

  }, [loader])

  const defaultCanRenovate: Selection = useMemo(() => {

    if(!loader?.serverData?.canRenovate) {
      return 'all';
    }

    const { canRenovate } = loader.serverData;

    if(canRenovate === 'notUndefined') {
      return 'all'
    }

    const selectedStatus: Set<Key> = new Set();

    canRenovate
      ? selectedStatus.add('renovate')
      : selectedStatus.add('noRenovate');

    return selectedStatus;

  }, [loader]);

  const handleStatusChange = (keys: Selection) => {
    const data = JSON.stringify(Array.from(keys));
    setSearchParams(prev => {
      prev.set('status',data)
      return prev;
    })
  }
  
  const handleCanRenovate = (keys: Selection) => {
    const data = JSON.stringify(Array.from(keys).map(value => value === 'renovate'));
    setSearchParams(prev => {
      prev.set('canRenovate',data)
      return prev;
    })
  }

  const handleDebtChange = () => {
    const data = Array.isArray(debt) ? JSON.stringify(debt) : debt+'';
    setSearchParams(prev => {
      prev.set('debt', data);
      return prev;
    })
  }


  const topContent = useMemo(() => {
    return (<Select
      label="Columnas"
      placeholder="Seleccione una columna"
      selectionMode="multiple"
      variant="bordered"
      labelPlacement="outside"
      className="max-w-xs"
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
        onSelectionChange={handleStatusChange} 
        defaultSelectedKeys={defaultStatus}
      />
      {/* TODO: traer de la base de datos el credito mas grande */}
      <Slider 
        label="Deuda"
        step={50} 
        minValue={0} 
        maxValue={10000} 
        defaultValue={[0, 10000]} 
        value={debt} 
        onChange={setDebt}
        formatOptions={{style: "currency", currency: "MXN"}}
        className="w-full md:max-w-[30%] grow"
        endContent={
          <Button
            isIconOnly
            radius="full"
            variant="light"
            onPress={handleDebtChange}
          >
            <FaSearch />
          </Button>
        }
      />
    </div>
    <TableDetail 
        aria-label="agents table"
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