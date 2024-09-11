import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerSuccess, handlerError } from "~/.server/reponses";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
  
    const { leaderId } = params;

    try {
        const leader = await Service.leader.findOne(leaderId);
        return handlerSuccess(200, leader);
    } catch (error) {
        console.log(error);
        return handlerError(error)
    }

}


export const action: ActionFunction = async ({ params, request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.leaderId;

    console.log({data,id});

    try {
      
        if(data._action === 'update') {
          formData.set('folder', data['folder[id]']);
          await Service.leader.updateOne( id, formData );
          return handlerSuccessWithToast('update');
        }
  
        if(data._action === 'delete') {
          await Service.leader.deleteOne(id);
          return handlerSuccessWithToast('delete');
        }
  
        return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
  
      } catch (error) {
        console.log(error);
        return handlerErrorWithToast(error, data);
      }

}
