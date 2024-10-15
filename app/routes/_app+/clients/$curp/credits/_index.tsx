import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip, Select, SelectItem } from "@nextui-org/react";
import { LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { useState, useCallback, useMemo } from "react";
import { Credit, Status } from "~/.server/domain/entity/credit.entity";
import { Color , Key, SortDirection, Selection} from "~/.server/interfaces";
import { handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { useParamsPaginator, useRenderCell } from "~/application";
import { TableDetail, RowPerPage, Pagination } from "~/components/ui";

export const loader: LoaderFunction = async ({ params, request }) => {
    const url = new URL(request.url);

    const curp = { column: 'client.curp', value: params?.curp ?? '' }
    const status = { column: 'status', value: [ 'VENCIDO', 'ACTIVO', 'RENOVADO' ]}

    const page = url.searchParams.get('pc') || 1;
    const limit = url.searchParams.get('lc') || 5;
    const column = url.searchParams.get('cc') || 'folder.name';
    const direction = url.searchParams.get('dc') || 'ascending';

    const pagination = {
        page: Number(page),
        limit: Number(limit),
        column,
        direction,
        search: [curp, status]
    }

    try {
        const data = await Service.credit.findAll(pagination);
        console.log({data});
        return handlerSuccess(200, {
          ...data,
          p: page,
          l: limit,
          c: column,
          d: direction,
        })

    } catch (err) {
        console.log({err});
        return [];
    }

}

const columns = [
  { key: 'client.fullname', label: 'CLIENTE',  sortable: true },
  { key: 'aval.fullname', label: 'AVAL',  sortable: true},
  { key: 'client.curp', label: 'CLIENTE CURP', sortable: true},
  { key: 'client.address', label: 'DIRECCIÓN CLIENTE'},
  { key: 'aval.address', label: 'DIRECCIÓN AVAL'},
  { key: 'client.reference', label: 'REFERENCIA CLIENTE'},
  { key: 'aval.reference', label: 'REFERENCIA AVAL'},
  { key: 'folder.name', label: 'CARPETA', sortable: true},
  { key: 'folder.town.name', label: 'LOCALIDAD', sortable: true},
  { key: 'folder.town.municipality.name', label: 'MUNICIPIO', sortable: true},
  { key: 'folder.route.name', label: 'RUTA'},
  { key: 'group.name', label: 'GRUPO'},
  { key: 'amount', label: 'PRESTAMO'},
  { key: 'paymentAmount', label: 'PAGO DE PRESTAMO'},
  { key: 'captureAt', label: 'FECHA DE CAPTURA', sortable: true},
  { key: 'creditAt', label: 'FECHA DEL CREDITO', sortable: true},
  { key: 'canRenovate', label: 'RENOVACIÓN'},
  { key: 'nextPayment', label: 'PROXIMO PAGO', sortable: true},
  { key: 'lastPayment', label: 'ULTIMO PAGO', sortable: true},
  { key: 'currentDebt', label: 'DEUDA ACTUAL', sortable: true},
  { key: 'status', label: 'ESTATUS', sortable: true},
  { key: 'actions', label: 'ACCIONES'},
]

const INITIAL_VISIBLE_COLUMNS = [
  'client.curp', 'folder.name','group.name','creditAt', 'status', 'canRenovate'
];

const statusRef: Record<Status, Color> = {
  ACTIVO: 'warning',
  VENCIDO: 'danger',
  LIQUIDADO: 'success',
  RENOVADO: 'primary',
  FALLECIDO: 'secondary'
}

export default function ViewCreditsPage () {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const param = useParams();

    const loader = useLoaderData<any>();
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS)); 

    const { 
      loadingState, 
      handlePagination, 
      handleRowPerPage, 
      handleSort,
      sortDescriptor
    } = useParamsPaginator({
      columnDefault: 'creditAt'
    });
    
    const { render } = useRenderCell({ isMoney: true }); 

    const renderCell = useCallback((credit: Credit, columnKey: Key) => {
    
      if(columnKey === 'canRenovate' && credit.canRenovate) {
        return <Button variant='ghost' color='primary' onPress={() => { navigate(`/clients/${param?.curp}/renovate/${credit.id}`) }}>Renovar</Button>
      }
      
      if(columnKey === 'client.curp') {
        return <span>{credit.client.curp?.toUpperCase()}</span>
      }
      
      if(columnKey === 'client.aval') {
        return <span>{credit.aval.curp?.toUpperCase()}</span>
      }
  
      if(columnKey === 'actions') {
        return <span className='capitalize'>ACCIONES</span>
      }
      
      if(columnKey === 'status') {
        const color = statusRef[credit.status] ?? 'secondary';
        return ( <Chip color={color} variant="bordered">{credit.status}</Chip>)
      }
  
      return <span className='capitalize'>{render(credit, columnKey)}</span>
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const headerColumns = useMemo(() => {
      if (typeof visibleColumns === 'string') return columns;
      if (visibleColumns.has('all')) return columns;
  
      return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
    }, [visibleColumns]);

    
  const topContent = useMemo(() => {
    return (<Select
      label="Columnas"
      placeholder="Seleccione una columna"
      selectionMode="multiple"
      variant="bordered"
      labelPlacement="outside"
      className="max-w-xs"
      disallowEmptySelection
      selectedKeys={visibleColumns}
      onSelectionChange={setVisibleColumns}
    >
      {columns.map((column) => (
        <SelectItem key={column.key}>
          {column.label}
        </SelectItem>
      ))}
    </Select>)
  }, [visibleColumns])

    const onClose = () => {
        navigate(`/clients?${params}`)
    }

    return (
    <Modal 
        isOpen={true}
        onClose={onClose}
        placement="top-center"
        className='red-dark text-foreground bg-content1'
        size='5xl'
        isDismissable={false}
    >
          <ModalContent>
            {(onClose) => (
              <>
                <Form method='post'>
                <ModalHeader className="flex flex-col gap-1">Créditos de {param.curp?.toUpperCase()}</ModalHeader>
                <ModalBody>
                  <TableDetail 
                      aria-label="agents table"
                      onSortChange={handleSort}
                      sortDescriptor={sortDescriptor}
                      headerColumns={headerColumns}
                      bottomContent={
                        <Pagination
                          pageCount={loader?.serverData?.pageCount}
                          currentPage={loader?.serverData?.currentPage}
                          onChange={handlePagination} 
                        />
                      }
                      topContent={
                        <div className="flex justify-between items-center">
                          {topContent}
                          <span className="text-default-400 text-small">
                            Total {loader?.serverData.total || 0} Creditos
                          </span>
                          <RowPerPage
                            onChange={handleRowPerPage} 
                            checkParams
                          />
                        </div>
                      } 
                      columns={columns} 
                      loadingState={loadingState} 
                      emptyContent="No se encontraron creditos" 
                      renderCell={renderCell} 
                      data={loader?.serverData.data ?? []}    
                  />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} type='button'>
                  Close
                </Button>
                <Button color="primary" type='submit'>
                  Crear nuevo crédito
                </Button>
              </ModalFooter>
              </Form>
            </>

          )}
        </ModalContent>
      </Modal>
    )
}