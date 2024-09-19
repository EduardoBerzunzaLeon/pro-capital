import { Selection } from '~/.server/interfaces';
import { DropdownGeneric } from './DropdownGeneric';

interface Props {
  onSelectionChange: (keys: Selection) => void
  selectedKeys?: Selection,
  defaultSelectedKeys?: Selection,
}

const values = [
  { key: 'renovate', value: 'Con derecho' },
  { key: 'noRenovate', value: 'Sin derecho' }
]

export const DropdownCanRenovate = (props: Props) => {
  return (
    <DropdownGeneric 
      values={values}
      textButton='Renovación'
      ariaLabel='Multiple selection renovate status'
      {...props}
    />
  )
}
