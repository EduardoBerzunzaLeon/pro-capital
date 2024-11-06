import { ButtonGroup, Tooltip, Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { useFetcherAction } from "~/application";

interface Props {
    idCredit: number
    onOpen: () => void,   
}


export const PayAction = ({ idCredit, onOpen }: Props) => {

    const { handleUpdate, handleDelete, isDeleting } = useFetcherAction({ 
        key: 'getSinglePayment', 
        route:'pay', 
        id: idCredit,
        deleteAction: 'deleteFast'
     });

     const navigate = useNavigate();

    const handleUpdateWithModal = () => {
        onOpen();
        handleUpdate()
    }

    const handleView = () => {
        navigate(`/clients/${idCredit}`);
    }

  return (
    <ButtonGroup className='flex justify-center items-center'>
        <Tooltip showArrow={true} content="Agregar Nuevo Pago">
            <Button 
                size='sm' 
                color='success' 
                variant='ghost'
                startContent={<FaMoneyBill1Wave />}
                isDisabled={isDeleting}
                onPress={handleUpdateWithModal}
            >Pagar</Button>
        </Tooltip>
        <Tooltip showArrow={true} content="Ver Crédito">
            <Button 
                size='sm' 
                color='success' 
                isIconOnly
                variant='ghost'
                onPress={handleView}
                isDisabled={isDeleting}
                ><FaEye />
            </Button>
        </Tooltip>
        <Tooltip showArrow={true} content="Eliminar el pago de hoy">
            <Button 
                size='sm' 
                color='danger' 
                variant='light'
                isIconOnly
                isDisabled={isDeleting}
                isLoading={isDeleting}
                onPress={handleDelete}
            >
                <FaTrashAlt/>
            </Button>
        </Tooltip>
    </ButtonGroup>
  )
}
