import { LoaderFunction } from "@remix-run/node";
import { handlerError } from "~/.server/reponses";
import { Service } from "~/.server/services";


export const loader: LoaderFunction = async ({ request }) => {
 
    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId') || '0';
    const folderId = url.searchParams.get('folderId') || '0';

    try {
        const serverData =  await Service.credit.findGroupsByFolder(clientId, folderId);

        return  {
            folderId,
            serverData,
        }

    } catch (error) {
        return handlerError(error);
    }

}