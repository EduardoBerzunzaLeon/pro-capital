import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { handlerError } from "~/.server/errors/handlerError";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
  
    const url = new URL(request.url);
    const page = url.searchParams.get('pm') || 1;
    const limit = url.searchParams.get('lm') || 5;
  
    try {
      return await Service.municipality.findAll(Number(page), Number(limit));
    } catch (error) {
      return [];  
    }
    
  }

  export const action: ActionFunction = async({request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      
      if(data._action === 'update') {
        await Service.municipality.updateOne(Number(data.id), data.name+'')
      }

      if(data._action === 'create') {
          await Service.municipality.createOne(data.name+'');
      }

      if(data._action === 'delete') {
        await Service.municipality.deleteOne(Number(data.id));
      }

      return json({status: 'success'}, 201); 
    } catch (error) {
      // return handlerError(error);
      return  { error: 'ocurrio un error', id: Number(data.id) };
    }
    // try {
    //   await Service.municipality.deleteOne(Number(data.id));
    //   return json({ status: 'success' }, 201);
    // } catch (error) {
    //   return handlerError(error);
    //   // return json({error: 'no data'});
    // }
  }