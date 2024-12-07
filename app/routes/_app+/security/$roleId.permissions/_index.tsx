import { json, LoaderFunction } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react";
import { useCallback } from "react";
import { Permission } from "~/.server/domain/entity/permission.entity";
import { Generic, Key } from "~/.server/interfaces";
import { getEmptyPagination, handlerPaginationParams, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions, useParamsPaginator, useRenderCell } from "~/application";
import { InputFilter, Pagination, PermissionToggleActive, RowPerPage, TableDetail } from "~/components/ui";
import { Permission as PermissionUI } from "~/components/ui/auth/Permission";

const columnsFilter = ['name', 'description', 'module.name'];
const columnSortNames: Generic ={ role: 'role', module: 'module.name' };

export const loader: LoaderFunction = async ({ request, params }) => {
    
    await Service.auth.requirePermission(request, permissions.roles.permissions.view_detail);
    // TODO: implement params method generic
    const { roleId } = params;
    const url = new URL(request.url);
    const name = url.searchParams.get('name') || '';
    const description = url.searchParams.get('description') || '';
    const moduleName = url.searchParams.get('module') || '';

    const nameFormatted = { column: 'name', value: name }; 
    const descriptionFormatted = { column: 'description', value: description }; 
    const moduleFormatted = { column: 'module.name', value: moduleName }; 

    try {

        const {
          page, limit, column, direction
        } = handlerPaginationParams(request.url, 'name', columnsFilter);
    
        const data = await Service.permission.findAll(roleId, {
          page, 
          limit, 
          column: columnSortNames[column] ?? 'name', 
          direction,
          search: [
            nameFormatted,
            descriptionFormatted,
            moduleFormatted,
          ],
        });
    
        return handlerSuccess(200, { 
          ...data,
          p: page,
          l: limit,
          c: column,
          d: direction,
          s: [],
          name,
          description,
          module: moduleName,
         })
    
      } catch (error) {
        console.log({error});
        return json(getEmptyPagination({ 
            name,
            description,
            module: moduleName 
        }));
      }
}


const columns = [
    { key: 'name', label: 'PERMISO', sortable: true},
    { key: 'description', label: 'DESCRIPCION', sortable: true},
    { key: 'module', label: 'MODULO', sortable: true},
    { key: 'actions', label: 'ACCIONES' },
  ]

export default function PermissionDetailPage() {

    const permissions = useLoaderData<typeof loader>();
    const { render } = useRenderCell({ isMoney: false }); 
    const { roleId } = useParams();
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
            <PermissionUI permission={permissions.roles.permissions.update}>
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
            <InputFilter 
                param="name" 
                name="name" 
                label="Permiso" 
                id="name"
                className='w-full md:max-w-[30%]' 
                placeholder="Nombre del permiso"      
                defaultValue={permissions?.serverData?.name}
            />
            <InputFilter 
                param="description" 
                name="description" 
                label="Descripción" 
                id="description"
                className='w-full md:max-w-[30%]' 
                placeholder="Descripción"      
                defaultValue={permissions?.serverData?.description}
            />
            <InputFilter 
                param="module" 
                name="module" 
                label="Módulo" 
                id="module"
                className='w-full md:max-w-[30%]' 
                placeholder="Módulo"      
                defaultValue={permissions?.serverData?.module}
            />
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
                    <div className="flex justify-between items-center">
                        <span className="text-default-400 text-small">
                            Total {permissions?.serverData.total || 0} permisos
                        </span>
                        <RowPerPage
                            onChange={handleRowPerPage} 
                            checkParams
                        />
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