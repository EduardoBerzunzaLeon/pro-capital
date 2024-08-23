import { Input, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { ChangeEvent, Key, useCallback, useEffect, useState } from "react";
import { TownI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { HandlerSuccess } from "~/.server/reponses";
import { Pagination, RowPerPage } from "..";
import { FaSearch } from "react-icons/fa";
import { Folder, FolderI } from "~/.server/domain/entity/folder.entity";
import { FolderAction } from "./FolderAction";
import { FolderButtonAdd } from "./FolderButtonAdd";
import { ModalFolderEdit } from "./ModalFolderEdit";

type Column = 'name' | 'id';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE',  sortable: true },
  { key: 'leader', label: 'LIDER', },
  { key: 'municipality', label: 'MUNICIPIO', sortable: true },
  { key: 'town', label: 'Localidad',  sortable: true },
  { key: 'count', label: 'Grupos',  },
  { key: 'actions', label: 'ACTIONS'},
]

export function FolderSection() {
    const { load, state, data, submit } = useFetcher<HandlerSuccess<PaginationI<Folder>>>({ key: 'folder' });
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const [ limit, setLimit ] = useState(5);
    const [ page, setPage ] = useState(1);
    const [ search, setSearch ] = useState('');
    const [ searchMunicipality, setSearchMunicipality ] = useState('');
    const [ searchTown, setSearchTown ] = useState('');
    const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
      });
      
      const loadingState = (state === 'loading' || state === 'submitting') || !data 
      ? "loading" 
      : "idle";

      useEffect(() => {
        load(`/folder/?pm=${1}`);
    },[load]);

    
    useEffect(() => {
      if(data?.serverData.data.length === 0 && data?.serverData.total > 0){
          load(`/folder/?limit=${limit}&page=${page}&dm=${sortDescriptor.direction}`);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
      // load(`/town/?lm=${limit}&pm=${page}&cm=${sortDescriptor.column}&dm=${sortDescriptor.direction}&sm=${search}`)
      const data = [
          { column: 'name', value: search },
          { column: 'town.name', value: searchTown },
          { column: 'town.municipality.name', value: searchMunicipality },
      ];

      submit({
          lm: limit,
          pm: page,
          cm: sortDescriptor.column as string,
          dm: sortDescriptor.direction as string,
          sm: JSON.stringify(data),
      },{ action: '/folder'} );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, sortDescriptor, search, searchMunicipality, searchTown]);
  
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

const handlerCloseTown = () => {
    setSearchTown('');
}

const renderCell = useCallback((folder: Folder, columnKey: Key) => {
  if(columnKey === 'actions') {
        return (<FolderAction onOpenEdit={onOpen} idFolder={folder.id}/>)
  } 

  return <span className="capitalize">{folder[(columnKey as any)]}</span>;
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
      placeholder="Buscar por nombre de Localidad"
      startContent={<FaSearch />}
      value={searchTown}
      onClear={handlerCloseTown}
      onValueChange={setSearchTown}
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
  <ModalFolderEdit 
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
              align={column.key === "actions" ? "center" : "start"}
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