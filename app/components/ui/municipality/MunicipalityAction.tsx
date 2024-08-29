import { Action } from "../Action/Action";
import { useFetcherAction } from "~/application";

interface Props {
    idMunicipality: number,
    onOpenEdit: () => void
}

export function MunicipalityAction({ idMunicipality, onOpenEdit }: Props)  {
   const { handleUpdate, handleDelete, isDeleting } = useFetcherAction({ 
    key: 'getMunicipality', 
    route:'municipality', 
    id: idMunicipality
 });
    
   const handleUpdateWithModal = () => {
    onOpenEdit();
    handleUpdate();
   }

    return (
        <Action 
            ariaLabel="Municipalities"
            onUpdate={handleUpdateWithModal}
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}