import { json, LoaderFunction } from "@remix-run/node"
import { Generic, Key, SortDirection } from "~/.server/interfaces";
import dayjs from 'dayjs';
import { handlerPaginationParams, handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { Leader } from "~/.server/domain/entity";
import { useLoaderData, useOutlet, useSearchParams } from "@remix-run/react";
import { HandlerSuccess } from "~/.server/reponses";
import { useCallback, useState} from "react";
import { Button, Chip, Link, useDisclosure } from "@nextui-org/react";
import { InputFilter, LeaderAction, LeaderToggleActive, ModalLeaderEdit, ModalsToggle, Pagination, RangePickerDateFilter, RowPerPage, StatusFilter, TableDetail } from "~/components/ui";
import { FaUserPlus } from "react-icons/fa";
import { useParamsPaginator } from '../../../application';

const columnsFilter = ['curp', 'fullname', 'anniversaryDate', 'isActive', 'folder.name'];
const columnSortNames: Generic = {
  curp: 'curp',
  leader: 'fullname',
  anniversaryDate: 'anniversaryDate',
  isActive: 'isActive',
  folder: 'folder.name'
}

export const loader: LoaderFunction = async ({ request }) => {
  
  const url = new URL(request.url);
  const start = url.searchParams.get('start') || '';
  const end = url.searchParams.get('end') || '';
  const curp = url.searchParams.get('curp') || '';
  const isActive = url.searchParams.get('isActive');
  const folder = url.searchParams.get('folder') || '';
  const name = url.searchParams.get('name') || '';
  
  let isActiveParsed = isActive
    ? JSON.parse(isActive+'')
    : 'notUndefined';

  if(Array.isArray(isActiveParsed) && isActiveParsed.length === 1) {
    isActiveParsed = Boolean(isActiveParsed[0]);
  }

  if(Array.isArray(isActiveParsed) && isActiveParsed.length === 2) {
    isActiveParsed = 'notUndefined'
  } 

  try {
  
      const isActiveFormatted = { column: 'isActive', value: isActiveParsed };
      const curpParsed = { column: 'curp', value: curp };
      const folderParsed = { column: 'folder.name', value: folder.toLowerCase() };
      const fullnameParsed = { column: 'fullname', value: name.toLowerCase() };

      const datesParsed = (!start || !end) 
      ? { column: 'anniversaryDate', value: ''}
      : { column:  'anniversaryDate', value: {
        start: dayjs(start+'T00:00:00.000Z').toDate(),
        end: dayjs(end).toDate()
      }}
    
    const {
      page, limit, column, direction
    } = handlerPaginationParams(request.url, 'fullname', columnsFilter);

    const data = await Service.leader.findAll({
      page, 
      limit, 
      column: columnSortNames[column] ?? 'fullname', 
      direction,
      search: [isActiveFormatted, curpParsed, folderParsed, fullnameParsed, datesParsed]
    });
    
    return handlerSuccess(200, { 
      ...data,
      p: page,
      l: limit,
      c: column,
      d: direction,
      s: [isActiveFormatted, curpParsed, folderParsed, fullnameParsed, datesParsed],
      isActive: isActiveParsed,
      curp,
      folder,
      fullname: name,
      start,
      end
    });
  } catch (error) {
    console.log({error});
      return json(getEmptyPagination({
        isActive: isActiveParsed,
        curp,
        folder,
        fullname: name,
        start,
        end
      }));
  }
}

interface Loader {
  data: Leader[],
  P: number,
  l: number,
  c: string,
  d: SortDirection,
  s: {column: string, value: string}[] ,
  start: string,
  end: string,
  isActive: string,
  curp: string,
  folder: { name: string },
  fullname: string,
  total: number;
  pageCount: number;
  currentPage: number;
  nextPage: number | null;
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fullname', label: 'Nombre',  sortable: true },
  { key: 'address', label: 'DIRECCION'},
  { key: 'anniversaryDate', label: 'FECHA DE ASIGNACIÓN', sortable: true},
  { key: 'folder', label: 'CARPETA', sortable: true},
  { key: 'isActive', label: 'ESTATUS', sortable: true},
  { key: 'actions', label: 'ACCIONES'},
]

export default function LeaderPage () {
  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const outlet = useOutlet();
  const [ searchParams ] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number>(0);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({
    columnDefault: 'fullname'
  });
  
  const renderCell = useCallback((leader: Leader, columnKey: Key) => {
    if(columnKey === 'actions') {
      return (
        <div className='flex justify-center items-center gap-1'>
          <LeaderToggleActive 
              leaderId={leader.id}
              isActive={leader.isActive}
              handlePress={setSelectedId}
          />
          <LeaderAction 
            leaderId={leader.id} 
            onOpenEdit={onOpen} 
          />
        </div>
      )
    } 
    
    if(columnKey === 'folder') {
        return <span 
                className="capitalize" 
            >{leader.folder.name}</span>
    }

    if(columnKey == 'isActive') {
      const status = leader.isActive ? 'Activo' : 'Inactivo';
      const color = leader.isActive ? 'success' : 'danger' 
      return ( <Chip color={color} variant="bordered" >{status}</Chip>)
    }

    return <span className="capitalize">{leader[columnKey as never]}</span>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    { outlet }
    <ModalsToggle 
      leaderId={selectedId}
      handleSelectedId={setSelectedId}
    />
    <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
      <StatusFilter 
        isActive={loader?.serverData?.isActive}
        param='isActive'
      />
      <InputFilter 
        param="name" 
        name="name" 
        label="Líder" 
        id="name" 
        placeholder="Nombre de la líder"      
        defaultValue={loader?.serverData?.fullname}
      />
      <InputFilter 
        param="folder" 
        name="folder" 
        label="Carpeta" 
        id="folder" 
        placeholder="Nombre de la carpeta"      
        defaultValue={loader?.serverData?.folder.name}
      />
      <RangePickerDateFilter 
        label="Rango de la fecha de asignación" 
        startName="start" 
        endName="end"
        start={loader?.serverData.start} 
        end={loader?.serverData.end} 
      />
    </div>
    <ModalLeaderEdit isOpen={isOpen} onOpenChange={onOpenChange} />
    <TableDetail 
      aria-label="Leaders table"
      onSortChange={handleSort}
      sortDescriptor={sortDescriptor}
      bottomContent={
        <Pagination 
          pageCount={loader?.serverData?.pageCount}
          currentPage={loader?.serverData?.currentPage}
          onChange={handlePagination}
        />    
      }
      topContent={
          <div className="flex justify-between items-center">
              <Button
                href={`/leaders/create?${searchParams.toString()}`}
                as={Link}
                endContent={<FaUserPlus />}
                variant="ghost"
                color="secondary" 
              >
                Crear Líder
              </Button>
              <span className="text-default-400 text-small">
                  Total {loader?.serverData.total || 0 } Líderes
              </span>
              <RowPerPage onChange={handleRowPerPage} checkParams/>
          </div>
      }
      columns={columns} 
      loadingState={loadingState} 
      emptyContent="No se encontraron lideres" 
      renderCell={renderCell} 
      data={loader?.serverData.data ?? []}    
    />
  </>
  )
}

