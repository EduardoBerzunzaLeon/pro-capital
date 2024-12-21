import {  Key, useCallback, useEffect, useState } from "react";

import { Input, useDisclosure } from "@nextui-org/react";
import { Town } from "~/.server/domain/entity";
import { ButtonClear, Pagination, RowPerPage, TableDetail } from "..";
import { FaSearch } from "react-icons/fa";
import { TownAction } from "./TownAction";
import { TownButtonAdd } from "./TownButtonAdd";
import { ModalTownEdit } from "./ModalTownEdit";
import { useFetcherPaginator, permissions } from '~/application';
import { MultiplePermissions } from '../auth/MultiplePermissions';
import { Permission } from "../auth/Permission";
import { ExcelReport } from "../excelReports/ExcelReport";
import { TOWN_COLUMNS } from "../excelReports/columns";

type Column = 'name' | 'id';

const columns = [
  { key: 'name', label: 'NOMBRE',  sortable: true }, 
  { key: 'municipality', label: 'MUNICIPIO', sortable: true },
  { key: 'actions', label: 'ACCIONES'},
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
        onSubmit,
        url
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

    const handlerClear = () => {
        setSearch('');
        setSearchMunicipality('');
    }

    const renderCell = useCallback((town: Town, columnKey: Key) => {
        if(columnKey === 'actions') {
          return (
                <MultiplePermissions permissions={[
                    permissions.town.permissions.delete,
                    permissions.town.permissions.update,
                ]}>
                    <TownAction onOpenEdit={onOpen} idTown={town.id}/>
                </MultiplePermissions>
            )
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
        <div className='w-full'>
        <ModalTownEdit 
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        />
      <TableDetail 
        aria-label="Towns table"
        onSortChange={setSortDescriptor}
        sortDescriptor={sortDescriptor}
        bottomContent={
            <Pagination 
                pageCount={data?.serverData?.pageCount}
                currentPage={data?.serverData?.currentPage}
                onChange={handlePagination}
            />
        }
        topContent={
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end flex-wrap">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%] md:max-w-[25%] lg:max-w-[33%]"
                        placeholder="Buscar por localidad"
                        startContent={<FaSearch />}
                        variant='bordered'
                        value={search}
                        onClear={handlerClose}
                        onValueChange={setSearch}
                    />
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%] md:max-w-[33%]"
                        placeholder="Buscar por municipio"
                        startContent={<FaSearch />}
                        variant='bordered'
                        value={searchMunicipality}
                        onClear={handlerCloseMunicipality}
                        onValueChange={setSearchMunicipality}
                    />
                    <div className='flex flex-wrap gap-1'>
                        <Permission permission={permissions.folder.permissions.report}>
                            <ExcelReport url={url} name='localidades' columns={TOWN_COLUMNS} />
                        </Permission>
                        <ButtonClear 
                            onClear={handlerClear}
                        />
                        <Permission permission={permissions.town.permissions.add}>
                            <TownButtonAdd />
                        </Permission>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {data?.serverData.total || 0 } localidades
                    </span>
                    <RowPerPage 
                        onChange={handleRowPerPage}
                        />
                </div>
            </div>
        }
        columns={columns} 
        loadingState={loadingState} 
        emptyContent="No se encontraron localidades" 
        renderCell={renderCell} 
        data={data?.serverData.data ?? []}    
      />
    </div>
    )
}