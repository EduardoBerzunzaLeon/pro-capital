import { useFetcherAction } from "~/application";
import { Action } from "../Action/Action";

interface Props {
    paymentId: number,
    onOpenEdit: () => void
}

export function PaymentAction({ paymentId, onOpenEdit }: Props)  {

    const { handleDelete, handleUpdate, isDeleting } = useFetcherAction({ 
        key: 'getPayment', 
        route: 'payments', 
        id: paymentId
     });

     const handleUpdateWithModal = () => {
        onOpenEdit();
        handleUpdate();
    }
       
    return (
        <Action 
            ariaLabel="payments action"
            onUpdate={handleUpdateWithModal}
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}