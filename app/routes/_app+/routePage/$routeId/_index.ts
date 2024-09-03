import { ActionFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.routeId;

    
    try {
        
    
        
      if(data._action === 'update') {
        const isActive = data?.isActiveRoute === 'true';
        await Service.routes.updateIsActive(id, isActive);
        return handlerSuccessWithToast('update');
      }
      
      if(data._action === 'delete') {
        await Service.routes.deleteOne(id);
        return handlerSuccessWithToast('delete');
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
        console.log(error);
      return handlerErrorWithToast(error, data);
    }
  }
