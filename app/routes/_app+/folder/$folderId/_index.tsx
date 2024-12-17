import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerError, handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ params }) => {
  
    const { folderId } = params;

    try {
        const folder = await Service.folder.findOne(folderId);
        return handlerSuccess(200, folder);
    } catch (error) {
        return handlerError(error)
    }

}

export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.folderId;

    try {
      
      if(data._action === 'update') {
        await Service.auth.requirePermission(request, permissions.folder.permissions.update);
        const routeId = String(data['route']);
        await Service.folder.updateOne( id, routeId );
        return handlerSuccessWithToast('update');
      }

      if(data._action === 'updateIsActive') {
        await Service.auth.requirePermission(request, permissions.folder.permissions.active);
        const isActive = data?.isActiveFolder === 'true';
        await Service.folder.updateIsActive(id, isActive);
        return handlerSuccessWithToast('update');
      }

      if(data._action === 'delete') {
        await Service.auth.requirePermission(request, permissions.folder.permissions.delete);
        await Service.folder.deleteOne(id);
        return handlerSuccessWithToast('delete');
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  }