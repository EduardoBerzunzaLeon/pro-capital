import { Table,  TableHeader, TableColumn, TableBody, Spinner, TableRow, TableCell, Chip } from "@nextui-org/react";
import { Route } from "@prisma/client";
import { useFetcherPaginator, useStatusMemo } from "~/application";
import { RowPerPage } from "../rowPerPage/RowPerPage";
import { DropdownStatus, Pagination } from "..";
import { Key } from "../folder/FolderSection";
import { useCallback, useEffect,  useState } from "react";
import { RouteButtonAdd } from "./RouteButtonAdd";
import { RouteAction } from "./RouteAction";
import RouteToggleActive from "./RouteToggleActive";

type Column = 'name' | 'id';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'NOMBRE', sortable: true },
    { key: 'isActive', label: 'ESTATUS', sortable: true },
    { key: 'actions', label: 'ACCIONES'},
]

type Selection = 'all' | Set<Key>;

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
        <Table 
            aria-label="Municipalities table"
            onSortChange={setSortDescriptor}
            sortDescriptor={sortDescriptor}
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination 
                        pageCount={data?.serverData.pageCount}
                        currentPage={data?.serverData.currentPage}
                        onChange={handlePagination}
                    />
                </div>
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
                emptyContent='No se encontraron Municipios'
                items={data?.serverData.data ?? []}
                loadingContent={<Spinner />}
                loadingState={loadingState}
            >
                {(item) => {
                    return (
                    <TableRow key={item?.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}}
            </TableBody>
          </Table>

        </div>
    )

}