import { useCallback, useMemo, useState } from "react";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination } from "@nextui-org/react"
import { PaymentI, Key, Color, PaymentStatus } from "~/.server/interfaces";
import { useRenderCell } from "~/application";
import dayjs from 'dayjs';
import { RowPerPage } from "../rowPerPage/RowPerPage";

interface Props {
    payments: PaymentI[]
}

const columns = [
    {
      key: "paymentAmount",
      label: "IMPORTE SEMANAL",
    },
    {
      key: "paymentDate",
      label: "FECHA DE PAGO",
    },
    {
      key: "folio",
      label: "FOLIO",
    },
    {
      key: "status",
      label: "ESTATUS",
    },
];

const statusRef: Record<PaymentStatus, Color> = {
    PAGO: 'success',
    PAGO_INCOMPLETO: 'warning',
    NO_PAGO: 'danger',
    ADELANTO: 'primary',
    GARANTIA: 'secondary',
}


export const CreditPaymentsTable = ({ payments }: Props) => {

    const { render } = useRenderCell({ isMoney: true }); 

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
    const pages = Math.ceil(payments.length / rowsPerPage);
  
    const items = useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
  
      return payments.slice(start, end);
    }, [page, payments, rowsPerPage]);

    const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    }, []);



    const renderCell = useCallback((payment: PaymentI, columnKey: Key) => {
             
    if(columnKey === 'status') {
        const color = statusRef[payment.status] ?? 'secondary';
        return ( <Chip color={color} variant="bordered">{payment.status}</Chip>)
    }

    if(columnKey === 'paymentDate') {
        return <span>{dayjs(payment.paymentDate).add(1,'day').format('YYYY-MM-DD')}</span>
    }

    return <span className='capitalize'>{render(payment, columnKey)}</span>

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <Table 
        aria-label="Example table with dynamic content"
        topContent={<RowPerPage onChange={onRowsPerPageChange}/>}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
    >
    <TableHeader columns={columns}>
      {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
    </TableHeader>
    <TableBody items={items}>
      {(item) => (
        <TableRow key={item.id}>
          {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
  )
}
