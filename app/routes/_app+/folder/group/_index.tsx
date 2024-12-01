import { ActionFunction, ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { handlerError, handlerErrorWithToast, handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {

    const url = new URL(request.url);
    const folderId = url.searchParams.get('id') || '0';

    try {
        const group = await Service.folder.findLastGroup(folderId);
        return handlerSuccess(200, { group });
    } catch (error) {
        return handlerError(error);
    }

}


export const action: ActionFunction = async ({
    request
}: ActionFunctionArgs) => {
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData)

    try {
        
        if(data._action === 'generate') {
            await Service.group.generateGroups();
            return handlerSuccessWithToast('update', 'Creacion de grupos');
        }

    } catch (error) {
        console.log({error})
        return handlerErrorWithToast(error, data);
    }

}