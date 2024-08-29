import { LoaderFunction } from "@remix-run/node";
import { handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
  
    const url = new URL(request.url);
    const townId = url.searchParams.get('id') || '0';

    try {
      const consecutive = await Service.folder.findNextConsecutive(townId);
      return handlerSuccess(200, { consecutive, townId: parseInt(townId)});
    } catch (error) {
      return handlerError(error);
    }
      
  }