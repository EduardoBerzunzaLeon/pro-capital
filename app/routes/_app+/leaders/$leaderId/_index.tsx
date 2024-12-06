import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirectWithWarning } from "remix-toast";
import { handlerSuccess, handlerError } from "~/.server/reponses";
import { handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ params }) => {
    const { leaderId } = params;
    try {
        const leader = await Service.leader.findOne(leaderId);
        return handlerSuccess(200, leader);
    } catch (error) {
        console.log(error);
        return handlerError(error)
    }
}

export const action: ActionFunction = async ({ params, request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.leaderId;

    try {
      
        if(data._action === 'update') {
          await Service.auth.requirePermission(request, permissions.leaders.permissions.update);
          formData.set('folder', data['folder[id]']);
          await Service.leader.updateOne( id, formData );
          return handlerSuccessWithToast('update');
        }
  
        if(data._action === 'delete') {
          await Service.auth.requirePermission(request, permissions.leaders.permissions.delete);
          await Service.leader.deleteOne(id);
          return handlerSuccessWithToast('delete');
        }

        
        if(data._action === 'subscribe') {
          await Service.auth.requirePermission(request, permissions.leaders.permissions.active);
          await Service.leader.resubscribe(id, Number(data['folder[id]']));
          return handlerSuccessWithToast('update', 'La lider');
        }
        
        if(data._action === 'unsubscribe') {
          await Service.auth.requirePermission(request, permissions.leaders.permissions.active);
          await Service.leader.unsubscribe(id, formData);
          return handlerSuccessWithToast('update', 'La lider');
        }
  
        return redirectWithWarning("/", "Entrada a una ruta de manera invalida");
  
      } catch (error) {
        console.log(error);
        return handlerErrorWithToast(error, data);
      }

}
