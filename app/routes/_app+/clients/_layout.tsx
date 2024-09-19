
import { Generic, Key, SortDirection, Selection } from "~/.server/interfaces";
// import dayjs from 'dayjs';
import { json, LoaderFunction } from "@remix-run/node";
import { HandlerSuccess, handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import { Credit } from "~/.server/domain/entity";
import { useParamsPaginator } from "~/application";
import { TableDetail, RowPerPage, Pagination } from "~/components/ui";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { FaChevronDown } from "react-icons/fa";


const columnsFilter = [
  'client.fullname', 'aval.fullname', 'captureAt', 'creditAt', 'folder.name',
  'group.name.fullname', 'folder.town.name', 'status', 'currentDebt',
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
  // const client = url.searchParams.get('client') || '';
  // const aval = url.searchParams.get('aval') || '';
  // const status = url.searchParams.get('status') || '';
  const folder = url.searchParams.get('folder') || '';
  // const town = url.searchParams.get('town') || '';
  // const municipality = url.searchParams.get('municipality') || '';
  const name = url.searchParams.get('name') || '';


  try {
  
      // const isActiveFormatted = { column: 'isActive', value: isActiveParsed };
      const curpParsed = { column: 'curp', value: curp };
      const folderParsed = { column: 'folder.name', value: folder.toLowerCase() };
      const fullnameParsed = { column: 'fullname', value: name.toLowerCase() };

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
      search: [curpParsed, folderParsed, fullnameParsed]
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
      fullname: name,
    });
  } catch (error) {
    console.log({error});
      return json(getEmptyPagination({
        fullname: 'asd'
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
  fullname: string,
  total: number;
  pageCount: number;
  currentPage: number;
  nextPage: number | null;
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
  { key: 'creaditAt', label: 'FECHA DEL CREDITO', sortable: true},
  { key: 'canRenovate', label: 'RENOVACIÓN'},
  { key: 'nextPayment', label: 'PROXIMO PAGO', sortable: true},
  { key: 'lastPayment', label: 'ULTIMO PAGO', sortable: true},
  { key: 'currentDebt', label: 'DEUDA ACTUAL', sortable: true},
  { key: 'status', label: 'ESTATUS', sortable: true},
  { key: 'actions', label: 'ACCIONES'},
]

const INITIAL_VISIBLE_COLUMNS = [
  'client.fullname', 'aval.fullname', 'folder.name', 'creaditAt', 'status', 'canRenovate', 'actions'
];

export default function ClientsPage() {

  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));  

  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({
    columnDefault: 'captureAt'
  });
  
  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === 'string') return columns;
    if (visibleColumns.has('all')) return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const renderCell = useCallback((credit: Credit, columnKey: Key) => {

    console.log({credit, columnKey})
    return <span className='capitalize'>iniciando</span>
  }, [])

  const topContent = useMemo(() => {
    return (<Dropdown
      className='overflow-y-scroll max-h-96'
    >
      <DropdownTrigger className="sm:flex">
        <Button endContent={<FaChevronDown  className="text-small" />} variant="flat">
          Columnas
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Table Columns"
        closeOnSelect={false}
        selectedKeys={visibleColumns}
        selectionMode="multiple"
        onSelectionChange={setVisibleColumns}
      >
        {columns.map((column) => (
          <DropdownItem key={column.key} className="capitalize">
            {column.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>)
  }, [visibleColumns])

  return <>
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