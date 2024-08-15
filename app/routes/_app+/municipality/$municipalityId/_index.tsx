import { json, LoaderFunction } from "@remix-run/node";
import { handlerError } from "~/.server/errors/handlerError";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
  
    const { municipalityId } = params;
    
    try {
        const municipality = await Service.municipality.findOne(Number(municipalityId));
        return json({municipality});
    } catch (error) {
        return handlerError(error)
    }
}
