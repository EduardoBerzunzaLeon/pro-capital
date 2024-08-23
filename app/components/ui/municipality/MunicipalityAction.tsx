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
    const isDeleting = fetcherDelete.formData?.get("id") === idMunicipality+'';

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
        if(fetcherDelete.data?.error && !isDeleting ) {
            toast.error(fetcherDelete.data?.error);
        }
    }, [fetcherDelete.data, isDeleting]);
    
    return (
        <Action 
            ariaLabel="Municipalities"
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}