import { Button } from "@nextui-org/react";
import { Role } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node"
import { Outlet, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { Fragment, useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { getEmptyPagination, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions, useClearFilters, useParamsPaginator, useParamsSelect, useRenderCell } from "~/application";
import {  ButtonClear, Pagination, RowPerPage, TableDetail } from "~/components/ui";
import { SelectRoles } from "~/components/ui/role/SelectRoles";
import { Params } from '../../../application/params';
import { Key } from '~/.server/interfaces';
import { Permission } from "~/components/ui/auth/Permission";
import { ExcelReport } from "~/components/ui/excelReports/ExcelReport";
import { ROLE_COLUMNS } from "~/components/ui/excelReports/columns";
import { ErrorBoundary } from '../../../components/ui/error/ErrorBoundary';
import { FaShield } from "react-icons/fa6";

export const loader: LoaderFunction = async ({ request }) => {
  await Service.auth.requirePermission(request, permissions.roles.permissions.view);
  const { params, search } = Params.security.getParams(request);

  try {

    const data = await Service.role.findAll(params);

    const { page, limit, column, direction } = params;

    return handlerSuccess(200, { 
      ...data,
      ...search,
      pp: page,
      ll: limit,
      cc: column,
      dd: direction,
    })

  } catch (error) {
    console.log({error});
    return json(getEmptyPagination(search));
  }

}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'role', label: 'ROL',  sortable: true },
  { key: 'actions', label: 'ACCIONES' },
]

export { ErrorBoundary }

export const handle = {
  breadcrumb: () => ({
    href: '/security',
    label: 'Seguridad',
    startContent: <FaShield />,
  })
}


export default function  SecurityPage()  {
  const roles = useLoaderData<typeof loader>();
  const { render } = useRenderCell({ isMoney: false }); 
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const { key, onClearFilters } = useClearFilters(['roles'], ['dd', 'll', 'pp', 'cc']);

  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({
    columnDefault: 'role',
    pageParam:  'pp',
    rowParam: 'll',
    directionParam: 'dd',
    columnParam: 'cc'
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
      <Permission permission={permissions.roles.permissions.view_detail}>
        <Button 
          size='sm' 
          variant='ghost' 
          className='self-center'
          startContent={<FaEye />} 
          id={role.id+''}
          onPress={() => {
            navigate({
              pathname: `/security/${role.id}/permissions`,
              search: `?${searchParams.toString()}`
            })
          }}
        >Ver permisos</Button>
      </Permission>
      // </div>
      )
    }
    return <span className='capitalize'>{render(role, columnKey)}</span>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className='w-full flex gap-2 flex.wrap'>
      <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
      <Permission permission={permissions.roles.permissions.report}>
      <ExcelReport url={`/roles/export?${searchParams.toString()}`} name='roles' columns={ROLE_COLUMNS} />
    </Permission>
    <ButtonClear 
       onClear={onClearFilters}
    />
      <Fragment key={key}>
        <SelectRoles 
          onSelectionChange={handleSelection}
          selectionMode='multiple'
          className='w-full md:max-w-[25%]'
          defaultSelectedKeys={defaultItems}
        />
      </Fragment>
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
