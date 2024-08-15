import { useFetcher } from "@remix-run/react";
import { Action } from "./Action";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
    idMunicipality: number
}

export function MunicipalityAction({ idMunicipality }: Props)  {
    const fetcherDelete = useFetcher();
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
    
    useEffect(() => {
        if(fetcherDelete.data?.error && isTheSame && !isLoading) {
          toast.error(fetcherDelete.data?.error);
        }
        
        if(fetcherDelete.data?.status === 'success' && isTheSame) {
          toast.success('El municipio se borro correctamente');
        }
    
    }, [fetcherDelete.data, isTheSame, isLoading]);

    return (
        <Action 
            ariaLabel="Municipalities"
            onUpdate={() => console.log('update')}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    )
}