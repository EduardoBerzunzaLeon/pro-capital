
import { Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { ReactElement, useMemo } from "react"
import { FaUnlock, FaLock } from "react-icons/fa"


interface Props {
    roleId: number;
    permissionId: number;
    isAssigned: boolean;
}

interface ButtonProps {
    color: 'success' | 'danger',
    icon: ReactElement
}

export const PermissionToggleActive = ({ roleId, permissionId, isAssigned }: Props ) => {

    const { state, submit } = useFetcher({ key: `updatePermission_${permissionId}`});

    const buttonProps: ButtonProps = useMemo(() => {
        
        return isAssigned 
            ? { color: 'success', icon: <FaUnlock />}
            : { color: 'danger', icon:  <FaLock />};

    }, [isAssigned]);

    const handleClick = () => {
        submit({
            isAssigned: !isAssigned,
            _action: 'updateIsAssigned'
        }, {
            method: 'POST',
            action: `/security/${roleId}/permissions/${permissionId}`
        });
    }

  return (
    <Button 
        isIconOnly 
        color={buttonProps.color} 
        aria-label="toggle active" 
        size='sm'
        isLoading={state !== 'idle'}
        onPress={handleClick}
    >
        {buttonProps.icon}
    </Button>    
  )
}