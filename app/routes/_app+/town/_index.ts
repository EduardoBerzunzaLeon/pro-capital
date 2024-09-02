import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { Generic } from "~/.server/interfaces";
import { handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination, handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerPaginationParams, handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

const columnSortNames: Generic = {
  name: 'name',
  municipality: 'municipality.name'
}

const columnsFilter = ['name', 'municipality.name'];

export const loader: LoaderFunction = async ({ request }) => {

    try {
      const { 
        page, limit, column, direction, search
      } = handlerPaginationParams(request.url, 'name', columnsFilter);

      const data = await Service.town.findAll({
        page, 
        limit, 
        column: columnSortNames[column] ?? 'name', 
        direction,
        search
      });
      
        return handlerSuccess(200, data);
      } catch (error) {
        return json(getEmptyPagination())
      }
      
  }

  export const action: ActionFunction = async({ request }) => {

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    console.log({data});

    const municipalityId = data['municipality[id]']+'';
    const { name } = data;

    try {
      if(data._action === 'create') {
          await Service.town.createOne(municipalityId, name+'');
          return handlerSuccessWithToast('create', `de la carpeta ${data.name}`);
      }
      
      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  
  }