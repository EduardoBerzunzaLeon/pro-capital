import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { getEmptyPagination, handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { Params } from '../../../application/params';
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ request }) => {
  
  await Service.auth.requirePermission(request, permissions.municipality.permissions.view);
  const { params } = Params.municipality.getParams(request);
  try {
   
      const data = await Service.municipality.findAll(params);

      return handlerSuccess(200, data);
    } catch (error) {
      return json(getEmptyPagination());  
    }
}

  export const action: ActionFunction = async({request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      if(data._action === 'create') {
          await Service.auth.requirePermission(request, permissions.municipality.permissions.add);
          await Service.municipality.createOne(formData);
          return handlerSuccessWithToast('create', `del municipio ${data.name}`);
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
      
    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  }

  
