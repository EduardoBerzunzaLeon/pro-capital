import { Key, useCallback, useEffect, useState} from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, useDisclosure, Input } from "@nextui-org/react";
import { Municipality } from "~/.server/domain/entity";
import { Pagination } from "..";
import { RowPerPage } from '../rowPerPage/RowPerPage';
import { MunicipalityAction } from "./MunicipalityAction";
import { ModalMunicipalityEdit } from './ModalMunicipalityEdit';
import { MunicipalityButtonAdd } from "./MunicipalityButtonAdd";
import { FaSearch } from "react-icons/fa";
import { useFetcherPaginator } from "~/application";

type Column = 'name' | 'id';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE',  sortable: true },
  { key: 'actions', label: 'ACCIONES'},
]

export  function MunicipalitySection() {
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const [ search, setSearch ] = useState('');
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
    } = useFetcherPaginator<Municipality>({key: 'municipality', route: 'municipality'});

    useEffect(() => {
        const data = [{ column: 'name', value: search }];
        onSubmit(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, sortDescriptor, search]);

    const handlerClose = () => {
        setSearch('');
    }

    const renderCell = useCallback((municipality: Municipality, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (<MunicipalityAction onOpenEdit={onOpen} idMunicipality={municipality.id}/>)
        } 

        return <span className="capitalize">{municipality[(columnKey as Column)]}</span>;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <div className='w-full md:max-w-[48%]'>
            <Input
                isClearable
                className="w-full sm:max-w-[44%] mt-5 mb-3"
                placeholder="Buscar por municipio"
                variant='bordered'
                startContent={<FaSearch />}
                value={search}
                onClear={handlerClose}
                onValueChange={setSearch}
            />
            <ModalMunicipalityEdit 
                isOpen={isOpen}
                onOpenChange={onOpenChange}
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
                    <MunicipalityButtonAdd />
                    <span className="text-default-400 text-small">Total {data?.serverData.total || 0 } municipios </span>
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