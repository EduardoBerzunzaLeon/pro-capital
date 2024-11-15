import { LoaderFunction } from "@remix-run/node";
import { handlerError } from "~/.server/reponses";
import { Service } from "~/.server/services";


export const loader: LoaderFunction = async ({ request }) => {
 
    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId') || '0';
    const folderId = url.searchParams.get('folderId') || '0';

    console.log({clientId, folderId});

    try {
        return await Service.credit.findGroupsByFolder(clientId, folderId);
    } catch (error) {
        return handlerError(error);
    }

}