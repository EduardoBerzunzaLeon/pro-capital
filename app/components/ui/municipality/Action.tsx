import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react"
import { Key, useCallback } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";

interface Props {
    ariaLabel: string,
    isLoading?: boolean,
    onView?: () => void,
    onUpdate?: () => void,
    onDelete?: () => void,
    
}

const dropdowns = {
    'view': <DropdownItem key='view' startContent={<FaEye />} >Ver</DropdownItem>,
    'update': <DropdownItem key='update' startContent={<FaEdit />} >Editar</DropdownItem>,
    'delete': <DropdownItem key='delete' className="text-danger" color="danger" startContent={<FaTrashAlt/>}>Eliminar</DropdownItem>,
}

export function Action ({ ariaLabel, onView, onUpdate, onDelete, isLoading }: Props) {

    const canView = onView !== undefined;
    const canUpdate = onUpdate !== undefined;
    const canDelete = onDelete !== undefined;

    const handleAction = (key: Key) => {

        if(key === 'view' && canView) {
            return onView();
        }
        
        if(key === 'update' && canUpdate) {
            return onUpdate();
        }
        
        if(key === 'delete' && canDelete) {
            return onDelete();
        }
    }

    const printDropdownMenus = useCallback(() => {
        const elements = [];

        if(canView) elements.push(dropdowns.view);
        if(canUpdate) elements.push(dropdowns.update);
        if(canDelete) elements.push(dropdowns.delete);

        return (
            <DropdownMenu
                aria-label={`Action event ${ariaLabel}`}
                onAction={handleAction}
                emptyContent='No elementos'
            >
                { elements.map((element) => element) }
            </DropdownMenu>
        )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canView, canUpdate, canDelete, ariaLabel]);


    return (
        <div className="relative flex justify-end items-center gap-2">
            {
                isLoading ? (
                    <Spinner color="default"/>
                ) : (
                    <Dropdown className='red-dark text-foreground bg-content1'>
                        <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                                <BsThreeDotsVertical/>
                            </Button>
                        </DropdownTrigger>
                        {  printDropdownMenus() }   
                    </Dropdown>
                )
            }
            

        </div>
    )
}