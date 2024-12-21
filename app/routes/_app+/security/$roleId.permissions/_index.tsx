import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData, useParams, useSearchParams } from '@remix-run/react';
import { useCallback, Fragment } from 'react';
import { FaUserShield } from "react-icons/fa";
import { Permission } from "~/.server/domain/entity/permission.entity";
import { Key } from "~/.server/interfaces";
import { getEmptyPagination, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions as permissionsData, useClearFilters, useParamsPaginator, useRenderCell } from "~/application";
import { Params } from "~/application/params";
import { ButtonClear, ErrorBoundary, InputFilter, Pagination, PermissionToggleActive, RowPerPage, TableDetail } from "~/components/ui";
import { Permission as PermissionUI } from "~/components/ui/auth/Permission";
import { ExcelReport } from "~/components/ui/excelReports/ExcelReport";
import { PERMISSION_COLUMNS } from "~/components/ui/excelReports/columns";


export const loader: LoaderFunction = async ({ request, params }) => {
    
    await Service.auth.requirePermission(request, permissionsData.roles.permissions.view_detail);
    const { roleId } = params;

    const { params: urlParams, search } = Params.permission.getParams(request);
    try {
        const data = await Service.permission.findAll(roleId, urlParams);
        const { page, limit, column, direction } = params;

        return handlerSuccess(200, { 
          ...data,
          ...search,
          p: page,
          l: limit,
          c: column,
          d: direction,
          s: [],
         })
    

      } catch (error) {
        console.log({error});
        return json(getEmptyPagination(search));
      }
}


const columns = [
    { key: 'name', label: 'PERMISO', sortable: true},
    { key: 'description', label: 'DESCRIPCION', sortable: true},
    { key: 'module', label: 'MODULO', sortable: true},
    { key: 'actions', label: 'ACCIONES' },
  ]

export { ErrorBoundary }

  export const handle = {
    breadcrumb: (data: { status: string, serverData?: { role: { id: number, role: string} } }) => ({
      href: `/security/${data?.serverData?.role.id}/permissions`,
      label: `Permisos de ${data?.serverData?.role.role.replace('_', ' ')}`,
      startContent: <FaUserShield />,
    })
  }
  

export default function PermissionDetailPage() {

    const permissions = useLoaderData<typeof loader>();
    const { render } = useRenderCell({ isMoney: false }); 
    const [ searchParams ] = useSearchParams();
    const { roleId } = useParams();
    const { key, onClearFilters } = useClearFilters(['name', 'description', 'module']);
    
    const { 
        loadingState, 
        handlePagination, 
        handleRowPerPage, 
        handleSort,
        sortDescriptor
      } = useParamsPaginator({
        columnDefault: 'name'
      });
    
      
    const renderCell = useCallback((permission: Permission, columnKey: Key) => {

        if(columnKey === 'actions') {
        return (
            <PermissionUI permission={permissionsData.roles.permissions.update}>
                <PermissionToggleActive 
                    roleId={Number(roleId)} 
                    permissionId={permission.id} 
                    isAssigned={permission.isAssigned}                
                />
            </PermissionUI>
        )
        }
        return <span className='capitalize'>{render(permission, columnKey)}</span>
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
        <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
            
            <TableDetail 
                aria-label="roles table"
                onSortChange={handleSort}
                sortDescriptor={sortDescriptor}
                bottomContent={
                    <Pagination
                    pageCount={permissions?.serverData?.pageCount}
                    currentPage={permissions?.serverData?.currentPage}
                    onChange={handlePagination} 
                    />
                }
                topContent={
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between gap-3 items-end flex-wrap">
                            <Fragment key={key}>
                                <InputFilter 
                                    param="name" 
                                    name="name" 
                                    label="Permiso" 
                                    id="name"
                                    className='w-full sm:max-w-[25%]' 
                                    placeholder="Nombre del permiso"      
                                    defaultValue={permissions?.serverData?.name}
                                />
                                <InputFilter 
                                    param="description" 
                                    name="description" 
                                    label="Descripción" 
                                    id="description"
                                    className='w-full sm:max-w-[25%]' 
                                    placeholder="Descripción"      
                                    defaultValue={permissions?.serverData?.description}
                                />
                                <InputFilter 
                                    param="module" 
                                    name="module" 
                                    label="Módulo" 
                                    id="module"
                                    className='w-full sm:max-w-[25%]' 
                                    placeholder="Módulo"      
                                
                                    defaultValue={permissions?.serverData?.module}
                                />
                            </Fragment>
                            <div>
                                <PermissionUI permission={permissionsData.roles.permissions.report_permissions}>
                                    <ExcelReport 
                                        url={`/security/${roleId}/permissions/export?${searchParams.toString()}`} 
                                        name='permisos' 
                                        columns={PERMISSION_COLUMNS} 
                                    />
                                </PermissionUI>
                                <ButtonClear 
                                    onClear={onClearFilters}
                                /> 
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-default-400 text-small">
                                Total {permissions?.serverData.total || 0} permisos
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
                emptyContent="No se encontraron permisos" 
                renderCell={renderCell} 
                data={permissions?.serverData.data ?? []}    
            />
        </div>
        </>
    )
}