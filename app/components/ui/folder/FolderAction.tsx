import { Action } from "../Action/Action";
import { useFetcherAction, permissions } from '~/application';

interface Props {
    idFolder: number,
    onOpenEdit: () => void
}

export function FolderAction({ idFolder, onOpenEdit }: Props)  {

    const { handleUpdate, handleDelete, isDeleting } = useFetcherAction({ 
        key: 'getFolder', 
        route:'folder', 
        id: idFolder
     });
        
    const handleUpdateWithModal = () => {
        onOpenEdit();
        handleUpdate();
    }
    
    return (
        <Action 
            ariaLabel="folders action"
            onUpdate={handleUpdateWithModal}
            onDelete={handleDelete}
            isLoading={isDeleting}
            permissionUpdate={permissions.folder.permissions.update}
            permissionDelete={permissions.folder.permissions.delete}
        />
    )
}