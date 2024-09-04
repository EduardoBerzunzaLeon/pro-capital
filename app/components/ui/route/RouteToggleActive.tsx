import { Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { ReactElement, useMemo } from "react"
import { FaUnlock, FaLock } from "react-icons/fa"


interface Props {
    routeId: number;
    isActive: boolean;
}

interface ButtonProps {
    color: 'success' | 'danger',
    icon: ReactElement
}

const RouteToggleActive = ({ routeId, isActive }: Props ) => {

    const { state, submit } = useFetcher({ key: `updateRoute_${routeId}`});

    const buttonProps: ButtonProps = useMemo(() => {
        
        return isActive 
            ? { color: 'success', icon: <FaUnlock />}
            : { color: 'danger', icon:  <FaLock />};

    }, [isActive]);

    const handleClick = () => {
        submit({
            isActiveRoute: !isActive,
            _action: 'update'
        }, {
            method: 'POST',
            action: `/routePage/${routeId}`
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

export default RouteToggleActive