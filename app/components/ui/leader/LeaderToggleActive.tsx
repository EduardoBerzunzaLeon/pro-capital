import { Button } from "@nextui-org/react"
import { useFetcher } from "@remix-run/react";
import { ReactElement, useMemo } from "react"
import { FaUnlock, FaLock } from "react-icons/fa"


interface Props {
    leaderId: number;
    isActive: boolean,
    handlePress: (id: number) => void
}

interface ButtonProps {
    color: 'success' | 'danger',
    icon: ReactElement,
}

export const LeaderToggleActive = ({ leaderId, isActive, handlePress }: Props ) => {

    const fetcher = useFetcher({ key: `getLeader-${leaderId}` });

    const buttonProps: ButtonProps = useMemo(() => {
        
        return isActive 
            ? { color: 'success', icon: <FaUnlock />}
            : { color: 'danger', icon:  <FaLock />};

    }, [isActive]);

    const handleClick = () => {
        handlePress(leaderId);
        fetcher.load(`/leaders/${leaderId}`)
    }

  return (
    <Button 
        isIconOnly 
        color={buttonProps.color} 
        aria-label="leader toggle active" 
        size='sm'
        onPress={handleClick}
        isLoading={fetcher.state !== 'idle'}
    >
        {buttonProps.icon}
    </Button>    
  )
}