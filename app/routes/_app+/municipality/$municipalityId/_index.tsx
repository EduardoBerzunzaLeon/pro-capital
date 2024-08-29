import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { jsonWithError, jsonWithSuccess, redirectWithError, redirectWithWarning } from "remix-toast";
import { handlerError } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
  
    const { municipalityId } = params;
    
    try {
      const municipality = await Service.municipality.findOne(municipalityId);
      return handlerSuccess(200, municipality);
    } catch (error) {
      return handlerError(error);
      // return redirectWithError('/region', errorMessage);
      // return jsonWithError({ status, id: municipalityId }, errorMessage);
      // 
    }
}

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
  formData,
}: ShouldRevalidateFunctionArgs) {
  const actionType = formData?.get('_action') ?? '';


  console.log({actionType, actionResult});
  if( actionType === 'create' ) return false;
  
  if(actionType === 'update' && ( 
      actionResult?.status === 404 
      || actionResult?.status === 500
    )) {
      return false;
  }

  if(actionType === 'delete') {
    return false;
  }
  
  return defaultShouldRevalidate;
}

export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.municipalityId;

    try {
      
      if(data._action === 'update') {
        await Service.municipality.updateOne({ id, form: formData });
        return jsonWithSuccess({ result: "Data saved successfully" }, "¡Actualización exitosa! 🎉");
      }
      
      if(data._action === 'delete') {
        await Service.municipality.deleteOne(id);
        return jsonWithSuccess({ result: "Data deleted successfully" }, "Elimación exitosa! 🎉");
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      const { error: errorMessage, status } = handlerError(error, { ...data });
      return jsonWithError({ status, id }, errorMessage);
    }
  }

