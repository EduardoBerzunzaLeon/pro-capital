import {  Key, useCallback, useEffect, useState } from "react";

import { Input,  Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { Town } from "~/.server/domain/entity";
import { Pagination, RowPerPage } from "..";
import { FaSearch } from "react-icons/fa";
import { TownAction } from "./TownAction";
import { TownButtonAdd } from "./TownButtonAdd";
import { ModalTownEdit } from "./ModalTownEdit";
import { useFetcherPaginator } from "~/application";

type Column = 'name' | 'id';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE',  sortable: true },
  { key: 'municipality', label: 'MUNICIPIO', sortable: true },
  { key: 'actions', label: 'ACTIONS'},
]

export function TownSection() {
    
    const [ search, setSearch ] = useState('');
    const [ searchMunicipality, setSearchMunicipality ] = useState('');
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
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
    } = useFetcherPaginator<Town>({key: 'town', route: 'town'});

    useEffect(() => {

        const data = [
            { column: 'name', value: search },
            { column: 'municipality.name', value: searchMunicipality }
        ];

        onSubmit(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, sortDescriptor, search, searchMunicipality]);
    

    const handlerClose = () => {
        setSearch('');
    }
    
    const handlerCloseMunicipality = () => {
        setSearchMunicipality('');
    }

    const renderCell = useCallback((town: Town, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (<TownAction onOpenEdit={onOpen} idTown={town.id}/>)
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
        <div className='w-full md:max-w-[48%]'>
             <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between'>
        <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por localidad"
            startContent={<FaSearch />}
            variant='bordered'
            value={search}
            onClear={handlerClose}
            onValueChange={setSearch}
        />
        <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por municipio"
            startContent={<FaSearch />}
            variant='bordered'
            value={searchMunicipality}
            onClear={handlerCloseMunicipality}
            onValueChange={setSearchMunicipality}
        />
        </div>
        <ModalTownEdit 
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
                    pageCount={data?.serverData?.pageCount}
                    currentPage={data?.serverData?.currentPage}
                    onChange={handlePagination}
                />
            </div>
        }
        topContent={
            <div className="flex justify-between items-center">
                <TownButtonAdd />
                <span className="text-default-400 text-small">
                    Total {data?.serverData.total || 0 } localidades
                </span>
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