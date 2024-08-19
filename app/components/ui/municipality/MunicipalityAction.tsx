import { useFetcher } from "@remix-run/react";
import { Action } from "./Action";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { MunicipalityI } from "~/.server/domain/entity";
import { ActionPostMunicipality, HandlerSuccess } from "~/.server/reponses";

interface Props {
    idMunicipality: number,
    onOpenEdit: () => void
}

export function MunicipalityAction({ idMunicipality, onOpenEdit }: Props)  {
    const fetcherDelete = useFetcher<HandlerSuccess<ActionPostMunicipality>>();
    const fetcherGet = useFetcher<HandlerSuccess<MunicipalityI>>({ key: 'getMunicipality' });
    const isTheSame = Number(fetcherDelete?.data?.serverData.id) === idMunicipality;
    const isLoading = fetcherDelete.state !== 'idle' 
        && isTheSame;

    const handleDelete = () => {
        fetcherDelete.submit({
            id: idMunicipality, 
            _action: 'delete'
        }, {
          method: 'POST', 
          action:`/municipality/${idMunicipality}`,
       })
    }

    const handleUpdate = () => {
        onOpenEdit();
        fetcherGet.load(`/municipality/${idMunicipality}`);
    }

    useEffect(() => {
        if(fetcherDelete.data?.error && isTheSame && !isLoading ) {
            toast.error(fetcherDelete.data?.error);
        }
    }, [fetcherDelete.data, isLoading, isTheSame]);
    
    return (
        <Action 
            ariaLabel="Municipalities"
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    )
}