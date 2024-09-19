import { Selection } from '~/.server/interfaces';
import { DropdownGeneric } from './DropdownGeneric';

interface Props {
  onSelectionChange: (keys: Selection) => void
  selectedKeys?: Selection,
  defaultSelectedKeys?: Selection,
}

const values = [
  { key: 'ACTIVO', value: 'Activo' },
  { key: 'VENCIDO', value: 'Vencido' },
  { key: 'LIQUIDADO', value: 'Liquidado' },
  { key: 'RENOVADO', value: 'Renovado' },
  { key: 'FALLECIDO', value: 'Fallecido' },
]

export const DropdownCreditStatus = (props: Props) => {
  return (
    <DropdownGeneric 
      values={values}
      textButton='Estatus'
       ariaLabel='Multiple selection credit status'
      {...props}
    />
  )
}
