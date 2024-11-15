import { Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useLoaderData, useOutletContext, useRouteError } from "@remix-run/react";
import { useState, useMemo, useCallback } from "react";
import { Payment } from "~/.server/domain/entity";
import { Key, SortDirection, Selection, Generic } from "~/.server/interfaces";
import { HandlerSuccess } from "~/.server/reponses";
import { useParamsPaginator, useRenderCell } from "~/application";
import { PaymentAction, ChipStatusCredit, ChipStatusPayment, ModalPaymentEdit, TableDetail, Pagination, RowPerPage, SelectFolder } from "~/components/ui";
import { ModalPay } from "~/components/ui/pay";
import { SelectGroup } from '../../../../components/ui/payment/SelectGroup';
import { paymentClientLoader } from "~/application/payment/payment.client.loader";
import { ErrorCard } from "~/components/utils/ErrorCard";

export {
  paymentClientLoader as loader
}


interface Loader {
    data: Payment[],
    P: number,
    l: number,
    c: string,
    d: SortDirection,
    s: {column: string, value: string}[] ,
    start: string,
    end: string,
    isActive: string,
    curp: string,
    folder: string,
    client: string,
    aval: string,
    agent: string,
    municipality: string,
    town: string,
    group: string,
    captureStart: string,
    captureEnd: string,
    debt: { start: number, end: number },
    total: number,
    status: string[],
    paymentAmount: { start: number, end: number },
    paymentStart: string,
    paymentEnd: string,
    pageCount: number,
    currentPage: number,
    nextPage: number | null,
  }

  const columns = [
    { key: 'credit.client.fullname', label: 'CLIENTE',  sortable: true },
    { key: 'credit.aval.fullname', label: 'AVAL',  sortable: true},
    { key: 'credit.client.curp', label: 'CLIENTE CURP', sortable: true},
    { key: 'credit.folder.name', label: 'CARPETA', sortable: true},
    { key: 'credit.folder.town.name', label: 'LOCALIDAD', sortable: true},
    { key: 'credit.folder.town.municipality.name', label: 'MUNICIPIO', sortable: true},
    { key: 'credit.folder.route.name', label: 'RUTA'},
    { key: 'credit.group.name', label: 'GRUPO'},
    { key: 'paymentAmount', label: 'PAGO'},
    { key: 'captureAt', label: 'FECHA DE CAPTURA', sortable: true},
    { key: 'paymentDate', label: 'FECHA DEL PAGO', sortable: true},
    { key: 'credit.nextPayment', label: 'PROXIMO PAGO', sortable: true},
    { key: 'credit.lastPayment', label: 'ULTIMO PAGO', sortable: true},
    { key: 'credit.currentDebt', label: 'DEUDA ACTUAL', sortable: true},
    { key: 'status', label: 'ESTATUS', sortable: true},
    { key: 'credit.status', label: 'ESTATUS CRÉDITO'},
    { key: 'folio', label: 'FOLIO', sortable: true},
    { key: 'notes', label: 'NOTAS' },
    { key: 'agent.fullName', label: 'AGENTE' },
    { key: 'actions', label: 'ACCIONES'},
  ]

  const INITIAL_VISIBLE_COLUMNS = [
    'credit.client.fullname', 'credit.folder.name','credit.group.name', 'paymentAmount', 'folio', 'actions'
  ]

interface OutletContextProps {
  client: number,
  folder: number,
  group: number,
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (<ErrorCard 
      error={(error as Generic)?.data ?? 'Ocurrio un error inesperado'}
      description='Ocurrio un error al momento de traer los datos, favor de verificar la ruta'
  />)
}

export default function ClientPaymentsPage() {

  const loader = useLoaderData<HandlerSuccess<Loader>>();
  const { client, folder, group } = useOutletContext<OutletContextProps>();
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const { isOpen: isOpenCreate, onOpenChange: onOpenChangeCreate, onOpen: onOpenCreate } = useDisclosure();

  const { 
    loadingState, 
    handlePagination, 
    handleRowPerPage, 
    handleSort,
    sortDescriptor
  } = useParamsPaginator({ columnDefault: 'captureAt' });

  const { render } = useRenderCell({ isMoney: true }); 

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === 'string') return columns;
    if (visibleColumns.has('all')) return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.key));
  }, [visibleColumns]);

  const renderCell = useCallback((payment: Payment, columnKey: Key) => {
    
    if(columnKey === 'actions') {
      return <PaymentAction 
        paymentId={payment.id} 
        onOpenEdit={onOpen}
        onOpenCreate={onOpenCreate}
        currentDebt={payment.credit.currentDebt}
        creditId={payment.credit.id}
      />
    }

    if(columnKey === 'credit.status') {
      return ( <ChipStatusCredit status={payment.credit.status} /> )
    }
    
    if(columnKey === 'status') {
      return ( <ChipStatusPayment status={payment.status} /> )
    }

    return <span className='capitalize'>{render(payment, columnKey)}</span>

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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
  }, [visibleColumns]);
  
    return (<>
      <SelectFolder  clientId={client} folderId={folder} />
      <SelectGroup clientId={client} folderId={folder} groupId={group}/>
      <ModalPaymentEdit isOpen={isOpen} onOpenChange={onOpenChange}/>
      <ModalPay isOpen={isOpenCreate} onOpenChange={onOpenChangeCreate} />
      <TableDetail 
        aria-label="payments table"
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
              Total {loader?.serverData.total || 0} Pagos
            </span>
            <RowPerPage
              onChange={handleRowPerPage} 
              checkParams
            />
          </div>
        } 
        columns={columns} 
        loadingState={loadingState} 
        emptyContent="No se encontraron pagos" 
        renderCell={renderCell} 
        data={loader?.serverData.data ?? []}    
    />
    </>)
}