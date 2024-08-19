import { ChangeEvent, Key, useCallback, useEffect, useState} from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, useDisclosure, SortDescriptor } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { MunicipalityI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { Pagination } from "..";
import { RowPerPage } from '../rowPerPage/RowPerPage';
import { MunicipalityAction } from "./MunicipalityAction";
import { ModalMunicipalityEdit } from './ModalMunicipalityEdit';
import { MunicipalityButtonAdd } from "./MunicipalityButtonAdd";
import { HandlerSuccess } from "~/.server/reponses";

type Column = 'name' | 'id';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE',  sortable: true },
  { key: 'actions', label: 'ACTIONS'},
]

export  function MunicipalitySection() {
    const { load, state, data } = useFetcher<HandlerSuccess<PaginationI<MunicipalityI>>>({ key: 'municipalities' });
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const [ limit, setLimit ] = useState(5);
    const [ page, setPage ] = useState(1);
    const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
      });

    const loadingState = state === 'loading' || !data 
        ? "loading" 
        : "idle";

    useEffect(() => {
        load(`/municipality/?pm=${1}`);
    },[load]);
    
    useEffect(() => {
        if(data?.serverData.data.length === 0 && data?.serverData.total > 0){
            load(`/municipality/?limit=${limit}&page=${page}&dm=${sortDescriptor.direction}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    useEffect(() => {
        load(`/municipality/?lm=${limit}&pm=${page}&cm=${sortDescriptor.column}&dm=${sortDescriptor.direction}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, sortDescriptor]);


    const handlePagination = (page: number) => {
        setPage(page);
    }

    const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(e.target.value))
    }

    const renderCell = useCallback((municipality: MunicipalityI, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (<MunicipalityAction onOpenEdit={onOpen} idMunicipality={municipality.id}/>)
        } 

        return <span className="capitalize">{municipality[(columnKey as Column)]}</span>;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <div>
            <ModalMunicipalityEdit 
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
          <Table 
            aria-label="Municipalities table"
            onSortChange={setSortDescriptor}
            // topContentPlacement="outside"
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
                        align={column.key === "actions" ? "center" : "start"}
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