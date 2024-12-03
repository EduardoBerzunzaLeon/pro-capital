import { Button, Tooltip } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { FaMoneyBillTransfer } from 'react-icons/fa6';


interface Props {
    creditId: number,
    onPress: () => void,
    isDisabled?: boolean,
}

export const ButtonAddNoPayment = ({ creditId, onPress, isDisabled }: Props) => {

  const { load } = useFetcher({ key: 'getSinglePayment' });
  
    const handlePress = () => {
        load(`/pay/${creditId}`)
        onPress()
    }

  return (
    <Tooltip showArrow={true} content="Agregar Nuevo NO Pago">
        <Button 
            size='sm' 
            color='warning' 
            variant='ghost'
            isDisabled={isDisabled}
            onPress={handlePress}
            isIconOnly
        >
            <FaMoneyBillTransfer />
        </Button>
    </Tooltip>
  )
}
