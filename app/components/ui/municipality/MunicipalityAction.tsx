import { Action } from "../Action/Action";
import { useFetcherAction, permissions } from '~/application';

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
            permissionDelete={permissions.municipality.permissions.delete}
            permissionUpdate={permissions.municipality.permissions.update}
        />
    )
}