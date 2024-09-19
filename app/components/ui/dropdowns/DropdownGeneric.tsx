import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react"
import { Selection } from '~/.server/interfaces';

interface Props {
    textButton: string,
    values: {
        key: string,
        value: string
    }[],
    onSelectionChange: (keys: Selection) => void
    selectedKeys?: Selection,
    defaultSelectedKeys?: Selection,
    ariaLabel?: string,
}

export const DropdownGeneric = ({
    values,
    textButton,
    ariaLabel,
    selectedKeys, 
    onSelectionChange, 
    defaultSelectedKeys,
}: Props) => {
    return (
        <Dropdown >
            <DropdownTrigger>
            <Button 
                variant="bordered" 
                className="capitalize mt-5 mb-3"
            >
                {textButton}
            </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label={ariaLabel ?? 'Multiple selection status'}
              variant="flat"
              closeOnSelect={false}
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={onSelectionChange}
              defaultSelectedKeys={defaultSelectedKeys}
            >
                { 
                    values.map(({key, value}) => (
                        <DropdownItem key={key}>{value}</DropdownItem>
                    ))
                }
            </DropdownMenu>
        </Dropdown>
    )
}