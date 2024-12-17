import { Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { ReactElement, useMemo } from "react"
import { FaUnlock, FaLock } from "react-icons/fa"


interface Props {
    folderId: number;
    isActive: boolean;
}

interface ButtonProps {
    color: 'success' | 'danger',
    icon: ReactElement
}

const FolderToggleActive = ({ folderId, isActive }: Props ) => {

    const { state, submit } = useFetcher({ key: `toggleFolder_${folderId}`});

    const buttonProps: ButtonProps = useMemo(() => {
        
        return isActive 
            ? { color: 'success', icon: <FaUnlock />}
            : { color: 'danger', icon:  <FaLock />};

    }, [isActive]);

    const handleClick = () => {
        submit({
            isActiveFolder: !isActive,
            _action: 'updateIsActive'
        }, {
            method: 'POST',
            action: `/folder/${folderId}`
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

export default FolderToggleActive