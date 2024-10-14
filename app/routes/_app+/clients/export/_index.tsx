import { ActionFunction } from "@remix-run/node";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { Service } from "~/.server/services";


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    // const data = Object.fromEntries(formData);

    try {
        const data=  await Service.credit.exportLayout(formData);
        console.log({data});
        return data;
    } catch (error) {
        console.log({error});
        return handlerErrorWithToast(error, { message: ' ' });        
    }
}