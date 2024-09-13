import { Chip } from "@nextui-org/react";
import { Route } from "@prisma/client";
import { useFetcherPaginator, useStatusMemo } from "~/application";
import { RowPerPage } from "../rowPerPage/RowPerPage";
import { DropdownStatus, Pagination, TableDetail } from "..";
import { useCallback, useEffect,  useState } from "react";
import { RouteButtonAdd } from "./RouteButtonAdd";
import { RouteAction } from "./RouteAction";
import RouteToggleActive from "./RouteToggleActive";
import { Key, Selection} from "~/.server/interfaces";

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
        onSubmit
    } = useFetcherPaginator<Route>({key: 'route', route: 'routePage'});

    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['active', 'inactive']));

    const selectedValue = useStatusMemo({ selectedKeys });

    useEffect(() => {
        const data = [{ column: 'isActive', value: selectedValue }];
        onSubmit(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, sortDescriptor, selectedValue]);
    
    const renderCell = useCallback((route: Route, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (
            <div className='flex justify-center items-center gap-1'>
                <RouteToggleActive 
                    routeId={route.id}
                    isActive={route.isActive}
                />
                <RouteAction idRoute={route.id}/>
            </div>
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
                    <RouteButtonAdd />
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