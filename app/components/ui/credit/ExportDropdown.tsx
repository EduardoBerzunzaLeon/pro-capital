import { Button, Dropdown, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react"
import { AiFillLayout } from "react-icons/ai";
import { FaChartBar, FaFileExcel } from "react-icons/fa"
import { ModalExportLayout } from "./ModalExportLayout";
import { Key } from "~/.server/interfaces";
import { ModalExportStatistics } from './ModalExportStatistics';
import { permissions } from '~/application';
import { DropdownItemPermission } from "../auth/DropDownItemPermission";

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
                { 
                    DropdownItemPermission({
                        permission: permissions.credits.permissions.layout,
                        key: 'layout',
                        label: 'Plantilla',
                        startContent: <AiFillLayout />
                    }) 
                }
                { 
                    DropdownItemPermission({
                        permission: permissions.credits.permissions.statistics,
                        key: 'statistics',
                        label: 'Estadisticas',
                        startContent: <FaChartBar />
                    }) 
                }
            </DropdownMenu>
        </Dropdown>
        <ModalExportLayout isOpen={isOpen} onOpenChange={onOpenChange} />
        <ModalExportStatistics isOpen={isOpenStatistics} onOpenChange={onOpenChangeStatistics}/>
    </>)
}
