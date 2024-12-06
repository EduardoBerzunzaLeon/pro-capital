import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { redirectWithWarning } from "remix-toast";
import { handlerError, handlerErrorWithToast } from "~/.server/reponses/handlerError";
import { handlerSuccess, handlerSuccessWithToast } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ params }) => {
  
    const { municipalityId } = params;
    
    try {
      const municipality = await Service.municipality.findOne(municipalityId);
      return handlerSuccess(200, municipality);
    } catch (error) {
      return handlerError(error);
    }
    
}

export function shouldRevalidate({
  defaultShouldRevalidate,
  formData,
}: ShouldRevalidateFunctionArgs) {
  const actionType = formData?.get('_action') ?? '';

  if( actionType === 'create' ) return false;
  
  return defaultShouldRevalidate;
}

export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.municipalityId;

    try {
      
      if(data._action === 'update') {
        await Service.auth.requirePermission(request, permissions.municipality.permissions.update);
        await Service.municipality.updateOne({ id, form: formData });
        return handlerSuccessWithToast('update');
      }
      
      if(data._action === 'delete') {
        await Service.auth.requirePermission(request, permissions.municipality.permissions.delete);
        await Service.municipality.deleteOne(id);
        return handlerSuccessWithToast('delete');
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      return handlerErrorWithToast(error, data);
    }
  }

