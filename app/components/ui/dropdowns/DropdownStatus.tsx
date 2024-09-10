import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { Key } from '../folder/FolderSection';


type Selection = 'all' | Set<Key>;

interface Props {
  onSelectionChange: (keys: Selection) => void
  selectedKeys?: Selection,
  defaultSelectedKeys?: Selection,
}

export const DropdownStatus = ({ selectedKeys, onSelectionChange, defaultSelectedKeys }: Props) => {
  return (
    <Dropdown >
        <DropdownTrigger>
        <Button 
            variant="bordered" 
            className="capitalize mt-5 mb-3"
        >
            Buscar por estatus
        </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Multiple selection status"
          variant="flat"
          closeOnSelect={false}
          disallowEmptySelection
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
          defaultSelectedKeys={defaultSelectedKeys}
        >
        <DropdownItem key="active">Activo</DropdownItem>
        <DropdownItem key="inactive">Inactivo</DropdownItem>
        </DropdownMenu>
    </Dropdown>
  )
}
