import { Action } from "../Action/Action";
import { useFetcherAction } from "~/application";

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
            ariaLabel="folders"
            onUpdate={handleUpdateWithModal}
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}