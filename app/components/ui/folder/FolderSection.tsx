import {  useCallback, useEffect, useState } from "react";

import { Input,  Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";

import { Pagination, RowPerPage } from "..";
import { FaSearch } from "react-icons/fa";
import { Folder } from "~/.server/domain/entity/folder.entity";
import { FolderAction } from "./FolderAction";
import { FolderButtonAdd } from "./FolderButtonAdd";
import { ModalFolderEdit } from "./ModalFolderEdit";
import { useFetcherPaginator } from "~/application";

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
        onSubmit
    } = useFetcherPaginator<Folder>({key: 'folder', route: 'folder'});


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
        <Input
            isClearable
            className="w-full sm:max-w-[30%]"
            placeholder="Buscar por Carpeta"
            startContent={<FaSearch />}
            value={search}
            variant='bordered'
            onClear={handlerClose}
            onValueChange={setSearch}
        />
        <Input
            isClearable
           className="w-full sm:max-w-[30%]"
            placeholder="Buscar por Localidad"
            startContent={<FaSearch />}
            value={searchTown}
            variant='bordered'
            onClear={handlerCloseTown}
            onValueChange={setSearchTown}
        />
        <Input
            isClearable
            variant='bordered'
            className="w-full sm:max-w-[30%]"
            placeholder="Buscar por Municipio"
            startContent={<FaSearch />}
            value={searchMunicipality}
            onClear={handlerCloseMunicipality}
            onValueChange={setSearchMunicipality}
        />
    </div>
  <ModalFolderEdit 
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
          <FolderButtonAdd />
          <span className="text-default-400 text-small">Total {data?.serverData.total || 0 } Carpetas </span>
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
      emptyContent='No se encontraron Carpetas'
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