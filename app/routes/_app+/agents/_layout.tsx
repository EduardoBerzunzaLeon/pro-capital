import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback } from "react";
import { AgentRoute } from "~/.server/domain/entity/agentRoute.entity";
import { PaginationI } from "~/.server/domain/interface";
import { Generic } from "~/.server/interfaces";
import { HandlerSuccess, handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { Pagination, RowPerPage } from "~/components/ui";
import { Key } from "~/components/ui/folder/FolderSection";

const columnsFilter = ['route.name', 'user.fullName', 'assignAt' ];

const columnSortNames: Generic = {
  route: 'route.name',
  user: 'user.fullName',
  assignAt: 'assignAt'
}

export const loader: LoaderFunction = async ({ request }) => {

  try {
    const { 
      page, limit, column, direction, search
    } = handlerPaginationParams(request.url, 'name', columnsFilter);

    const data = await Service.agent.findAll({
      page, 
      limit, 
      column: columnSortNames[column] ?? 'assignAt', 
      direction,
      search
    });

    return handlerSuccess(200, data);
  } catch (error) {
      console.log({error});
      return json(getEmptyPagination());
    }
    
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'route', label: 'RUTA',  sortable: true },
  { key: 'user', label: 'ASESOR', sortable: true },
  { key: 'assignAt', label: 'ASIGNACION', sortable: true},
  { key: 'actions', label: 'ACCIONES'},
]



export default function  AgentsPage()  {
  
  const { serverData } = useLoaderData<HandlerSuccess<PaginationI<AgentRoute>>>();

  console.log(serverData);

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

  const handlePagination = () => {
    console.log('pagination');
  }
  
  const handleRowPerPage = () => {
    console.log('set total for page');
  }

  return (
    <Table 
    aria-label="Municipalities table"
    // onSortChange={setSortDescriptor}
    // sortDescriptor={sortDescriptor}
    bottomContent={
        <div className="flex w-full justify-center">
            <Pagination 
                pageCount={serverData?.pageCount}
                currentPage={serverData?.currentPage}
                onChange={handlePagination}
            />
        </div>
    }
    topContent={
        <div className="flex justify-between items-center">
            {/* <TownButtonAdd /> */}
            <span className="text-default-400 text-small">
                Total {serverData.total || 0 } Agentes - Rutas
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
        items={serverData.data ?? []}
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
  )
}
