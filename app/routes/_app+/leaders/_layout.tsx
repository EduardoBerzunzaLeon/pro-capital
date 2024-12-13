import { Key, SortDirection } from "~/.server/interfaces";
import { Leader } from "~/.server/domain/entity";
import { useLoaderData, useOutlet, useSearchParams } from "@remix-run/react";
import { HandlerSuccess } from "~/.server/reponses";
import { useCallback, useState, Fragment } from 'react';
import { Button, Link, useDisclosure } from "@nextui-org/react";
import { ButtonClear, ChipStatus, InputFilter, LeaderAction, LeaderToggleActive, ModalLeaderEdit, ModalsToggle, Pagination, RangePickerDateFilter, RowPerPage, StatusFilter, TableDetail } from "~/components/ui";
import { FaUserPlus } from "react-icons/fa";
import { useParamsPaginator , permissions, useClearFilters } from '../../../application';
import { leaderLoader } from "~/application/leader/leader.loader";
import { MultiplePermissions } from "~/components/ui/auth/MultiplePermissions";
import { Permission } from '../../../components/ui/auth/Permission';
import { ExcelReport } from "~/components/ui/excelReports/ExcelReport";
import { LEADER_COLUMNS } from "~/components/ui/excelReports/columns";
import { FaPersonDressBurst } from "react-icons/fa6";

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

export const handle = {
  breadcrumb: () => ({
    href: '/leaders',
    label: 'Líderes',
    startContent: <FaPersonDressBurst />,
  })
}



export default function LeaderPage () {
  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const outlet = useOutlet();
  const [ searchParams ] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number>(0);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const { key, onClearFilters } = useClearFilters();

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
          <Permission permission={permissions.leaders.permissions.active}>
            <LeaderToggleActive 
                leaderId={leader.id}
                isActive={leader.isActive}
                handlePress={setSelectedId}
              />
          </Permission>
          <MultiplePermissions 
            permissions={[
              permissions.leaders.permissions.update,
              permissions.leaders.permissions.delete,
            ]}
          >
            <LeaderAction 
              leaderId={leader.id} 
              onOpenEdit={onOpen} 
            />
          </MultiplePermissions>
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
    <Permission permission={permissions.leaders.permissions.report}>
      <ExcelReport url={`/leaders/export?${searchParams.toString()}`} name='lideres' columns={LEADER_COLUMNS} />
    </Permission>
    <ButtonClear 
       onClear={onClearFilters}
    />
      <Fragment key={key}>
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
      </Fragment>
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
            <Permission permission={permissions.leaders.permissions.add}>
              <Button
                href={`/leaders/create?${searchParams.toString()}`}
                as={Link}
                endContent={<FaUserPlus />}
                variant="ghost"
                color="secondary" 
              >
                Crear Líder
              </Button>
            </Permission>
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

