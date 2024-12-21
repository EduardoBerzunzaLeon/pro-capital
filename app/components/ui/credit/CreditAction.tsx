import { permissions, useFetcherAction } from "~/application";
import { Action } from "../Action/Action";
import { useNavigate } from "@remix-run/react";

interface Props {
    creditId: number,
}

export function CreditAction({ creditId }: Props)  {

    const navigate = useNavigate();
    const { handleDelete, isDeleting } = useFetcherAction({ 
        key: 'getCredit', 
        route: 'clients', 
        id: creditId
     });

     const handleView = () => {
        navigate(`/clients/${creditId}/payments`);
    }
       
    return (
        <Action 
            ariaLabel="credit actions"
            onView={handleView}
            onDelete={handleDelete}
            isLoading={isDeleting}
            permissionView={permissions.credits.permissions.view_detail}
            permissionDelete={permissions.credits.permissions.delete}
        />
    )
}