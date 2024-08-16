import { useFetcher } from "@remix-run/react";
import { Action } from "./Action";
import { useEffect } from "react";
import { toast } from "react-toastify";
// import { useFetcherWithReset } from "~/application";

interface Props {
    idMunicipality: number
}

export function MunicipalityAction({ idMunicipality }: Props)  {
    const fetcherDelete = useFetcher();
    const fetcherGet = useFetcher({ key: 'getMunicipality' });
    const isTheSame = Number(fetcherDelete?.data?.id) === idMunicipality;
    const isLoading = fetcherDelete.state !== 'idle' 
        && isTheSame;

    const handleDelete = () => {
        fetcherDelete.submit({
            id: idMunicipality, 
            _action: 'delete'
        }, {
          method: 'POST', 
          action:'/municipality',
       })
    }

    const handleUpdate = () => {
        fetcherGet.load(`/municipality/${idMunicipality}`);
    }

    console.log(fetcherDelete.state)

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