import { ButtonGroup, Tooltip, Button } from "@nextui-org/react";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { useFetcherAction } from "~/application";

interface Props {
    idCredit: number
    onOpen: () => void,   
}


export const PayAction = ({ idCredit, onOpen }: Props) => {

    const { handleUpdate } = useFetcherAction({ 
        key: 'getSinglePayment', 
        route:'pay', 
        id: idCredit
     });

    const handleUpdateWithModal = () => {
        onOpen();
        handleUpdate()
    }

  return (
    <ButtonGroup className='flex justify-center items-center'>
        <Tooltip showArrow={true} content="Agregar Nuevo Pago">
            <Button 
                size='sm' 
                color='success' 
                variant='ghost'
                startContent={<FaMoneyBill1Wave />}
                onPress={handleUpdateWithModal}
            >Pagar</Button>
        </Tooltip>
        <Tooltip showArrow={true} content="Ver Crédito">
            <Button 
                size='sm' 
                color='success' 
                isIconOnly
                variant='ghost'
                ><FaEye />
            </Button>
        </Tooltip>
        <Tooltip showArrow={true} content="Eliminar Pago">
            <Button 
                size='sm' 
                color='danger' 
                variant='light'
                isIconOnly
            ><FaTrashAlt/></Button>
        </Tooltip>
    </ButtonGroup>
  )
}
