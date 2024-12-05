import {  useCallback, useEffect, useState } from "react";

import { Input, useDisclosure } from "@nextui-org/react";
import { Pagination, RowPerPage, TableDetail } from "..";
import { FaSearch } from "react-icons/fa";
import { Folder } from "~/.server/domain/entity/folder.entity";
import { FolderAction } from "./FolderAction";
import { FolderButtonAdd } from "./FolderButtonAdd";
import { useFetcherPaginator } from "~/application";
import { ModalFolderEdit } from "./ModalFolderEdit";
import { GroupGenerateButton } from "./GroupGenerateButton";
import { ExcelReport } from "../excelReports/ExcelReport";

export type Key = string | number;


const columns = [
  { key: 'id', label: 'ID' },
  { key: 'route', label: 'RUTA' },
  { key: 'name', label: 'CARPETA',  sortable: true },
  { key: 'leader', label: 'LIDER', },
  { key: 'municipality', label: 'MUNICIPIO', sortable: true },
  { key: 'town', label: 'LOCALIDAD',  sortable: true },
  { key: 'count', label: 'GRUPOS',  },
  { key: 'actions', label: 'ACCIONES'},
]

export function FolderSection() {

    const [ search, setSearch ] = useState('');
    const [ searchMunicipality, setSearchMunicipality ] = useState('');
    const [ searchTown, setSearchTown ] = useState('');
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
    } = useFetcherPaginator<Folder>({ key: 'folder', route: 'folder' });


  useEffect(() => {
      const data = [
          { column: 'name', value: search },
          { column: 'town.name', value: searchTown },
          { column: 'town.municipality.name', value: searchMunicipality },
      ];

      onSubmit(data);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, sortDescriptor, search, searchMunicipality, searchTown]);
  

    const handlerClose = () => {
        setSearch('');
    }

    const handlerCloseMunicipality = () => {
        setSearchMunicipality('');
    }

    const handlerCloseTown = () => {
        setSearchTown('');
    }

const renderCell = useCallback((folder: Folder, columnKey: Key) => {
  if(columnKey === 'actions') {
        return (<FolderAction onOpenEdit={onOpen} idFolder={folder.id}/>)
  } 

    return <span className="capitalize">{folder[columnKey as keyof typeof folder]}</span>;
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

return (
  <div>
    <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between'>
        <ExcelReport url={url} name='carpetas' />
        <Input
            className="w-full sm:max-w-[30%]"
            isClearable
            onClear={handlerClose}
            onValueChange={setSearch}
            placeholder="Buscar por Carpeta"
            startContent={<FaSearch />}
            value={search}
            variant='bordered'
        />
        <Input
            className="w-full sm:max-w-[30%]"
            isClearable
            onClear={handlerCloseTown}
            onValueChange={setSearchTown}
            placeholder="Buscar por Localidad"
            startContent={<FaSearch />}
            value={searchTown}
            variant='bordered'
        />
        <Input
            className="w-full sm:max-w-[30%]"
            isClearable
            onClear={handlerCloseMunicipality}
            onValueChange={setSearchMunicipality}
            placeholder="Buscar por Municipio"
            startContent={<FaSearch />}
            value={searchMunicipality}
            variant='bordered'
        />
    </div>

  <ModalFolderEdit 
      isOpen={isOpen}
      onOpenChange={onOpenChange}
  />
    <TableDetail 
        aria-label="folders table"
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
            <div className="flex justify-between items-center">
                <FolderButtonAdd />
                <GroupGenerateButton />
                <span className="text-default-400 text-small">Total {data?.serverData.total || 0 } Carpetas </span>
                <RowPerPage 
                    onChange={handleRowPerPage}
                />
            </div>
        }
        columns={columns} 
        loadingState={loadingState} 
        emptyContent="No se encontraron carpetas" 
        renderCell={renderCell} 
        data={data?.serverData.data ?? []}    
    />
</div>
)
}