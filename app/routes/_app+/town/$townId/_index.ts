import { ActionFunction, LoaderFunction } from "@remix-run/node";
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
        return handlerError(error)
    }
}



export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.townId;


    let status =  200;
    try {
      
      if(data._action === 'update') {
        const municipalityId = data['municipality[id]']+'';
        const name = data.name+'';

        console.log({municipalityId, name})
        await Service.town.updateOne( id, { name, municipalityId });
      }

      if(data._action === 'delete') {
        await Service.town.deleteOne(id);
        status = 201;
      }

      return handlerSuccess(status, { id: Number(data?.id), name: data?.name+'' });

    } catch (error) {
      console.log(error);
      return handlerError(error, { ...data });
    }
  }