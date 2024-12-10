import { useCallback, useMemo, useState } from "react";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react"

import { userLoader } from "~/application/user/user.loader";
import { Key, Selection } from "~/.server/interfaces";
import {  permissions, useParamsPaginator, useParamsSelect, useRenderCell } from "~/application";
import { useDropdown } from "~/application/hook/useDropdown";
import { UserComplete } from "~/.server/domain/entity";
import { Button, Link, Select, SelectItem } from "@nextui-org/react";
import { ButtonClear, ChipStatus, InputFilter, Pagination, RowPerPage, StatusFilter, TableDetail, UserAction, UserToggleActive } from "~/components/ui";
import { DropdownSex } from "~/components/ui/dropdowns/DropdownSex";
import { SelectRoles } from "~/components/ui/role/SelectRoles";
import { FaUserPlus } from "react-icons/fa";
import { Permission } from "~/components/ui/auth/Permission";
import { MultiplePermissions } from "~/components/ui/auth/MultiplePermissions";
import { ExcelReport } from "~/components/ui/excelReports/ExcelReport";
import { USER_COLUMNS } from "~/components/ui/excelReports/columns";

export {
  userLoader as loader
}

const INITIAL_VISIBLE_COLUMNS = [
  'username', 'fullName', 'isActive', 'role', 'actions'
];

const columns = [
  { key: 'email', label: 'CORREO', sortable: true},
  { key: 'username', label: 'USUARIO', sortable: true},
  { key: 'fullName', label: 'NOMBRE', sortable: true},
  { key: 'isActive', label: 'ESTATUS', sortable: true},
  { key: 'role', label: 'ROL', sortable: true},
  { key: 'address', label: 'DIRECCIÓN', sortable: true},
  { key: 'sex', label: 'SEXO', sortable: true},
  { key: 'actions', label: 'ACCIONES' },
]

export default function  UsersPage()  {
  const loader = useLoaderData<typeof userLoader>();

  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS)); 
  const [ searchParams, setSearchParams ] = useSearchParams();

  const {
    defaultItems,
    handleSelection,
  } = useParamsSelect({
    items: loader.serverData.roles,
    param: 'roles',
    mapper: (item: number) => String(item)
  });
  
  const { defaultValue, handleValueChange } = useDropdown({
    param: 'sex',
    type: 'string',
    value: loader?.serverData?.sex
  });

  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({ columnDefault: 'username' });

  const { render } = useRenderCell({ isMoney: false }); 
   
  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === 'string') return columns;
    if (visibleColumns.has('all')) return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);
  
  const renderCell = useCallback((user: UserComplete, columnKey: Key) => {

    if(columnKey === 'actions') {
      return (
        <div className='flex justify-center items-center gap-1'>
          <Permission permission={permissions.users.permissions.active}>
            <UserToggleActive userId={user.id} isActive={user.isActive} />
          </Permission>
          <MultiplePermissions
            permissions={[
              permissions.users.permissions.view,
              permissions.users.permissions.update,
            ]}
          >
            <UserAction userId={user.id}/>
          </MultiplePermissions>
        </div>
      )
    }

    if(columnKey == 'isActive') {
      return (<ChipStatus isActive={user.isActive} />)
    }

    return <span className='capitalize'>{render(user, columnKey)}</span>

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlerClear = () => {
    setSearchParams();
  }

  const topContent = useMemo(() => {
    return (<Select
      label="Columnas"
      placeholder="Seleccione una columna"
      selectionMode="multiple"
      variant="bordered"
      labelPlacement="outside"
      className="max-w-xs"
      disallowEmptySelection
      selectedKeys={visibleColumns}
      onSelectionChange={setVisibleColumns}
    >
      {columns.map((column) => (
        <SelectItem key={column.key}>
          {column.label}
        </SelectItem>
      ))}
    </Select>)
  }, [visibleColumns])

  return (
    <>
    <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
    <Permission permission={permissions.users.permissions.report}>
      <ExcelReport url={`/users/export?${searchParams.toString()}`} name='usuarios' columns={USER_COLUMNS} />
    </Permission>
    <ButtonClear 
       onClear={handlerClear}
    />
    <SelectRoles 
      onSelectionChange={handleSelection}
      selectionMode='multiple'
      className='w-full md:max-w-[25%]'
      defaultSelectedKeys={defaultItems}
    />
    <InputFilter 
        param="email" 
        name="email" 
        label="Correo electronico" 
        id="email"
        className='w-full md:max-w-[30%]' 
        placeholder="Correo electronico"      
        defaultValue={loader?.serverData?.email}
    />
    <InputFilter 
        param="username" 
        name="username" 
        label="Usuario" 
        id="username"
        className='w-full md:max-w-[30%]' 
        placeholder="Nombre de usuario"      
        defaultValue={loader?.serverData?.username}
    />
    <InputFilter 
        param="fullName" 
        name="username" 
        label="Nombre" 
        id="username"
        className='w-full md:max-w-[30%]' 
        placeholder="Nombre completo"      
        defaultValue={loader?.serverData?.fullName}
    />
      <StatusFilter 
        isActive={loader?.serverData?.isActive}
        param='isActive'
      />
      <DropdownSex 
        onSelectionChange={handleValueChange} 
        defaultSelectedKeys={defaultValue}
      />
    </div>
      <TableDetail 
        aria-label="credits table"
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
            <Permission permission={permissions.users.permissions.add} >
              <Button
                href={`/users/create?${searchParams.toString()}`}
                as={Link}
                endContent={<FaUserPlus />}
                variant="ghost"
                color="secondary" 
              >
                Crear Usuario
              </Button>
            </Permission>
            <span className="text-default-400 text-small">
              Total {loader?.serverData.total || 0} Usuarios
            </span>
            <RowPerPage
              onChange={handleRowPerPage} 
              checkParams
            />
          </div>
        } 
        columns={columns} 
        loadingState={loadingState} 
        emptyContent="No se encontraron usuarios" 
        renderCell={renderCell} 
        data={loader?.serverData.data ?? []}    
      />
      <Outlet />
    </>
  )
}
