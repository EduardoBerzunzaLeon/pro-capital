import { DateValue, getLocalTimeZone, now, parseDate } from "@internationalized/date";
import { BreadcrumbItem, DatePicker } from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import { json, useLoaderData, useRouteError, useSearchParams } from "@remix-run/react"
import { useCallback, useState } from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import { Generic, Key } from "~/.server/interfaces";
import { getEmptyPagination } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { useParamsPaginator, useRenderCell } from "~/application";
import { Pagination, RowPerPage, TableDetail } from "~/components/ui";
import { ErrorCard } from "~/components/utils/ErrorCard";
import dayjs from 'dayjs'

const columns = [
  { key: 'fullname', label: 'LÍDER'},
  { key: 'folder', label: 'CARPETA'},
  { key: 'birthday', label: 'CUMPLEAÑOS'},
  { key: 'address', label: 'DIRECCIÓN' },
]

interface LeadersBirthday  {
  id: number,
  fullname: string,
  birthday: Date,
  address: string
}

export const loader: LoaderFunction = async ({ request }) => {

  const date = new Date();
  const url = new URL(request.url);
  const page = url.searchParams.get('p') || 1;
  const limit = url.searchParams.get('l') || 5;
  const month = url.searchParams.get('month') ?? date.getMonth() + 1;
  const day = url.searchParams.get('day') ?? date.getDate();

  try {
    const { metadata, data }=  await Service.leader.findAllBirthday({ limit, page, month, day });

console.log(data);
    return {
      serverData: { 
        data, 
        total: metadata.total, 
        currentPage: metadata.page,
        pageCount: metadata.pageCount,
    }}
  } catch (error) {
    console.log({error})
    return json(getEmptyPagination())
  }
}


export function ErrorBoundary() {
  const error = useRouteError();
  return (<ErrorCard 
      error={(error as Generic)?.message ?? 'Ocurrio un error inesperado'}
      description='Ocurrio un error, favor de contactar con el administrador'
  />)
}


export default function Index() {

  const leaders = useLoaderData<typeof loader>();
  const [searchParams , setSearchParams] = useSearchParams();
  const [date, setDate] = useState<DateValue>(searchParams?.get('date')
  ? parseDate(searchParams.get('date') ?? '')  
  : now(getLocalTimeZone()));

  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({ columnDefault: 'name' });
  const { render } = useRenderCell({ isMoney: false }); 


  const renderCell = useCallback((leader: LeadersBirthday, columnKey: Key) => {

    if(columnKey === 'birthday') {
      return <span className='capitalize'>{dayjs(leader.birthday).add(1, 'day').format('YYYY-MM-DD')}</span>
    }

    return <span className='capitalize'>{render(leader, columnKey)}</span>
    // return <span className='capitalize'>nodata</span>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: DateValue) => {
    const dateSelected =  dayjs(e.toDate('America/Mexico_City')).format('YYYY-MM-DD');
    setSearchParams((prev) => {
      prev.set('month', String(e.month));
      prev.set('day', String(e.day));
      prev.set('date', String(dateSelected));
      return prev;
    }, {preventScrollReset: true});
    setDate(e);
  }


  return (
    <>
     <DatePicker 
      className="max-w-[284px]" 
      label="Fecha de cumpleaños" 
      variant='bordered'
      startContent={<FaSearch />}
      labelPlacement='outside'
      granularity="day"
      value={date}
      onChange={handleChange}
    />
      <TableDetail 
          aria-label="roles table"
          onSortChange={handleSort}
          sortDescriptor={sortDescriptor}
          bottomContent={
              <Pagination
              pageCount={leaders?.serverData?.pageCount}
              currentPage={leaders?.serverData?.currentPage}
              onChange={handlePagination} 
              />
          }
          topContent={
              <div className="flex justify-between items-center">
                  <span className="text-default-400 text-small">
                      Total {leaders?.serverData.total || 0} lideres
                  </span>
                  <RowPerPage
                      onChange={handleRowPerPage} 
                      checkParams
                  />
              </div>
          } 
          columns={columns} 
          loadingState={loadingState} 
          emptyContent="No se encontraron lideres que cumplen en la fecha" 
          renderCell={renderCell} 
          data={leaders?.serverData.data ?? []}    
      />
    </>
  )
} 
  