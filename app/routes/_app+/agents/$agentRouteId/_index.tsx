import { ActionFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import {  handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { permissions } from "~/application";


export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.agentRouteId;

    try {
  
      if(data._action === 'delete') {
        await Service.auth.requirePermission(request, permissions.agents.permissions.delete);
        await Service.agent.deleteOne(id);
        return handlerSuccessWithToast('delete');
      }
      
      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  }

