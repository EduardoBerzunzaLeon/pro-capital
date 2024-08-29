import { useFetcher } from "@remix-run/react";
import { Action } from "./Action";
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
        console.log(idMunicipality);

        console.log(fetcherGet)
        fetcherGet.load(`/municipality/${idMunicipality}`);
        // fetcherGet.submit(null,{
        //     method: 'GET',
        //     action: `/municipality/${idMunicipality}`
        // })
    }
    
    return (
        <Action 
            ariaLabel="Municipalities"
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}