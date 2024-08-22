import { Input, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { ChangeEvent, Key, useCallback, useEffect, useState } from "react";
import { TownI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { HandlerSuccess } from "~/.server/reponses";
import { Pagination, RowPerPage } from "..";
import { FaSearch } from "react-icons/fa";
import { TownAction } from "./TownAction";
import { TownButtonAdd } from "./TownButtonAdd";
import { ModalTownEdit } from "./ModalTownEdit";

type Column = 'name' | 'id';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE',  sortable: true },
  { key: 'municipality', label: 'MUNICIPIO', sortable: true },
  { key: 'actions', label: 'ACTIONS'},
]

export function TownSection() {
    const { load, state, data, submit } = useFetcher<HandlerSuccess<PaginationI<TownI>>>({ key: 'towns' });
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const [ limit, setLimit ] = useState(5);
    const [ page, setPage ] = useState(1);
    const [ search, setSearch ] = useState('');
    const [ searchMunicipality, setSearchMunicipality ] = useState('');
    const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
      });
      
      const loadingState = state === 'loading' || !data 
      ? "loading" 
      : "idle";

      useEffect(() => {
        load(`/town/?pm=${1}`);
    },[load]);

    useEffect(() => {
        if(data?.serverData.data.length === 0 && data?.serverData.total > 0){
            load(`/town/?limit=${limit}&page=${page}&dm=${sortDescriptor.direction}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    useEffect(() => {
        // load(`/town/?lm=${limit}&pm=${page}&cm=${sortDescriptor.column}&dm=${sortDescriptor.direction}&sm=${search}`)
        const data = [
            { column: 'name', value: search },
            { column: 'municipality', value: searchMunicipality }
        ];

        submit({
            lm: limit,
            pm: page,
            cm: sortDescriptor.column as string,
            dm: sortDescriptor.direction as string,
            sm: JSON.stringify(data),
        },{ action: '/town'} );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, sortDescriptor, search, searchMunicipality]);
    
    const handlePagination = (page: number) => {
        setPage(page);
    }

    const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(e.target.value))
    }

    const handlerClose = () => {
        setSearch('');
    }
    
    const handlerCloseMunicipality = () => {
        setSearchMunicipality('');
    }

    const renderCell = useCallback((town: TownI, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (<TownAction onOpenEdit={onOpen} idTown={town.id}/>)
            // return <span>ACTIONS</span>
        } 

        if(columnKey === 'municipality') {
            return <span 
                    className="capitalize" 
                    id={`town_${town.municipality?.id}`}
                >{town.municipality?.name}</span>
        }

        return <span className="capitalize">{town[(columnKey as Column)]}</span>;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <div>
        <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre"
            startContent={<FaSearch />}
            value={search}
            onClear={handlerClose}
            onValueChange={setSearch}
        />
        <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre de Municipio"
            startContent={<FaSearch />}
            value={searchMunicipality}
            onClear={handlerCloseMunicipality}
            onValueChange={setSearchMunicipality}
        />
        <ModalTownEdit 
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
                    pageCount={data?.serverData?.pageCount}
                    currentPage={data?.serverData?.currentPage}
                    onChange={handlePagination}
                />
            </div>
        }
        topContent={
            <div className="flex justify-between items-center">
                <TownButtonAdd />
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
            emptyContent='No se encontraron Localidades'
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