import { Key, SortDirection } from "~/.server/interfaces";
import { Leader } from "~/.server/domain/entity";
import { useLoaderData, useOutlet, useSearchParams } from "@remix-run/react";
import { HandlerSuccess } from "~/.server/reponses";
import { useCallback, useState} from "react";
import { Button, Link, useDisclosure } from "@nextui-org/react";
import { ChipStatus, InputFilter, LeaderAction, LeaderToggleActive, ModalLeaderEdit, ModalsToggle, Pagination, RangePickerDateFilter, RowPerPage, StatusFilter, TableDetail } from "~/components/ui";
import { FaUserPlus } from "react-icons/fa";
import { useParamsPaginator } from '../../../application';
import { leaderLoader } from "~/application/leader/leader.loader";

export {
  leaderLoader as loader
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
      return (<ChipStatus isActive={leader.isActive} />)
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

