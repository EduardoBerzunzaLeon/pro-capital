import { ChangeEvent, Key, useCallback, useEffect} from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { MunicipalityI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { Pagination } from "..";
import { RowPerPage } from '../rowPerPage/RowPerPage';
import { MunicipalityAction } from "./MunicipalityAction";

type Column = 'name' | 'id';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE' },
  { key: 'actions', label: 'ACTIONS'},
]

export  function MunicipalitySection() {
    const { load, state, data } = useFetcher<PaginationI<MunicipalityI>>({ key: 'municipalities' });

    const loadingState = state === 'loading' || !data 
        ? "loading" 
        : "idle";

    useEffect(() => {
        load(`/municipality/?pm=${1}`);
    },[load]);


    const handlePagination = (page: number) => {
        load(`/municipality/?pm=${page}`)
    }

    const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        load(`/municipality/?lm=${e.target.value}`)
    }

    const renderCell = useCallback((municipality: MunicipalityI, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (<MunicipalityAction idMunicipality={municipality.id}/>)
        } 

        return municipality[(columnKey as Column)];
    
      }, [])

    return (
        <div>
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