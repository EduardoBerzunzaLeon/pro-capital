import { Action } from "../Action/Action";
import { permissions, useFetcherAction } from "~/application";

interface Props {
    idAgentRoute: number,
}

export function AgentRouteAction({ idAgentRoute }: Props)  {

    const { handleDelete, isDeleting } = useFetcherAction({ 
        key: 'getAgentRoute', 
        route:'agents', 
        id: idAgentRoute
     });
       
    return (
        <Action 
            ariaLabel="agent routes actions"
            onDelete={handleDelete}
            isLoading={isDeleting}
            permissionDelete={permissions.agents.permissions.delete}
        />
    )
}