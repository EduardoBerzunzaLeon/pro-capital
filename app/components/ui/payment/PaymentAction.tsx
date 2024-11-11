import { useFetcherAction } from "~/application";
import { Action } from "../Action/Action";
import { ButtonAddPayment } from "../pay/ButtonAddPayment";
import { useNavigate } from "@remix-run/react";

interface Props {
    paymentId: number,
    creditId: number,
    currentDebt: number,
    onOpenEdit: () => void,
    onOpenCreate: () => void
}

export function PaymentAction({ 
    paymentId, creditId, onOpenEdit, onOpenCreate, currentDebt 
}: Props)  {

    const navigate = useNavigate();
    const { handleDelete, handleUpdate, isDeleting } = useFetcherAction({ 
        key: 'getPayment', 
        route: 'payments', 
        id: paymentId
     });

     const handleUpdateWithModal = () => {
        onOpenEdit();
        handleUpdate();
    }

    const handleView = () => {
        navigate(`/clients/${creditId}`);
    }  

    return (
        // <ButtonGroup className='flex justify-center items-center' isDisabled={isDeleting}>
        <div className='flex gap-1'>
                {
                    (currentDebt > 0) && (
                        <ButtonAddPayment 
                            creditId={creditId}
                            onPress={onOpenCreate}
                        />
                    )
                }
                <Action 
                    ariaLabel="payments action"
                    onUpdate={handleUpdateWithModal}
                    onDelete={handleDelete}
                    onView={handleView}
                    isLoading={isDeleting}
                />
        </div>
        // </ButtonGroup>
    )
}