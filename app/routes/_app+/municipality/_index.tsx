import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { getEmptyPagination, handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerPaginationParams, handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
  
  try {
   
      const { 
        page, limit, column, direction, search
      } = handlerPaginationParams(request.url, 'name', ['name']);

      const data = await Service.municipality.findAll({
        page, 
        limit, 
        column, 
        direction,
        search
      });

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
          await Service.municipality.createOne(formData);
          return handlerSuccessWithToast('create', `del municipio ${data.name}`);
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
      
    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  }

  
