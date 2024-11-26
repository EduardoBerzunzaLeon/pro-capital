// import { useFetcherAction } from "~/application";
import { Action } from "../Action/Action";
import { useNavigate } from "@remix-run/react";

interface Props {
    userId: number,
}

export function UserAction({ userId }: Props)  {

    const navigate = useNavigate();
    // const { handleDelete, isDeleting } = useFetcherAction({ 
    //     key: 'getUser', 
    //     route: 'users', 
    //     id: userId
    //  });


    const handleView = () => {
        navigate(`/users/${userId}`);
    }
       
    return (
        <Action 
            ariaLabel="user actions"
            onView={handleView}
            // onDelete={handleDelete}
            // isLoading={isDeleting}
        />
    )
}