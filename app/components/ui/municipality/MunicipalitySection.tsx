import { Key, useCallback, useEffect, useState} from "react";
import { useDisclosure, Input } from "@nextui-org/react";
import { Municipality } from "~/.server/domain/entity";
import { Pagination, TableDetail } from "..";
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
          <TableDetail 
            aria-label="Municipalities table"
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
                    <MunicipalityButtonAdd />
                    <span className="text-default-400 text-small">Total {data?.serverData.total || 0 } municipios </span>
                    <RowPerPage 
                        onChange={handleRowPerPage}
                    />
                </div>
            }
            columns={columns} 
            loadingState={loadingState} 
            emptyContent="No se encontraron municipios" 
            renderCell={renderCell} 
            data={data?.serverData.data ?? []}    
          />
        </div>
    )
} 