import { useFetcher } from "@remix-run/react";

interface Props {
    key: string,
    route: string,
    id: number,
}


export const useFetcherAction = ({ key, route, id }: Props) => {

    const fetcherDelete = useFetcher();
    const fetcherGet = useFetcher({ key });
    const isDeleting = fetcherDelete.formData?.get("id") === String(id);

    const handleDelete = () => {
        fetcherDelete.submit({
            id, 
            _action: 'delete'
        }, {
          method: 'POST', 
          action:`/${route}/${id}`,
       })
    }

    const handleUpdate = () => {
        fetcherGet.load(`/${route}/${id}`);
    }

    return  {
        handleUpdate,
        handleDelete,
        isDeleting,
    }
}