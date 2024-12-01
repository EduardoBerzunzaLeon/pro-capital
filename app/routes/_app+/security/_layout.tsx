import { Button } from "@nextui-org/react";
import { Role } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node"
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { Filter } from "~/.server/domain/interface";
import { Generic, Key } from "~/.server/interfaces";
import { getEmptyPagination, handlerPaginationParams, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { useParamsPaginator, useParamsSelect, useRenderCell } from "~/application";
import {  Pagination, RowPerPage, TableDetail } from "~/components/ui";
import { SelectRoles } from "~/components/ui/role/SelectRoles";

const columnsFilter = ['role'];
const columnSortNames: Generic ={ role: 'role'};
const convertRoutes = (routes: string) =>  {
  return routes.split(',').map(r => parseInt(r));
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const roles = url.searchParams.get('roles') || '';
  const rolesParsed: Filter  = (roles && roles !== 'all') 
  ? { column: 'id', value: convertRoutes(roles)}
  : { column: 'id', value: '' };

  try {
    

    const {
      page, limit, column, direction
    } = handlerPaginationParams(request.url, 'role', columnsFilter);

    const data = await Service.role.findAll({
      page, 
      limit, 
      column: columnSortNames[column] ?? 'role', 
      direction,
      search: [rolesParsed],
    });

    return handlerSuccess(200, { 
      ...data,
      p: page,
      l: limit,
      c: column,
      d: direction,
      s: [rolesParsed],
      roles: rolesParsed.value,
    })

  } catch (error) {
    console.log({error});
    return json(getEmptyPagination({ roles: rolesParsed.value,}));
  }

}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'role', label: 'ROL',  sortable: true },
  { key: 'actions', label: 'ACCIONES' },
]

export default function  SecurityPage()  {
  const roles = useLoaderData<typeof loader>();
  const { render } = useRenderCell({ isMoney: false }); 
  const navigate = useNavigate();
  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({
    columnDefault: 'role'
  });
  const {
    defaultItems,
    handleSelection,
  } = useParamsSelect({
    items: roles.serverData.roles,
    param: 'roles',
    mapper: (item: number) => String(item)
  });

  const renderCell = useCallback((role: Role, columnKey: Key) => {

    if(columnKey === 'actions') {
      return (
      // <div className="relative flex justify-center items-center gap-2">
        <Button 
          size='sm' 
          variant='ghost' 
          className='self-center'
          startContent={<FaEye />} 
          onPress={() => navigate(`./${role.id}/permissions`)}
        >Ver permisos</Button>
      // </div>
      )
    }
    return <span className='capitalize'>{render(role, columnKey)}</span>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <div className='w-full flex gap-2 flex.wrap'>
      <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
      <SelectRoles 
        onSelectionChange={handleSelection}
        selectionMode='multiple'
        className='w-full md:max-w-[25%]'
        defaultSelectedKeys={defaultItems}
      />
      <TableDetail 
          aria-label="roles table"
          onSortChange={handleSort}
          sortDescriptor={sortDescriptor}
          bottomContent={
            <Pagination
            pageCount={roles?.serverData?.pageCount}
            currentPage={roles?.serverData?.currentPage}
            onChange={handlePagination} 
            />
          }
          topContent={
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">
                Total {roles?.serverData.total || 0} Roles
              </span>
              <RowPerPage
                onChange={handleRowPerPage} 
                checkParams
                />
            </div>
          } 
          columns={columns} 
          loadingState={loadingState} 
          emptyContent="No se encontraron roles" 
          renderCell={renderCell} 
          data={roles?.serverData.data ?? []}    
          />
      </div>
      <Outlet />
    </div>
  )
}
