import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react"
import { Key, useCallback } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { useActionPermission } from '../../../application/hook/useActionPermission';

interface Props {
    ariaLabel: string,
    isLoading?: boolean,
    onView?: () => void,
    onUpdate?: () => void,
    onDelete?: () => void,
    permissionUpdate?: string,
    permissionView?: string,
    permissionDelete?: string
}


export function Action ({ 
    ariaLabel, 
    onView, 
    onUpdate, 
    onDelete, 
    isLoading,
    permissionView,
    permissionUpdate,
    permissionDelete 
}: Props) {
    
    const { 
        hasViewPermission,
        hasDeletePermission,
        hasUpdatePermission
     } = useActionPermission({ 
        view: permissionView, 
        update: permissionUpdate, 
        destroy: permissionDelete 
    });

    const canView = !!onView;
    const canUpdate = !!onUpdate;
    const canDelete = !!onDelete;

    const items = [
        {
            key: 'view',
            startContent: <FaEye />,
            label: 'Ver',
            permission: permissionView
        },
        {
            key: 'update',
            startContent: <FaEdit />,
            label: 'Editar',
            permission: permissionUpdate
        },
        {
            key: 'delete',
            startContent: <FaTrashAlt />,
            label: 'Eliminar',
            permission: permissionView
        }
    ]

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

        if(canView && hasViewPermission) elements.push(items[0]);
        if(canUpdate && hasUpdatePermission) elements.push(items[1]);
        if(canDelete && hasDeletePermission) elements.push(items[2]);

        return (
            <DropdownMenu
                aria-label={`Action event ${ariaLabel}`}
                onAction={handleAction}
                emptyContent='No elementos'
                items={elements}
            >
                {(item) => (
                    <DropdownItem
                        key={item.key}
                        className={item.key === "delete" ? "text-danger" : ""}
                        color={item.key === "delete" ? "danger" : "default"}
                        startContent={item.startContent}
                    >
                        {item.label}
                    </DropdownItem>
                )}
            </DropdownMenu>
        )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canView, canUpdate, canDelete, ariaLabel]);


    return (
        <div className="relative flex justify-center items-center gap-2">
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