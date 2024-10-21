import { useFetcherAction } from "~/application";
import { Action } from "../Action/Action";

interface Props {
    creditId: number,
}

export function CreditAction({ creditId }: Props)  {

    const { handleDelete, isDeleting } = useFetcherAction({ 
        key: 'getCredit', 
        route: 'clients', 
        id: creditId
     });

     const handleView = () => {
        // handleUpdate();
        console.log('view')
    }
       
    return (
        <Action 
            ariaLabel="credit actions"
            onView={handleView}
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}