import { Selection } from '~/.server/interfaces';
import { DropdownGeneric } from './DropdownGeneric';

interface Props {
  onSelectionChange: (keys: Selection) => void
  selectedKeys?: Selection,
  defaultSelectedKeys?: Selection,
}

const values = [
  { key: 'PAGO', value: 'Pago' },
  { key: 'PAGO_INCOMPLETO', value: 'Pago incompleto' },
  { key: 'NO_PAGO', value: 'No pago' },
  { key: 'ADELANTO', value: 'Adelanto' },
  { key: 'GARANTIA', value: 'Garantia' },
]

export const DropdownPaymentStatus = (props: Props) => {
  return (
    <DropdownGeneric 
      values={values}
      textButton='Buscar por estatus'
       ariaLabel='Multiple selection payment status'
      {...props}
    />
  )
}
