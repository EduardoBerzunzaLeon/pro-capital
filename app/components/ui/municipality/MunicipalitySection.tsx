import { ChangeEvent, Key, useCallback, useEffect, useState} from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, useDisclosure, Button } from "@nextui-org/react";
import { useFetcher, useNavigationType } from "@remix-run/react";
import { MunicipalityI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { Pagination } from "..";
import { RowPerPage } from '../rowPerPage/RowPerPage';
import { MunicipalityAction } from "./MunicipalityAction";
import { ModalMunicipalityEdit } from './ModalMunicipalityEdit';
import { MunicipalityButtonAdd } from "./MunicipalityButtonAdd";

type Column = 'name' | 'id';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE' },
  { key: 'actions', label: 'ACTIONS'},
]

export  function MunicipalitySection() {
    const { load, state, data } = useFetcher<PaginationI<MunicipalityI>>({ key: 'municipalities' });
    const fetcherGet = useFetcher({ key: 'getMunicipality' });
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
    const [ limit, setLimit ] = useState(5);
    const [ page, setPage ] = useState(1);
    const test = useNavigationType();

    console.log(test);

    const loadingState = state === 'loading' || !data 
        ? "loading" 
        : "idle";

    useEffect(() => {
        load(`/municipality/?pm=${1}`);
    },[load]);
    
    useEffect(() => {
        if(fetcherGet.state === 'loading' || fetcherGet.data) {
            onOpen();
        }
    }, [fetcherGet.data, fetcherGet.state, onOpen]);
    
    useEffect(() => {
        if(fetcherGet.data) {
            onClose();
        }
    }, []);

    useEffect(() => {
        if(data?.data.length === 0 && data?.total > 0){
            load(`/municipality/?limit=${limit}&page=${page}`);
        }
    }, [data])

    useEffect(() => {
        load(`/municipality/?lm=${limit}&pm=${page}`)
    }, [limit, page]);


    const handlePagination = (page: number) => {
        setPage(page);
    }

    const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(e.target.value))
    }

    const renderCell = useCallback((municipality: MunicipalityI, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (<MunicipalityAction idMunicipality={municipality.id}/>)
        } 

        return municipality[(columnKey as Column)];
    
      }, [])

    return (
        <div>
            <ModalMunicipalityEdit 
                id={fetcherGet.data?.municipality.id}
                name={fetcherGet.data?.municipality.name}
                fetcherState={fetcherGet.state}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            />
          <Table 
            aria-label="Municipalities table"
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination 
                        pageCount={data?.pageCount}
                        currentPage={data?.currentPage}
                        onChange={handlePagination}
                    />
                </div>
            }
            topContent={
                <div className="flex justify-between items-center">
                    <MunicipalityButtonAdd />
                    <span className="text-default-400 text-small">Total {data?.total || 0 } municipios </span>
                    <RowPerPage 
                        onChange={handleRowPerPage}
                    />
                </div>
            }
          >
            <TableHeader>
                {columns.map((column) =>
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
            </TableHeader>
            <TableBody 
                emptyContent='No se encontraron Municipios'
                items={data?.data ?? []}
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