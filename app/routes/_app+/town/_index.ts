import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination, handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { Params } from '../../../application/params';
import { permissions } from '~/application';


export const loader: LoaderFunction = async ({ request }) => {

    await Service.auth.requirePermission(request, permissions.town.permissions.view); 
    const { params } = Params.town.getParams(request);

    try {

      const data = await Service.town.findAll(params);
    
      return handlerSuccess(200, data);
    } catch (error) {
        return json(getEmptyPagination())
    }
      
  }

  export const action: ActionFunction = async({ request }) => {

    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    const municipalityId = data['municipality[id]']+'';
    const { name } = data;
    
    try {
      if(data._action === 'create') {
        await Service.auth.requirePermission(request, permissions.town.permissions.add); 
        await Service.town.createOne(municipalityId, name+'');
          return handlerSuccessWithToast('create', `de la carpeta ${data.name}`);
      }
      
      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  
  }