import { Button, Link } from "@nextui-org/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useOutlet, useSearchParams } from "@remix-run/react";
import { useCallback  } from "react";
import { AgentRoute } from "~/.server/domain/entity/agentRoute.entity";
import { Filter } from "~/.server/domain/interface";
import { Generic, Key, SortDirection } from "~/.server/interfaces";
import { HandlerSuccess, handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { AgentRouteAction, InputFilter, Pagination, RangePickerDateFilter, RowPerPage, TableDetail } from "~/components/ui";
import { SelectRoutes } from "~/components/ui/route/SelectRoutes";
import dayjs from 'dayjs';
import { MdEditCalendar } from "react-icons/md";
import { useParamsPaginator, useParamsSelect } from "~/application";

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
  const [ searchParams ] = useSearchParams();
  
  const {
    defaultItems,
    handleSelection,
  } = useParamsSelect({
    items: loader.serverData.routes,
    param: 'routes',
    mapper: (item: number) => String(item)
  });

  const outlet = useOutlet();
  
  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({
    columnDefault: 'assignAt'
  });

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

  return (
    <>
    { outlet }
    <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
      <SelectRoutes 
        onSelectionChange={handleSelection}
        selectionMode='multiple'
        className='w-full md:max-w-[25%]'
        defaultSelectedKeys={defaultItems}
      />
      <InputFilter 
        param="agent" 
        name="agent" 
        label="Asesor" 
        id="agent" 
        placeholder="Nombre del asesor"      
        defaultValue={loader?.serverData?.agent}
      />
      <RangePickerDateFilter 
        label="Rango de la fecha de asignación" 
        startName="start" 
        endName="end"
        start={loader?.serverData.start} 
        end={loader?.serverData.end} 
      />
    </div>
    <TableDetail 
        aria-label="agents table"
        onSortChange={handleSort}
        sortDescriptor={sortDescriptor}
        bottomContent={
          <Pagination
            pageCount={loader?.serverData?.pageCount}
            currentPage={loader?.serverData?.currentPage}
            onChange={handlePagination} 
          />
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
              Total {loader?.serverData.total || 0} Agentes - Rutas
            </span>
            <RowPerPage
              onChange={handleRowPerPage} 
            />
          </div>
        } 
        columns={columns} 
        loadingState={loadingState} 
        emptyContent="No se encontraron asesores asignados" 
        renderCell={renderCell} 
        data={loader?.serverData.data ?? []}    
    />
  </>
  )
}
