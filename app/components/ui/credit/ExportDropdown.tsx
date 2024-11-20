import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react"
import { AiFillLayout } from "react-icons/ai";
import { FaChartBar, FaFileExcel } from "react-icons/fa"
import { ModalExportLayout } from "./ModalExportLayout";
import { Key } from "~/.server/interfaces";
import { ModalExportStatistics } from './ModalExportStatistics';

export const ExportDropdown = () => {

    const { isOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenStatistics, onOpenChange: onOpenChangeStatistics } = useDisclosure();

    const handleAction = (key: Key) => {
        if(key === 'layout') {
            onOpenChange();
        }

        if(key === 'statistics') {
            onOpenChangeStatistics();
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
                    key="statistics"
                    startContent={<FaChartBar />}
                >Estadisticas</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <ModalExportLayout isOpen={isOpen} onOpenChange={onOpenChange} />
        <ModalExportStatistics isOpen={isOpenStatistics} onOpenChange={onOpenChangeStatistics}/>
    </>)
}
