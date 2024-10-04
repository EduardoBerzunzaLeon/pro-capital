import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react"
import { AiFillLayout } from "react-icons/ai";
import { FaDatabase, FaFileExcel } from "react-icons/fa"
import { ModalExportLayout } from "./ModalExportLayout";
import { Key } from "~/.server/interfaces";

export const ExportDropdown = () => {

    const { isOpen, onOpenChange } = useDisclosure();

    const handleAction = (key: Key) => {
        if(key === 'layout') {
            onOpenChange();
        }
    }

    return (<>
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="bordered"
                    color='success'
                    endContent={<FaFileExcel />}
                >
                    Exportar
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Export excel event"
                onAction={handleAction}
            >
                <DropdownItem
                    key="layout"
                    startContent={<AiFillLayout />}
                >Plantilla</DropdownItem>
                <DropdownItem 
                    key="data"
                    startContent={<FaDatabase />}
                >Datos</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <ModalExportLayout isOpen={isOpen} onOpenChange={onOpenChange} />
    </>)
}
