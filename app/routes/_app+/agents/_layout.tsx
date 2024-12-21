import { Button, Link } from "@nextui-org/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useOutlet, useSearchParams } from "@remix-run/react";
import { Fragment, useCallback  } from "react";
import { AgentRoute } from "~/.server/domain/entity/agentRoute.entity";
import { Key, SortDirection } from "~/.server/interfaces";
import { HandlerSuccess, handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { Service } from "~/.server/services";
import { AgentRouteAction, ButtonClear, InputFilter, Pagination, RangePickerDateFilter, RowPerPage, TableDetail } from "~/components/ui";
import { SelectRoutes } from "~/components/ui/route/SelectRoutes";
import { MdEditCalendar } from "react-icons/md";
import { permissions, useParamsPaginator, useParamsSelect, useClearFilters } from '~/application';
import { Params } from '../../../application/params/';
import { Permission } from "~/components/ui/auth/Permission";
import { ExcelReport } from "~/components/ui/excelReports/ExcelReport";
import { AGENT_COLUMNS } from "~/components/ui/excelReports/columns";
import { FaUsersCog } from "react-icons/fa";


export const loader: LoaderFunction = async ({ request }) => {

  await Service.auth.requirePermission(request, permissions.agents.permissions.view);
  const { params, search } = Params.agent.getParams(request);

  try {

    const { page, limit, column, direction } = params;
    const data = await Service.agent.findAll(params);

    return handlerSuccess(200, { 
        ...data,
        ...search,
        p: page,
        l: limit,
        c: column,
        d: direction,
    });

  } catch (error) {
    return json(getEmptyPagination({...search}));
  }
    
}

interface Loader {
  data: AgentRoute[],
  P: number,
  l: number,
  c: string,
  d: SortDirection,
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
  { key: 'route', label: 'RUTA',  sortable: true },
  { key: 'user', label: 'ASESOR', sortable: true },
  { key: 'assignAt', label: 'ASIGNACION', sortable: true},
  { key: 'actions', label: 'ACCIONES'},
]

export const handle = {
  breadcrumb: () => ({
    href: '/agents',
    label: 'Rutas & Asesores',
    startContent: <FaUsersCog />,
  })
}


export default function  AgentsPage()  {
  
  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const [ searchParams ] = useSearchParams();
  const { key, onClearFilters } = useClearFilters();
  
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
        return (<Permission permission={permissions.agents.permissions.delete}><AgentRouteAction idAgentRoute={agent.id} /></Permission>)
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
    <Permission permission={permissions.agents.permissions.delete}>
      { outlet }
    </Permission>
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
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end flex-wrap">
              <Fragment key={key}>
                <SelectRoutes 
                  onSelectionChange={handleSelection}
                  selectionMode='multiple'
                  className='w-full sm:max-w-[25%] lg:max-w-[20%]'
                  defaultSelectedKeys={defaultItems}
                />
                <InputFilter 
                  param="agent" 
                  name="agent" 
                  label="Asesor" 
                  id="agent" 
                  placeholder="Nombre del asesor"      
                  className='w-full sm:max-w-[30%] lg:max-w-[25%]' 
                  defaultValue={loader?.serverData?.agent}
                />
                <RangePickerDateFilter 
                  label="Rango de la fecha de asignación" 
                  startName="start" 
                  endName="end"
                  className='w-full  sm:max-w-[45%] md:max-w-[40%] lg:max-w-[30%]' 
                  start={loader?.serverData.start} 
                  end={loader?.serverData.end} 
                />
              </Fragment>
              <div>
                <Permission permission={permissions.agents.permissions.report}>
                  <ExcelReport url={`/agents/export?${searchParams.toString()}`} name='asesores_asignados' columns={AGENT_COLUMNS} />
                </Permission>
                <ButtonClear 
                  onClear={onClearFilters}
                />
                <Permission permission={permissions.agents.permissions.add}>
                  <Button
                    href={`/agents/edit?${searchParams.toString()}`}
                    as={Link}
                    endContent={<MdEditCalendar />}
                    variant="ghost"
                    color="secondary"
                  >
                    Asignar Ruta
                  </Button>
                </Permission>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">
                Total {loader?.serverData.total || 0} Agentes - Rutas
              </span>
              <RowPerPage
                onChange={handleRowPerPage} 
                checkParams
                />
            </div>
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
