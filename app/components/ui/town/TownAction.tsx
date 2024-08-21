import { useFetcher } from "@remix-run/react";
import { Action } from "../municipality/Action";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { MunicipalityI } from "~/.server/domain/entity";
import { ActionPostMunicipality, HandlerSuccess } from "~/.server/reponses";

interface Props {
    idTown: number,
    onOpenEdit: () => void
}

export function TownAction({ idTown, onOpenEdit }: Props)  {
    const fetcherDelete = useFetcher<HandlerSuccess<ActionPostMunicipality>>();
    const fetcherGet = useFetcher<HandlerSuccess<MunicipalityI>>({ key: 'getMunicipality' });
    const isTheSame = Number(fetcherDelete?.data?.serverData.id) === idTown;
    const isLoading = fetcherDelete.state !== 'idle' 
        && isTheSame;

    const handleDelete = () => {
        fetcherDelete.submit({
            id: idTown, 
            _action: 'delete'
        }, {
          method: 'POST', 
          action:`/town/${idTown}`,
       })
    }

    const handleUpdate = () => {
        onOpenEdit();
        fetcherGet.load(`/town/${idTown}`);
    }

    useEffect(() => {
        if(fetcherDelete.data?.error && isTheSame && !isLoading ) {
            toast.error(fetcherDelete.data?.error);
        }
    }, [fetcherDelete.data, isLoading, isTheSame]);
    
    return (
        <Action 
            ariaLabel="towns"
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    )
}