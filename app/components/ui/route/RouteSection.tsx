import { Table,  TableHeader, TableColumn, TableBody, Spinner, TableRow, TableCell, Chip, Dropdown, Button, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Route } from "@prisma/client";
import { useFetcherPaginator } from "~/application";
import { RowPerPage } from "../rowPerPage/RowPerPage";
import { Pagination } from "..";
import { Key } from "../folder/FolderSection";
import { useCallback, useEffect, useMemo, useState } from "react";

type Column = 'name' | 'id';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'NOMBRE', sortable: true },
    { key: 'isActive', label: 'ESTATUS', sortable: true },
    { key: 'actions', label: 'ACTIONS'},
]

type Selection = 'all' | Set<Key>;

export function RouteSection() {

    // const [ search, setSearch ] = useState('');

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

    const selectedValue = useMemo(
      () => Array.from(selectedKeys).map(value => value === 'active'),
      [selectedKeys]
    );


    useEffect(() => {
        const data = [{ column: 'isActive', value: JSON.stringify(selectedValue) }];
        onSubmit(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, sortDescriptor, selectedValue]);
    
    const renderCell = useCallback((route: Route, columnKey: Key) => {
        if(columnKey === 'actions') {
        //   return (<MunicipalityAction onOpenEdit={onOpen} idMunicipality={municipality.id}/>)
          return (<div>Acciones</div>)
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
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
          className="capitalize"
        >
          Estatus
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Multiple selection status routes"
        variant="flat"
        closeOnSelect={false}
        disallowEmptySelection
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key="active">Activo</DropdownItem>
        <DropdownItem key="inactive">Inactivo</DropdownItem>
      </DropdownMenu>
    </Dropdown>
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
                    {/* <MunicipalityButtonAdd /> */}
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