import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { handlerError } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
  
    const { folderId } = params;
    try {
        const folder = await Service.folder.findOne(folderId);
        return handlerSuccess<any>(200, folder);
    } catch (error) {
        return handlerError(error)
    }
}

export const action: ActionFunction = async({params, request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const id = params.folderId;


    let status =  200;
    try {
      
      if(data._action === 'update') {
        const routeId = data['route[id]']+'';
        await Service.folder.updateOne( id, routeId );
      }

      if(data._action === 'delete') {
        await Service.folder.deleteOne(id);
        status = 201;
      }

      return handlerSuccess(status, { id: Number(data?.id), name: data?.name+'' });

    } catch (error) {
      console.log(error);
      return handlerError(error, { ...data });
    }
  }