import { Action } from "../Action/Action";
import { useFetcherAction, permissions } from '~/application';

interface Props {
    idTown: number,
    onOpenEdit: () => void
}

export function TownAction({ idTown, onOpenEdit }: Props)  {
    const { handleUpdate, handleDelete, isDeleting } = useFetcherAction({ 
        key: 'getTown', 
        route:'town', 
        id: idTown
     });
        
    const handleUpdateWithModal = () => {
        onOpenEdit();
        handleUpdate();
    }
    
    return (
        <Action 
            ariaLabel="towns"
            onUpdate={handleUpdateWithModal}
            onDelete={handleDelete}
            isLoading={isDeleting}
            permissionUpdate={permissions.town.permissions.update}
            permissionDelete={permissions.town.permissions.delete}
        />
    )
}