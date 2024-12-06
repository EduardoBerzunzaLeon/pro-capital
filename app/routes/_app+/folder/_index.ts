import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination, handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { Params } from '../../../application/params';
import { permissions } from "~/application";


export const loader: LoaderFunction = async ({ request }) => {  
  await Service.auth.requirePermission(request, permissions.folder.permissions.view);
  
  try {
    const { params } = Params.folder.getParams(request);
    const data = await Service.folder.findAll(params);
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
          await Service.auth.requirePermission(request, permissions.folder.permissions.add);
          await Service.folder.createOne(townId, route+'');
          return handlerSuccessWithToast('create');
      }
      return handlerSuccess(201, { id: Number(data?.id), name: data?.name+'' });
    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  }

