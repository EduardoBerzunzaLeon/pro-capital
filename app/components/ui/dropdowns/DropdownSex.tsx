import { Selection } from '~/.server/interfaces';
import { DropdownGeneric } from "./DropdownGeneric";

interface Props {
    onSelectionChange: (keys: Selection) => void
    selectedKeys?: Selection,
    defaultSelectedKeys?: Selection,
}
  
const status = [
    { key: 'masculino', value: 'Masculino' },
    { key: 'femenino', value: 'Femenino' }
]
  
export const DropdownSex = (props: Props) => {
    return (
      <DropdownGeneric 
        values={status}
        textButton='Buscar por Sexo'
        {...props}
      />
    )
  }
  