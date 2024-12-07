import { ButtonGroup, Tooltip, Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import { permissions, useFetcherAction } from "~/application";
import { ButtonAddPayment } from "./ButtonAddPayment";
import { ButtonAddNoPayment } from "./ButtonAddNoPayment";
import { Permission } from "../auth/Permission";

interface Props {
    idCredit: number
    onOpen: () => void,   
    onOpenNoPay: () => void,   
}

export const PayAction = ({ idCredit, onOpen, onOpenNoPay }: Props) => {

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
        <Permission permission={permissions.pays.permissions.add}>
            <ButtonAddPayment 
                creditId={idCredit}
                onPress={onOpen}
                isDisabled={isDeleting}
            />
        </Permission>
        <Permission permission={permissions.pays.permissions.add_no_payment}>
            <ButtonAddNoPayment 
                creditId={idCredit}
                onPress={onOpenNoPay}
                isDisabled={isDeleting}
            />
        </Permission>
        <Permission permission={permissions.credits.permissions.view_detail}>
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
        </Permission>
        <Permission permission={permissions.pays.permissions.delete}>
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
        </Permission>
    </ButtonGroup>
  )
}
