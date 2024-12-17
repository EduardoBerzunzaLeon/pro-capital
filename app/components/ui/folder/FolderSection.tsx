import {  useCallback, useEffect, useState } from "react";

import { Input, useDisclosure } from "@nextui-org/react";
import { ButtonClear, Pagination, RowPerPage, TableDetail , ChipStatus } from "..";
import { FaSearch } from "react-icons/fa";
import { Folder } from "~/.server/domain/entity/folder.entity";
import { FolderAction } from "./FolderAction";
import { FolderButtonAdd } from "./FolderButtonAdd";
import { useFetcherPaginator, permissions } from '~/application';
import { ModalFolderEdit } from "./ModalFolderEdit";
import { GroupGenerateButton } from "./GroupGenerateButton";
import { ExcelReport } from "../excelReports/ExcelReport";
import { Permission } from '../auth/Permission';
import { MultiplePermissions } from "../auth/MultiplePermissions";
import { FOLDER_COLUMNS } from "../excelReports/columns";
import FolderToggleActive from "./FolderToggleActive";

export type Key = string | number;

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'route', label: 'RUTA' },
  { key: 'name', label: 'CARPETA',  sortable: true },
  { key: 'leader', label: 'LIDER', },
  { key: 'municipality', label: 'MUNICIPIO', sortable: true },
  { key: 'town', label: 'LOCALIDAD',  sortable: true },
  { key: 'count', label: 'GRUPOS',  },
  { key: 'isActive', label: 'ESTATUS' },
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

    const handlerClear = () => {
        handlerClose();
        handlerCloseMunicipality();
        handlerCloseTown();
    }

const renderCell = useCallback((folder: Folder, columnKey: Key) => {
  if(columnKey === 'actions') {
        return (
            <div className='flex justify-center items-center gap-1'>
                <Permission permission={permissions.folder.permissions.active}>
                    <FolderToggleActive 
                        folderId={folder.id}
                        isActive={folder.isActive}
                    />
                </Permission>
                <MultiplePermissions permissions={[
                    permissions.folder.permissions.delete,
                    permissions.folder.permissions.update,
                ]}>
                        <FolderAction onOpenEdit={onOpen} idFolder={folder.id}/>
                </MultiplePermissions>
            </div>
        )
  } 
    if(columnKey == 'isActive') {
        return <ChipStatus isActive={folder.isActive}/>
    }

    return <span className="capitalize">{folder[columnKey as keyof typeof folder]}</span>;
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

return (
        <div>
            <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between'>
                <Permission permission={permissions.folder.permissions.report}>
                    <ExcelReport url={url} name='carpetas' columns={FOLDER_COLUMNS} />
                </Permission>
                <ButtonClear 
                    onClear={handlerClear}
                />
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
                        <Permission permission={permissions.folder.permissions.add}>
                            <FolderButtonAdd />
                        </Permission>
                        <Permission permission={permissions.utils.permissions.generate_groups}>
                            <GroupGenerateButton />
                        </Permission>
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