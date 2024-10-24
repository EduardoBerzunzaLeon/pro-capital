import { Chip } from "@nextui-org/react"
import { useMemo } from "react"
import { Status } from "~/.server/domain/entity/credit.entity"
import { Color } from "~/.server/interfaces"


const statusRef: Record<Status, Color> = {
    ACTIVO: 'warning',
    VENCIDO: 'danger',
    LIQUIDADO: 'success',
    RENOVADO: 'primary',
    FALLECIDO: 'secondary'
  }

interface Props {
    status: string
}

export const ChipStatusCredit = ({ status }: Props) => {

    const color = useMemo(() => {
        return status in statusRef 
            ? statusRef[status as Status]
            : 'secondary';
    }, [ status ])

  return (
    <Chip color={color} variant="bordered">{status.toUpperCase()}</Chip>
  )
}