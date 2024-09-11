import { Action } from "../Action/Action";
import { useFetcherAction } from "~/application";

interface Props {
    leaderId: number,
    onOpenEdit: () => void
}

export function LeaderAction({ leaderId, onOpenEdit }: Props)  {

    const { handleDelete, isDeleting, handleUpdate } = useFetcherAction({ 
        key: 'getLeader', 
        route: 'leaders', 
        id: leaderId
     });

     const handleUpdateWithModal = () => {
        onOpenEdit();
        handleUpdate();
    }
       
    return (
        <Action 
            ariaLabel="leaders action"
            onUpdate={handleUpdateWithModal}
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}