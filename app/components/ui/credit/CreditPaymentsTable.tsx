import { useCallback } from "react";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@nextui-org/react"
import { PaymentI, Key, Color, PaymentStatus } from "~/.server/interfaces";
import { useRenderCell } from "~/application";
import dayjs from 'dayjs';

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
    LIQUIDO: 'success',
    GARANTIA: 'secondary',
}


export const CreditPaymentsTable = ({ payments }: Props) => {

    const { render } = useRenderCell({ isMoney: true }); 

    const renderCell = useCallback((payment: PaymentI, columnKey: Key) => {
             
    if(columnKey === 'status') {
        const color = statusRef[payment.status] ?? 'secondary';
        return ( <Chip color={color} variant="bordered">{payment.status}</Chip>)
    }

    if(columnKey === 'paymentDate') {
        return <span>{dayjs(payment.paymentDate).format('YYYY-MM-DD')}</span>
    }

    return <span className='capitalize'>{render(payment, columnKey)}</span>

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <Table 
        aria-label="Example table with dynamic content"
    >
    <TableHeader columns={columns}>
      {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
    </TableHeader>
    <TableBody items={payments}>
      {(item) => (
        <TableRow key={item.id}>
          {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
        </TableRow>
      )}
    </TableBody>
  </Table>
  )
}
