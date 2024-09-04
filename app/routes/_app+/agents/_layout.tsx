import { Button, DateRangePicker,  Input, RangeValue, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import { AgentRoute } from "~/.server/domain/entity/agentRoute.entity";
import { Filter } from "~/.server/domain/interface";
import { Generic } from "~/.server/interfaces";
import { HandlerSuccess, handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { Pagination, RowPerPage } from "~/components/ui";
import { Key } from "~/components/ui/folder/FolderSection";
import { SelectRoutes } from "~/components/ui/route/SelectRoutes";
import { DateValue } from "@internationalized/date";
import dayjs from 'dayjs';

const columnsFilter = ['route.name', 'user.fullName', 'assignAt' ];

const convertRoutes = (routes: string) =>  {
  return routes.split(',').map(r => parseInt(r));
}

const columnSortNames: Generic = {
  route: 'route.id',
  user: 'user.fullName',
  assignAt: 'assignAt'
}

export const loader: LoaderFunction = async ({ request }) => {

  // handleManualFilters
  const url = new URL(request.url);
  const routes = url.searchParams.get('routes');
  const agent = url.searchParams.get('agent') || '';
  const start = url.searchParams.get('start') || '';
  const end = url.searchParams.get('end') || '';

  console.log({start, end});

  const routesParsed: Filter  = (routes && routes !== 'all') 
    ? { column: 'route.id', value: convertRoutes(routes)}
    : { column: 'route.id', value: '' };

  const agentParsed: Filter = { column: 'user.fullName', value: agent };

  try {
    const { 
      page, limit, column, direction
    } = handlerPaginationParams(request.url, 'assignAt', columnsFilter);

    // console.log({search});

    const data = await Service.agent.findAll({
      page, 
      limit, 
      column: columnSortNames[column] ?? 'assignAt', 
      direction,
      search: [routesParsed, agentParsed]
    });

    return handlerSuccess(200, { 
        ...data,
        p: page,
        l: limit,
        c: column,
        d: direction,
        s: [routesParsed, agentParsed],
        agent,
        routes: routesParsed.value
      });
  } catch (error) {
      console.log({error});
      return json(getEmptyPagination());
    }
    
}

export type SortDirection = 'ascending' | 'descending';

interface Loader {
  data: AgentRoute[],
  P: number,
  l: number,
  c: string,
  d: SortDirection,
  s: {column: string, value: string}[] ,
  routes?: number[],
  agent?: string,
  total: number;
  pageCount: number;
  currentPage: number;
  nextPage: number | null;
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'route', label: 'RUTA',  sortable: true },
  { key: 'user', label: 'ASESOR', sortable: true },
  { key: 'assignAt', label: 'ASIGNACION', sortable: true},
  { key: 'actions', label: 'ACCIONES'},
]

type Selection = 'all' | Set<Key>;

export default function  AgentsPage()  {
  
  // TODO: { serverData } can be undefined when change the page with the navlink
  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const [ , setSearchParams] = useSearchParams();
  const [filterDate, setFilterDate] = useState<RangeValue<DateValue> | null>(null);
  
  const renderCell = useCallback((agent: AgentRoute, columnKey: Key) => {
      if(columnKey === 'actions') {
        return (<>acciones</>)
      } 

      if(columnKey === 'assignAt') {
          return <span 
                  className="capitalize" 
              >{agent.assignAt}</span>
      }
      
      if(columnKey === 'route') {
          return <span 
                  className="capitalize" 
              >Ruta {agent.route.name}</span>
      }
      
      if(columnKey === 'user') {
          return <span 
                  className="capitalize" 
              >{agent.user.fullName}</span>
      }

      if(columnKey in agent) {
        return <span className="capitalize">{agent[columnKey as never]}</span>;
      }

      return <span className="capitalize">Sin definir</span>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  console.log({routes: loader.serverData.routes});

  const defaultRoutes = useMemo(() => {

    if(loader?.serverData?.routes) {
      return loader.serverData.routes.map(val => String(val))
    }

    return undefined;

  },[loader?.serverData?.routes]);

  const handlePagination = () => {
    console.log('pagination');
  }
  
  const handleRowPerPage = () => {
    console.log('set total for page');
  }

  const returnRoute = (selection: Selection) => {
    if(typeof selection === 'string') {
      return 'all';
    }

    if(selection.size === 0) {
      return 'all';
    }

    return [...selection].join(',');
  }

  const handleSelection = (selection: Selection) => {

    const routeSearch = returnRoute(selection);

    setSearchParams((prev) => {
      prev.set('routes', routeSearch)
      return prev;
    });

  }

  const handleAgentChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      prev.set('agent',event.currentTarget.value)
      return prev;
    })
  }

  const handleSort = (descriptor: SortDescriptor) => {
    // setSortDescriptor(descriptor);
    const direction = descriptor?.direction ??  'ascending';
    const column = descriptor?.column ??  'assignAt';
    setSearchParams((prev) => {
      prev.set("d", direction);
      prev.set("c", String(column));
      return prev;
    }, {preventScrollReset: true});
  }

  const handleDates = (dates: RangeValue<DateValue>) => {

    const start = dayjs(dates.start.toDate('America/Mexico_City')).format('YYYY-MM-DD');
    const end = dayjs(dates.end.toDate('America/Mexico_City')).format('YYYY-MM-DD');

    setSearchParams((prev) => {
      prev.set("start", start);
      prev.set("end", String(end));
      return prev;
    }, {preventScrollReset: true});
    setFilterDate(dates); 
  }

  return (
    <>
    <SelectRoutes 
      onSelectionChange={handleSelection}
      selectionMode='multiple'
      defaultSelectedKeys={defaultRoutes}
    />
    <Input 
      id='agent'
      name='agent'
      defaultValue={loader?.serverData?.agent || ''}
      onChange={handleAgentChange}
    />
    <DateRangePicker
        label="Rango de la Fecha de cobro"
        className='w-full md:max-w-[40%]'
        value={filterDate}
        onChange={handleDates}
        aria-label="date ranger picker"
        labelPlacement='outside'
        CalendarBottomContent={
        <Button 
          className="mb-2 ml-2"
          size="sm" 
          aria-label="delete_filter_date"
          variant="ghost"
          color='primary'
          onClick={() => {
            setFilterDate(null)
          }}
        >
          Limpiar
        </Button>}
      />

    <DateRangePicker />
    <Table 
    aria-label="Municipalities table"
    onSortChange={handleSort}
    sortDescriptor={{
      column:  loader?.serverData.c ?? 'assignAt',
      direction: loader?.serverData.d ?? 'ascending',
    }}
    
    bottomContent={
        <div className="flex w-full justify-center">
            <Pagination 
                pageCount={loader?.serverData?.pageCount}
                currentPage={loader?.serverData?.currentPage}
                onChange={handlePagination}
            />
        </div>
    }
    topContent={
        <div className="flex justify-between items-center">
            {/* <TownButtonAdd /> */}
            <span className="text-default-400 text-small">
                Total {loader?.serverData.total || 0 } Agentes - Rutas
            </span>
            <RowPerPage 
                onChange={handleRowPerPage}
            />
        </div>
    }
  >
    <TableHeader>
        {columns.map((column) =>
            <TableColumn 
                key={column.key} 
                allowsSorting={column.sortable}
                allowsResizing
                className={column.key === "actions" ? "text-center" : "text-start"}
            >{column.label}</TableColumn>
        )}
    </TableHeader>
    <TableBody 
        emptyContent='No se encontraron Localidades'
        items={loader?.serverData.data ?? []}
        loadingContent={<Spinner />}
        // loadingState={loadingState}
    >
        {(item) => {
            return (
            <TableRow key={item?.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
        )}}
    </TableBody>
  </Table>
  </>
  )
}
