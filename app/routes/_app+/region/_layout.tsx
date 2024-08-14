import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Pagination } from "@nextui-org/react";
import { ActionFunction, json } from '@remix-run/node';
import {  useFetcher } from "@remix-run/react";
import { Key, useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import {  MunicipalityI } from "~/.server/domain/entity";
import { handlerError } from "~/.server/errors/handlerError";
import { Service } from "~/.server/services";

type Column = 'name' | 'id'  ;

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'NOMBRE' },
  { key: 'actions', label: 'ACTIONS'},
]

export const action: ActionFunction = async({request}) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await Service.municipality.deleteOne(Number(data.id));
    return json({status: 'success'}, 201);
  } catch (error) {
    return handlerError(error);
    // return json({error: 'no data'});
  }
}

export default function  RegionPage()  {
  const fetcher = useFetcher({ key: 'municipality' });
  const fetcherDelete = useFetcher({ key: 'municipalityDelete' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(fetcherDelete.data?.error ) {
      toast.error(fetcherDelete.data?.error);
    }
  }, [fetcherDelete.data]);

  useEffect(() => {
    fetcher.load(`/municipality/?pm=${1}`);
    setIsLoading(false);
  },[]);

  const handlePagination = (page: number) => {
    fetcher.load(`/municipality/?pm=${page}`)
  }

  const handleRowPerPage = (a) => {
    fetcher.load(`/municipality/?lm=${a.target.value}`)
  }

  const handleDelete = (id: number) => {
    fetcherDelete.submit({id}, {
      method: 'POST', 
      action:'/region'
   })
  }
 
  const renderCell = useCallback((municipality: MunicipalityI, columnKey: Key) => {
    if(columnKey === 'actions') {
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Editar Municipio">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <FaEdit />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Eliminar Municipio">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <FaTrashAlt onClick={() => handleDelete(municipality.id)} />
            </span>
          </Tooltip>
        </div>
      )
    } 
    return municipality[(columnKey as Column)];

  }, [])

  return ( 
    <div>

    <Table 
      isStriped 
      aria-label="Municipalities table"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={fetcher?.data?.currentPage || 0}
            total={fetcher?.data?.pageCount}
            onChange={handlePagination}
          />
        </div>
      }
      topContent={
        <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">Total {fetcher?.data?.total} users</span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={handleRowPerPage}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </label>
      </div>
      }
    >
      <TableHeader>
        {columns.map((column) =>
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={isLoading || fetcher.state === 'loading' ? 'Cargando los Municipios' : 'No se encontraron Municipios'}>
        {fetcher?.data?.data?.map((municipality) =>
          <TableRow key={municipality.id}>
            {(columnKey) => <TableCell>{renderCell(municipality, columnKey)}</TableCell>}
          </TableRow>
        )}  
      </TableBody>
    </Table>

    </div>
  )
}
