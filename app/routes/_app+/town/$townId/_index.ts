import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { jsonWithError, jsonWithSuccess, redirectWithWarning } from "remix-toast";
import { Town } from "~/.server/domain/entity";
import { handlerError } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
    const { townId } = params;
    try {
        const town = await Service.town.findOne(townId);
        return handlerSuccess<Town>(200, {...town});
    } catch (error) {
      const { error: errorMessage } = handlerError(error);
      return jsonWithError({status: 'error'}, errorMessage);
    }
}

export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.townId;

    try {
      
      if(data._action === 'update') {
        const municipalityId = data['municipality[id]']+'';
        const name = data.name+'';
        await Service.town.updateOne( id, { name, municipalityId });
        return jsonWithSuccess({ result: "Data saved successfully" }, "¡Actualización exitosa! 🎉");
      }

      if(data._action === 'delete') {
        await Service.town.deleteOne(id);
        return jsonWithSuccess({ result: "Data deleted successfully" }, "Elimación exitosa! 🎉");
      }

      return redirectWithWarning("/", "Entrada a una ruta de manera invalida");

    } catch (error) {
      const { error: errorMessage, serverData } = handlerError(error, { ...data });
      return jsonWithError({ serverData }, errorMessage);
    }
}
