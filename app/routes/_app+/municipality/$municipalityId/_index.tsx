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
      const { error: errorMessage } = handlerError(error);
      return redirectWithError('/region', errorMessage);
    }
}



export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.municipalityId;

    try {
      
      if(data._action === 'update') {
        await Service.municipality.updateOne({ id, form: formData });
        // return jsonWithSuccess({ result: "Data saved successfully" }, "¡Actualización exitosa! 🎉");
        return { ok: true}
      }
      
      if(data._action === 'delete') {
        await Service.municipality.deleteOne(id);
        return jsonWithSuccess({ result: "Data deleted successfully" }, "Elimación exitosa! 🎉");
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      const { error: errorMessage } = handlerError(error, { ...data });
      return jsonWithError(null, errorMessage);
    }
  }

  export function shouldRevalidate({
    actionResult,
    defaultShouldRevalidate,
  }: ShouldRevalidateFunctionArgs) {
    console.log('entraste');
    console.log({actionResult});
    return defaultShouldRevalidate;
  }