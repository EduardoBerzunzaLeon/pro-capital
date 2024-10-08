import { Selection } from '~/.server/interfaces';
import { DropdownGeneric } from './DropdownGeneric';

interface Props {
  onSelectionChange: (keys: Selection) => void
  selectedKeys?: Selection,
  defaultSelectedKeys?: Selection,
}

const status = [
  { key: 'active', value: 'Activo' },
  { key: 'inactive', value: 'Inactivo' }
]

export const DropdownStatus = (props: Props) => {
  return (
    <DropdownGeneric 
      values={status}
      textButton='Buscar por Estatus'
      {...props}
    />
  )
}
