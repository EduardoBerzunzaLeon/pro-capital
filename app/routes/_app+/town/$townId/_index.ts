import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerError, handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ params }) => {
    const { townId } = params;
    try {
        const town = await Service.town.findOne(townId);
        return handlerSuccess(200, town);
    } catch (error) {
      return handlerError(error);
    }
}

export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.townId;

    try {
      
      if(data._action === 'update') {
        await Service.auth.requirePermission(request, permissions.town.permissions.update); 
        const municipalityId = data['municipality[id]']+'';
        const name = data.name+'';
        await Service.town.updateOne( id, { name, municipalityId });
        return handlerSuccessWithToast('update');
      }

      if(data._action === 'delete') {
        await Service.auth.requirePermission(request, permissions.town.permissions.delete); 
        await Service.town.deleteOne(id);
        return handlerSuccessWithToast('delete');
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
}
