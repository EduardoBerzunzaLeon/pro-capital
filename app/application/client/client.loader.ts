import { json, LoaderFunction } from '@remix-run/node';
import { handlerSuccess } from '~/.server/reponses';
import { getEmptyPagination } from '~/.server/reponses/handlerError';
import { Service } from '~/.server/services';
import { Params } from '../params/';
import { permissions } from '../permissions';

  export const clientLoader: LoaderFunction = async ({ request }) => {
  
    await Service.auth.requirePermission(request, permissions.credits.permissions.view);
    const { params, search } = Params.credit.getParams(request);

    try {

      const { page, limit, column, direction } = params;
      const data = await Service.credit.findAll(params);
      
      return handlerSuccess(200, { 
        ...data,
        ...search,
        p: page,
        l: limit,
        c: column,
        d: direction, 
      });
      
    } catch (error) {
        console.log({error});
        return json(getEmptyPagination({...search}));
    }
  }