import { ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { redirectWithWarning } from 'remix-toast';
import { getEmptyPagination, handlerErrorWithToast } from '~/.server/reponses/handlerError';
import { handlerPaginationParams, handlerSuccess, handlerSuccessWithToast } from '~/.server/reponses/handlerSuccess';
import { Service } from '~/.server/services';

const columnsFilter = ['isActive', 'name'];

export const loader: LoaderFunction = async ({ request }) => {

    try {
        const { 
            page, limit, column, direction, search
          } = handlerPaginationParams(request.url, 'name', columnsFilter);

          // TODO: Refactor this
          let isActiveParsed = JSON.parse(search[0].value+'');
          
          if(Array.isArray(isActiveParsed) && isActiveParsed.length === 1) {
            isActiveParsed = Boolean(isActiveParsed[0]);
          }
        
          if(Array.isArray(isActiveParsed) && isActiveParsed.length === 2) {
            isActiveParsed = 'notUndefined'
          } 

          search[0].value = isActiveParsed;

          const data = await Service.routes.findAll({
            page, 
            limit, 
            column, 
            direction,
            search
          });
          
          return handlerSuccess(200, data);
    } catch (error) {
        console.log(error);
        return json(getEmptyPagination())
    }

}


export const action: ActionFunction = async({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);


  try {
    
    if(data._action === 'create') {
      await Service.routes.createOne();
      return handlerSuccessWithToast('create');
    }

    return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
  } catch (error) {
    return handlerErrorWithToast(error, data);
  }

}