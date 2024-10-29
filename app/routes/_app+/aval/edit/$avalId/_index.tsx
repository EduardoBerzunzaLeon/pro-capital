import { ActionFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerErrorWithToast, handlerSuccessWithToast } from "~/.server/reponses";
import { Service } from "~/.server/services";


export const action: ActionFunction = async ({ params, request }) => {

    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.avalId;

    console.log({data, id});

    try {
        
        if(data._action === 'update') {

            await Service.aval.updateById(id, formData);
            return handlerSuccessWithToast('update', 'del aval');

        }

        return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
        console.log(error);
        return handlerErrorWithToast(error, data);
        
    }

}