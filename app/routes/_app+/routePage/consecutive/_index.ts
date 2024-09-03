import { LoaderFunction } from "@remix-run/node";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async () => {
  
    try {
      const consecutive = await Service.routes.findLastRoute();
      return handlerSuccess(200, { consecutive });
    } catch (error) {
      return handlerError(error);
    }
      
  }