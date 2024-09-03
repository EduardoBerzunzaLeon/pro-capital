import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { Key } from '../folder/FolderSection';


type Selection = 'all' | Set<Key>;

interface Props {
    selectedKeys: Selection,
    onSelectionChange: (keys: Selection) => void
}

export const DropdownStatus = ({ selectedKeys, onSelectionChange }: Props) => {
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
        aria-label="Multiple selection status routes"
        variant="flat"
        closeOnSelect={false}
        disallowEmptySelection
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        >
        <DropdownItem key="active">Activo</DropdownItem>
        <DropdownItem key="inactive">Inactivo</DropdownItem>
        </DropdownMenu>
    </Dropdown>
  )
}
