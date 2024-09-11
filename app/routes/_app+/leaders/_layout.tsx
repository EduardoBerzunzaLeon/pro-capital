import { json, LoaderFunction } from "@remix-run/node"
import { Generic, Key, Selection, LoadingState, SortDirection } from "~/.server/interfaces";
import dayjs from 'dayjs';
import { handlerPaginationParams, handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { Leader } from "~/.server/domain/entity";
import { useLoaderData, useNavigation, useOutlet, useSearchParams } from "@remix-run/react";
import { HandlerSuccess } from "~/.server/reponses";
import { ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import { Button, Chip,  DateRangePicker, Input, Link, RangeValue, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { ClientOnly } from "remix-utils/client-only";
import { DropdownStatus, LeaderAction, ModalLeaderEdit, Pagination, RowPerPage } from "~/components/ui";
import { DateValue, parseDate } from "@internationalized/date";
import { FaUserPlus } from "react-icons/fa";

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
  
  let isActiveParsed =  isActive
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
  const [ searchParams , setSearchParams] = useSearchParams();
  const [selectedDates, setSelectedDates] = useState<RangeValue<DateValue> | null>(null)
  const navigation = useNavigation();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  

  const loadingState: LoadingState = navigation.state === 'idle' 
    ? 'idle' : 'loading';
  
  const renderCell = useCallback((leader: Leader, columnKey: Key) => {
    if(columnKey === 'actions') {
      return (<LeaderAction leaderId={leader.id} onOpenEdit={onOpen} />)
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

  
  useEffect(() => {

    if(!selectedDates && (
      loader?.serverData.start 
        || loader?.serverData.end
    )) {
      const { start, end } = loader.serverData;

      const newDates = { 
        start: parseDate(start),
        end: parseDate(end)
      }
      setSelectedDates(newDates);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader.serverData.start, loader.serverData.end]);
  

  const defaultStatus: Selection = useMemo(() => {

    if(!loader.serverData.isActive || loader.serverData.isActive === 'notUndefined') {
      return new Set(['active','inactive']);
    }

    const { isActive } = loader.serverData;

    const selectedStatus: Set<Key> = new Set();

    isActive 
      ? selectedStatus.add('active')
      : selectedStatus.add('inactive');

    return selectedStatus;

  }, [loader?.serverData])

  const handlePagination = (page: number) => {
    setSearchParams((prev) => {
      prev.set('p', String(page))
      return prev;
    });
  }
  
  const handleRowPerPage = (e: ChangeEvent<HTMLSelectElement>) => {
    setSearchParams((prev) => {
      prev.set('l', String(e.target.value))
      return prev;
    });
  }


  const handleSort = (descriptor: SortDescriptor) => {
    const direction = descriptor?.direction ??  'ascending';
    const column = descriptor?.column ??  'fullname';
    setSearchParams((prev) => {
      prev.set("d", direction);
      prev.set("c", String(column));
      return prev;
    }, {preventScrollReset: true});
  }

  const handleFullnameChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      prev.set('name',event.currentTarget.value)
      return prev;
    })
  }
  
  const handleFolderChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      prev.set('folder',event.currentTarget.value)
      return prev;
    })
  }

  
  const handleDates = (dates: RangeValue<DateValue>) => {
    const start = dayjs(dates.start.toDate('America/Mexico_City')).format('YYYY-MM-DD');
    const end = dayjs(dates.end.toDate('America/Mexico_City')).format('YYYY-MM-DD');
    setSelectedDates(dates);

    setSearchParams((prev) => {
      prev.set("start", start);
      prev.set("end", String(end));
      return prev;
    }, {preventScrollReset: true});
  }

  const handleStatusChange = (keys: Selection) => {
    const data = JSON.stringify(Array.from(keys).map(value => value === 'active'));
    setSearchParams(prev => {
      prev.set('isActive',data)
      return prev;
    })
  }

  return (
    <>
    { outlet }
    <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
      <DropdownStatus 
        defaultSelectedKeys={defaultStatus}
        onSelectionChange={handleStatusChange} 
      />
      <Input 
        id='name'
        name='name'
        variant='bordered'
        className="w-full md:max-w-[30%]"
        labelPlacement="outside"
        label='Líder'
        placeholder="Nombre de la líder"
        defaultValue={loader?.serverData?.fullname || ''}
        onChange={handleFullnameChange}
      />
      <Input 
        id='folder'
        name='folder'
        variant='bordered'
        className="w-full md:max-w-[30%]"
        labelPlacement="outside"
        label='Carpeta'
        placeholder="Nombre de la carpeta"
        defaultValue={loader?.serverData?.folder.name || ''}
        onChange={handleFolderChange}
      />
      <DateRangePicker
        label="Rango de la fecha de asignación"
        className="w-full md:max-w-[40%]"
        variant='bordered'
        onChange={handleDates}
        value={selectedDates}
        aria-label="date ranger picker"
        labelPlacement='outside'
        CalendarBottomContent={
        <Button 
          className="mb-2 ml-2"
          size="sm" 
          aria-label="delete_filter_date"
          variant="ghost"
          color='primary'
          onClick={() => {
            setSelectedDates(null);
            setSearchParams((prev) => {
              prev.delete("start");
              prev.delete("end");
              return prev;
            }, {preventScrollReset: true});
          }}
        >
          Limpiar
        </Button>}
      />
    </div>
    <ModalLeaderEdit isOpen={isOpen} onOpenChange={onOpenChange} />
    <Table 
    aria-label="Municipalities table"
    onSortChange={handleSort}
    sortDescriptor={{
      column:  loader?.serverData.c ?? 'assignAt',
      direction: loader?.serverData.d ?? 'ascending',
    }}
    
    bottomContent={
        <div className="flex w-full justify-center">
          <ClientOnly>
            {
              () => (
                <Pagination 
                      pageCount={loader?.serverData?.pageCount}
                      currentPage={loader?.serverData?.currentPage}
                      onChange={handlePagination}
                  />    
                )
            }
          </ClientOnly>
        </div>
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
            <RowPerPage onChange={handleRowPerPage} />
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
        emptyContent='No se encontraron asesores asignados'
        items={loader?.serverData.data ?? []}
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
  </>
  )
}

