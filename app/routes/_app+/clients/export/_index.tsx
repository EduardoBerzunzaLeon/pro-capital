import { ActionFunction } from "@remix-run/node";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { Service } from "~/.server/services";
import { permissions } from '~/application';


export const action: ActionFunction = async ({ request }) => {

    await Service.auth.requirePermission(request, permissions.credits.permissions.layout);

    const formData = await request.formData();

    try {
        return await Service.credit.exportLayout(formData);
    } catch (error) {
        console.log({error});
        return handlerErrorWithToast(error, { message: ' ' });        
    }
}