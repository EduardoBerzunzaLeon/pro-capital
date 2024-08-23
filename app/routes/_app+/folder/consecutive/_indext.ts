import { LoaderFunction } from "@remix-run/node";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
  
    const url = new URL(request.url);
    const townId = url.searchParams.get('id') || 0;

    try {
      
      const data = await Service.folder.findNextConsecutive(townId);
      
      return handlerSuccess<number>(200, data);
      } catch (error) {
        return handlerError(error);
      }
      
  }