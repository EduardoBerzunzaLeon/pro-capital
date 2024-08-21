import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Town } from "~/.server/domain/entity";
import { handlerError } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
  
    const { townId } = params;
    
    try {
        const town = await Service.town.findOne(townId);
        return handlerSuccess<Town>(200, town);
    } catch (error) {
        return handlerError(error)
    }
}



export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.townId;

    try {
      
      if(data._action === 'update') {
        await Service.town.updateOne({ id, form: formData });
      }

      if(data._action === 'delete') {
        await Service.town.deleteOne(id);
      }

      return handlerSuccess(201, { id: Number(data?.id), name: data?.name+'' });

    } catch (error) {
      return handlerError(error, { ...data });
    }
  }
