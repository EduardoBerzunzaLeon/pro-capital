import { Button, Tooltip } from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { FaMoneyBill1Wave } from "react-icons/fa6";


interface Props {
    creditId: number,
    onPress: () => void,
    isDisabled?: boolean,
}

export const ButtonAddPayment = ({ creditId, onPress, isDisabled }: Props) => {

  const { load } = useFetcher({ key: 'getSinglePayment' });
  
    const handlePress = () => {
        load(`/pay/${creditId}`)
        onPress()
    }

  return (
    <Tooltip showArrow={true} content="Agregar Nuevo Pago">
        <Button 
            size='sm' 
            color='success' 
            variant='ghost'
            startContent={<FaMoneyBill1Wave />}
            isDisabled={isDisabled}
            onPress={handlePress}
        >Pagar</Button>
    </Tooltip>
  )
}
