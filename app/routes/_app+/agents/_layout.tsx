import { Button, DateRangePicker,  Input, Link, RangeValue, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigation,  useOutlet, useSearchParams } from "@remix-run/react";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AgentRoute } from "~/.server/domain/entity/agentRoute.entity";
import { Filter } from "~/.server/domain/interface";
import { Generic, Key, SortDirection, Selection, LoadingState } from "~/.server/interfaces";
import { HandlerSuccess, handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { AgentRouteAction, Pagination, RowPerPage } from "~/components/ui";
import { SelectRoutes } from "~/components/ui/route/SelectRoutes";
// TODO: decidir por internacionalized date or daysjs
import { DateValue, parseDate } from "@internationalized/date";
import dayjs from 'dayjs';
import { ClientOnly } from "remix-utils/client-only";
import { MdEditCalendar } from "react-icons/md";

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
  
  const url = new URL(request.url);
  const routes = url.searchParams.get('routes');
  const agent = url.searchParams.get('agent') || '';
  const start = url.searchParams.get('start') || '';
  const end = url.searchParams.get('end') || '';

  const routesParsed: Filter  = (routes && routes !== 'all') 
    ? { column: 'route.id', value: convertRoutes(routes)}
    : { column: 'route.id', value: '' };

  const agentParsed: Filter = { column: 'user.fullName', value: agent };

  const datesParsed = (!start || !end) 
    ? { column: 'assignAt', value: ''}
    : { column:  'assignAt', value: {
      start: dayjs(start+'T00:00:00.000Z').toDate(),
      end: dayjs(end).toDate()
    }}

  try {
    const { 
      page, limit, column, direction
    } = handlerPaginationParams(request.url, 'assignAt', columnsFilter);

    const data = await Service.agent.findAll({
      page, 
      limit, 
      column: columnSortNames[column] ?? 'assignAt', 
      direction,
      search: [routesParsed, agentParsed, datesParsed]
    });

    return handlerSuccess(200, { 
        ...data,
        p: page,
        l: limit,
        c: column,
        d: direction,
        s: [routesParsed, agentParsed],
        agent,
        routes: routesParsed.value,
        start,
        end
      });
  } catch (error) {
    console.log({error});
      return json(getEmptyPagination({
        agent,
        routes: routesParsed.value,
        start,
        end
      }));
    }
    
}

interface Loader {
  data: AgentRoute[],
  P: number,
  l: number,
  c: string,
  d: SortDirection,
  s: {column: string, value: string}[] ,
  start: string,
  end: string,
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

export default function  AgentsPage()  {
  
  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const [ searchParams , setSearchParams] = useSearchParams();
  const outlet = useOutlet();
  const navigation = useNavigation();
  const [selectedDates, setSelectedDates] = useState<RangeValue<DateValue> | null>(null)

  const loadingState: LoadingState = navigation.state === 'idle' 
    ? 'idle' : 'loading';

  const renderCell = useCallback((agent: AgentRoute, columnKey: Key) => {
      if(columnKey === 'actions') {
        return (<AgentRouteAction idAgentRoute={agent.id} />)
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

  const defaultRoutes = useMemo(() => {

    if(loader?.serverData?.routes) {
      return loader.serverData.routes.map(val => String(val))
    }

    return undefined;

  },[loader?.serverData?.routes]);


  useEffect(() => {

    if(!selectedDates && (
      loader?.serverData.start 
        || loader?.serverData.end
    )) {
      const { start, end } = loader.serverData;

      const newDates = { 
        start: parseDate(start),
        end: parseDate(end)
      }
      setSelectedDates(newDates);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.serverData.start, loader.serverData.end]);
  

  const handlePagination = (page: number) => {
    setSearchParams((prev) => {
      prev.set('p', String(page))
      return prev;
    });
  }
  
  const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
    setSearchParams((prev) => {
      prev.set('l', String(e.target.value))
      return prev;
    });
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
    const direction = descriptor?.direction ??  'ascending';
    const column = descriptor?.column ??  'assignAt';
    setSearchParams((prev) => {
      prev.set("d", direction);
      prev.set("c", String(column));
      return prev;
    }, {preventScrollReset: true});
  }

  const handleDates = (dates: RangeValue<DateValue>) => {

    setSelectedDates(dates);

    const start = dayjs(dates.start.toDate('America/Mexico_City')).format('YYYY-MM-DD');
    const end = dayjs(dates.end.toDate('America/Mexico_City')).format('YYYY-MM-DD');

    setSearchParams((prev) => {
      prev.set("start", start);
      prev.set("end", String(end));
      return prev;
    }, {preventScrollReset: true});
  }

  return (
    <>
    { outlet }
    <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>

      <SelectRoutes 
        onSelectionChange={handleSelection}
        selectionMode='multiple'
        className='w-full md:max-w-[25%]'
        defaultSelectedKeys={defaultRoutes}
      />
      
      <Input 
        id='agent'
        name='agent'
        variant='bordered'
        className="w-full md:max-w-[30%]"
        labelPlacement="outside"
        label='Asesor'
        placeholder="Nombre del asesor"
        defaultValue={loader?.serverData?.agent || ''}
        onChange={handleAgentChange}
      />
      <DateRangePicker
        label="Rango de la  fecha de asignación"
        className="w-full md:max-w-[40%]"
        variant='bordered'
        // defaultValue={defaultDates}
        onChange={handleDates}
        value={selectedDates}
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
            setSelectedDates(null);
            setSearchParams((prev) => {
              prev.delete("start");
              prev.delete("end");
              return prev;
            }, { preventScrollReset: true });
          }}
        >
          Limpiar
        </Button>}
      />
</div>
    
    <Table 
    aria-label="Municipalities table"
    onSortChange={handleSort}
    sortDescriptor={{
      column:  loader?.serverData.c ?? 'assignAt',
      direction: loader?.serverData.d ?? 'ascending',
    }}
    
    bottomContent={
        <div className="flex w-full justify-center">
        <ClientOnly>
          {
            () => (
              <Pagination 
                    pageCount={loader?.serverData?.pageCount}
                    currentPage={loader?.serverData?.currentPage}
                    onChange={handlePagination}
                />    
              )
          }
        </ClientOnly>
        </div>
    }
    topContent={
        <div className="flex justify-between items-center">

                    <Button
                      href={`/agents/edit?${searchParams.toString()}`}
                      as={Link}
                      endContent={<MdEditCalendar />}
                      variant="ghost"
                      color="secondary" 
                    >
                      Asignar Ruta
                    </Button>
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
        emptyContent='No se encontraron asesores asignados'
        items={loader?.serverData.data ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
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
