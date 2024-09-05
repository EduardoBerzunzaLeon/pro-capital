import { Action } from "../Action/Action";
import { useFetcherAction } from "~/application";

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
            ariaLabel="agen routes actions"
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}