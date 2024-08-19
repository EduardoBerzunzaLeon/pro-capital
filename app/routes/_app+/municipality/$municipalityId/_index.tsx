import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { MunicipalityI } from "~/.server/domain/entity";
import { handlerError } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
  
    const { municipalityId } = params;
    
    try {
        const municipality = await Service.municipality.findOne(municipalityId);
        return handlerSuccess<MunicipalityI>(200, municipality);
    } catch (error) {
        return handlerError(error)
    }
}



export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.municipalityId;

    try {
      
      if(data._action === 'update') {
        await Service.municipality.updateOne({ id, form: formData });
      }

      if(data._action === 'delete') {
        await Service.municipality.deleteOne(id);
      }

      return handlerSuccess(201, { id: Number(data?.id), name: data?.name+'' });

    } catch (error) {
      return handlerError(error, { ...data });
    }
  }
