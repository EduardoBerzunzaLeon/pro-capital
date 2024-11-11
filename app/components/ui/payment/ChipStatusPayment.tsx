import { Chip } from "@nextui-org/react"
import { useMemo } from "react"
import { Color, PaymentStatus } from "~/.server/interfaces"


const statusRef: Record<PaymentStatus, Color> = {
    PAGO: 'success',
    PAGO_INCOMPLETO: 'warning',
    NO_PAGO: 'danger',
    ADELANTO: 'primary',
    GARANTIA: 'secondary'
  }

interface Props {
    status: string
}

export const ChipStatusPayment = ({ status }: Props) => {

    const color = useMemo(() => {
        return status in statusRef 
            ? statusRef[status as PaymentStatus]
            : 'secondary';
    }, [ status ]);

  return (
    <Chip color={color} variant="bordered">{status.toUpperCase()}</Chip>
  )
}