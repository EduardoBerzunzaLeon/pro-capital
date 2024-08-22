import { useFetcher } from "@remix-run/react";
import { Action } from "../municipality/Action";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { HandlerSuccess } from "~/.server/reponses";
import { Generic } from "~/.server/interfaces";

interface Props {
    idFolder: number,
    onOpenEdit: () => void
}

export function FolderAction({ idFolder, onOpenEdit }: Props)  {
    const fetcherDelete = useFetcher<HandlerSuccess<Generic>>();
    const fetcherGet = useFetcher({ key: 'getFolder' });
    const isTheSame = Number(fetcherDelete?.data?.serverData.id) === idFolder;
    const isLoading = fetcherDelete.state !== 'idle' 
        && isTheSame;

    const handleDelete = () => {
        fetcherDelete.submit({
            id: idFolder, 
            _action: 'delete'
        }, {
          method: 'POST', 
          action:`/folder/${idFolder}`,
       })
    }

    const handleUpdate = () => {
        onOpenEdit();
        fetcherGet.load(`/folder/${idFolder}`);
    }

    useEffect(() => {
        if(fetcherDelete.data?.error && isTheSame && !isLoading ) {
            toast.error(fetcherDelete.data?.error);
        }
    }, [fetcherDelete.data, isLoading, isTheSame]);
    
    return (
        <Action 
            ariaLabel="folders"
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    )
}