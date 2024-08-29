import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Generic } from "~/.server/interfaces";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";
import { handlerPaginationParams, handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

const columnSortNames: Generic = {
  town: 'town.name',
  name: 'name',
  municipality: 'town.municipality.name'
}

const columnsFilter = ['name', 'town.name', 'town.municipality.name'];

export const loader: LoaderFunction = async ({ request }) => {
  
    try {

      const { 
        page, limit, column, direction, search
      } = handlerPaginationParams(request.url, 'name', columnsFilter);

      const data = await Service.folder.findAll({
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

  export const action: ActionFunction = async({request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const townId = data['town[id]']+'';
    const { route } = data;

    try {
      if(data._action === 'create') {
          await Service.folder.createOne(townId, route+'');
          return handlerSuccessWithToast('create');
      }
      return handlerSuccess(201, { id: Number(data?.id), name: data?.name+'' });
    } catch (error) {
      // TODO: change this for handlerErrorWithToast
      return handlerError(error, { ...data });
    }
  }

