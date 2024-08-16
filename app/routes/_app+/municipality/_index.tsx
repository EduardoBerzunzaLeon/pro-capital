import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { MunicipalityI } from "~/.server/domain/entity";
import { PaginationI } from "~/.server/domain/interface";
import { handlerError } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
  
    const url = new URL(request.url);
    const page = url.searchParams.get('pm') || 1;
    const limit = url.searchParams.get('lm') || 5;
  
    try {
      const data = await Service.municipality.findAll(Number(page), Number(limit));

      return handlerSuccess<PaginationI<MunicipalityI>>(200, data);
    } catch (error) {
      return [];  
    }
    
}

  export const action: ActionFunction = async({request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      
      if(data._action === 'update') {
        await Service.municipality.updateOne(formData)
      }

      if(data._action === 'create') {
          await Service.municipality.createOne(data.name+'');
      }

      if(data._action === 'delete') {
        await Service.municipality.deleteOne(Number(data.id));
      }

      return handlerSuccess(201, { id: Number(data?.id), name: data?.name+'' });

    } catch (error) {
      return handlerError(error, { ...data });
    }
  }

