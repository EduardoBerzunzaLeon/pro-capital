import { Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { ReactElement, useMemo } from "react"
import { FaUnlock, FaLock } from "react-icons/fa"


interface Props {
    userId: number;
    isActive: boolean;
}

interface ButtonProps {
    color: 'success' | 'danger',
    icon: ReactElement
}

export const UserToggleActive = ({ userId, isActive }: Props ) => {

    const { state, submit } = useFetcher({ key: `updateUser_${userId}`});

    const buttonProps: ButtonProps = useMemo(() => {
        
        return isActive 
            ? { color: 'success', icon: <FaUnlock />}
            : { color: 'danger', icon:  <FaLock />};

    }, [isActive]);

    const handleClick = () => {
        submit({
            isActive: !isActive,
            _action: 'updateIsActive'
        }, {
            method: 'POST',
            action: `/users/${userId}`
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