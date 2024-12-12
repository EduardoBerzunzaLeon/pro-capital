import { ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { redirectWithWarning } from 'remix-toast';
import { getEmptyPagination, handlerErrorWithToast } from '~/.server/reponses/handlerError';
import { handlerSuccess, handlerSuccessWithToast } from '~/.server/reponses/handlerSuccess';
import { Service } from '~/.server/services';
import { Params } from '../../../application/params/index';
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ request }) => {
  
  await Service.auth.requirePermission(request, permissions.route.permissions.view);
  const { params } = Params.route.getParams(request);

    try {
          const data = await Service.routes.findAll(params);
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
      const user = await Service.auth.requirePermission(request, permissions.route.permissions.add);
      await Service.routes.createOne(user.id);
      return handlerSuccessWithToast('create');
    }

    return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
  } catch (error) {
    return handlerErrorWithToast(error, data);
  }

}