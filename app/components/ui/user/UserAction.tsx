// import { useFetcherAction } from "~/application";
import { permissions } from "~/application";
import { Action } from "../Action/Action";
import { useNavigate } from "@remix-run/react";

interface Props {
    userId: number,
}

export function UserAction({ userId }: Props)  {

    const navigate = useNavigate();

    const handleView = () => {
        navigate(`/users/${userId}`);
    }

    const handleUpdate = () => {
        navigate(`/users/${userId}/update`)
    }
       
    return (
        <Action 
            ariaLabel="user actions"
            onView={handleView}
            onUpdate={handleUpdate}
            permissionUpdate={permissions.users.permissions.update}
            permissionView={permissions.users.permissions.view}
        />
    )
}