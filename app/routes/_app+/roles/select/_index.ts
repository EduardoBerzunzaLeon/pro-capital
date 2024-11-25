import { LoaderFunction } from "@remix-run/node";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async () => {
  
    try {
      const data = await Service.role.findMany();
      return handlerSuccess(200, data);
    } catch (error) {
      return handlerError(error);
    }
      
}