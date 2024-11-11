import { Button, Select, SelectItem,  useDisclosure } from "@nextui-org/react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import { Credit } from "~/.server/domain/entity"
import { SortDirection, Selection, Key } from "~/.server/interfaces"
import { HandlerSuccess } from "~/.server/reponses";
import { useParamsPaginator, useRenderCell } from "~/application";
import { payLoader } from "~/application/pay/pay.loader"
import { ChipStatusCredit, InputFilter, Pagination, RowPerPage, TableDetail } from "~/components/ui";
import { ModalPay } from "~/components/ui/pay";
import { PayAction } from "~/components/ui/pay/PayAction";

interface Loader {
    data: Credit[],
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
    client: string,
    pageCount: number,
    total: number,
    currentPage: number,
    nextPage: number | null,
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
    { key: 'countPayments', label: 'TOTAL DE PAGOS' },
    { key: 'currentDebt', label: 'DEUDA ACTUAL', sortable: true},
    { key: 'status', label: 'ESTATUS', sortable: true},
    { key: 'actions', label: 'ACCIONES'},
  ]

const INITIAL_VISIBLE_COLUMNS = [
    'client.fullname', 'folder.name', 'group.name', 
    'countPayments', 'paymentAmount', 'currentDebt',
    'creditAt', 'nextPayment',  'actions', 
];

export {
    payLoader as loader,
}

export default function PayPage() {
    const loader = useLoaderData<HandlerSuccess<Loader>>();
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS)); 
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const navigate = useNavigate();

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
    
    const renderCell = useCallback((credit: Credit, columnKey: Key) => {
    
        if(columnKey === 'canRenovate') {
          return <span className='capitalize'>{credit.canRenovate}</span>
        }

        if(columnKey === 'countPayments') {
          return <span className='capitalize'>{credit.countPayments}</span>
        }

            
        if(columnKey === 'canRenovate' && credit.canRenovate) {
          return <Button variant='ghost' color='primary' onPress={() => { navigate(`/clients/${credit.client.curp}/renovate/${credit.id}`) }}>Renovar</Button>
        }

        if(columnKey === 'actions') {
            return (
                <PayAction 
                    idCredit={credit.id}
                    onOpen={onOpen}
                />
            )
        }
        
        if(columnKey === 'status') {
            return ( <ChipStatusCredit status={credit.status} /> )
        }

        return <span className='capitalize'>{render(credit, columnKey)}</span>

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
    }, [visibleColumns])

    return (<>
    <ModalPay isOpen={isOpen} onOpenChange={onOpenChange} />
    <div className='w-full flex gap-2 mt-5 mb-3 flex-wrap justify-between items-center'>
        <InputFilter 
            param="folder" 
            name="folder" 
            label="Carpeta" 
            id="folder" 
            className='w-full md:max-w-[49%]'
            placeholder="Nombre de la carpeta"      
            defaultValue={loader?.serverData?.folder?.name}
        />
      <InputFilter 
        param="client" 
        name="clientFullname" 
        label="Cliente" 
        id="clientFullname"
        className='w-full md:max-w-[49%]' 
        placeholder="Nombre del cliente"      
        defaultValue={loader?.serverData?.client}
      />
    </div>
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
        emptyContent="No se encontraron creditos para realizar pagos" 
        renderCell={renderCell} 
        data={loader?.serverData.data ?? []}    
    />
    </>)

}