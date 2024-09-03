import { Action } from "../Action/Action";
import { useFetcherAction } from "~/application";

interface Props {
    idRoute: number,
}

export function RouteAction({ idRoute }: Props)  {
    const { handleDelete, isDeleting } = useFetcherAction({ 
        key: 'getRoute', 
        route: 'routePage', 
        id: idRoute
     });
    
    return (
        <Action 
            ariaLabel="routes"
            onDelete={handleDelete}
            isLoading={isDeleting}
        />
    )
}