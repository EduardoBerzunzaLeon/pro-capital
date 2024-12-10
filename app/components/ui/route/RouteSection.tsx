import { Chip } from "@nextui-org/react";
import { permissions, useFetcherPaginator, useStatusMemo } from "~/application";
import { RowPerPage } from "../rowPerPage/RowPerPage";
import { ButtonClear, DropdownStatus, Pagination, TableDetail } from "..";
import { useCallback, useEffect,  useState } from "react";
import { RouteButtonAdd } from "./RouteButtonAdd";
import { RouteAction } from "./RouteAction";
import RouteToggleActive from "./RouteToggleActive";
import { Key, Selection} from "~/.server/interfaces";
import { MultiplePermissions } from "../auth/MultiplePermissions";
import { Permission } from "../auth/Permission";
import { Route } from "~/.server/domain/entity";
import { ExcelReport } from "../excelReports/ExcelReport";
import { ROUTE_COLUMNS } from "../excelReports/columns";

type Column = 'name' | 'id';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'NOMBRE', sortable: true },
    { key: 'isActive', label: 'ESTATUS', sortable: true },
    { key: 'actions', label: 'ACCIONES'},
]

export function RouteSection() {

    const {        
        data, 
        limit, 
        page, 
        sortDescriptor, 
        setSortDescriptor,
        loadingState,
        handlePagination,
        handleRowPerPage,
        onSubmit,
        url
    } = useFetcherPaginator<Route>({key: 'route', route: 'routePage'});

    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['active', 'inactive']));

    const selectedValue = useStatusMemo({ selectedKeys });

    useEffect(() => {
        const data = [{ column: 'isActive', value: selectedValue }];
        onSubmit(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, sortDescriptor, selectedValue]);

    const handlerClear = () => {
        setSelectedKeys(new Set(['active', 'inactive']));
    }
    
    const renderCell = useCallback((route: Route, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (
            <MultiplePermissions permissions={[
                permissions.route.permissions.active,
                permissions.route.permissions.delete,
            ]}>
                <div className='flex justify-center items-center gap-1'>
                    <Permission permission={permissions.route.permissions.active}>
                        <RouteToggleActive 
                            routeId={route.id}
                            isActive={route.isActive}
                        />
                    </Permission>
                    <Permission permission={permissions.route.permissions.delete}>
                        <RouteAction idRoute={route.id}/>
                    </Permission>
                </div>
            </MultiplePermissions>
          )
        } 

        if(columnKey == 'isActive') {
            const status = route.isActive ? 'Activo' : 'Inactivo';
            const color = route.isActive ? 'success' : 'danger' 
            return ( <Chip color={color} variant="bordered" >{status}</Chip>)
        }

        if(columnKey === 'name') {
            const name = `Ruta ${route.name}`;
            return (<span>{name}</span>)
        }

        return <span className="capitalize">{route[(columnKey as Column)]}</span>;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <div className='w-full md:max-w-[48%]'>
            <Permission permission={permissions.route.permissions.report}>
                <ExcelReport url={url} name='rutas' columns={ROUTE_COLUMNS} />
            </Permission>
            <ButtonClear 
                onClear={handlerClear}
            />
        <DropdownStatus 
          selectedKeys={selectedKeys} 
          onSelectionChange={setSelectedKeys} 
        />
        <TableDetail 
            aria-label="Routes table"
            onSortChange={setSortDescriptor}
            sortDescriptor={sortDescriptor}
            bottomContent={
                <Pagination 
                    pageCount={data?.serverData.pageCount}
                    currentPage={data?.serverData.currentPage}
                    onChange={handlePagination}
                />
            }
            topContent={
                <div className="flex justify-between items-center">
                    <Permission permission={permissions.route.permissions.add}>
                        <RouteButtonAdd />
                    </Permission>
                    <span className="text-default-400 text-small">Total {data?.serverData.total || 0 } rutas </span>
                    <RowPerPage 
                        onChange={handleRowPerPage}
                    />
                </div>
            }
            columns={columns} 
            loadingState={loadingState} 
            emptyContent="No se encontraron rutas" 
            renderCell={renderCell} 
            data={data?.serverData.data ?? []}    
          />
           

        </div>
    )

}