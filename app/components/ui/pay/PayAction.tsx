import { ButtonGroup, Tooltip, Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { useFetcherAction } from "~/application";
import { ButtonAddPayment } from "./ButtonAddPayment";

interface Props {
    idCredit: number
    onOpen: () => void,   
}


export const PayAction = ({ idCredit, onOpen }: Props) => {

    const { handleDelete, isDeleting } = useFetcherAction({ 
        key: 'getSinglePayment', 
        route:'pay', 
        id: idCredit,
        deleteAction: 'deleteFast'
     });

     const navigate = useNavigate();

    const handleView = () => {
        navigate(`/clients/${idCredit}`);
    }

  return (
    <ButtonGroup className='flex justify-center items-center' isDisabled={isDeleting}>
        <ButtonAddPayment 
            creditId={idCredit}
            onPress={onOpen}
            isDisabled={isDeleting}
        />
        <Tooltip showArrow={true} content="Ver Crédito">
            <Button 
                size='sm' 
                color='success' 
                isIconOnly
                variant='ghost'
                onPress={handleView}
                ><FaEye />
            </Button>
        </Tooltip>
        <Tooltip showArrow={true} content="Eliminar el pago de hoy">
            <Button 
                size='sm' 
                color='danger' 
                variant='light'
                isIconOnly
                isLoading={isDeleting}
                onPress={handleDelete}
            >
                <FaTrashAlt/>
            </Button>
        </Tooltip>
    </ButtonGroup>
  )
}
