import { LoaderFunction } from "@remix-run/node";
import { MunicipalityI } from "~/.server/domain/entity";
import { handlerError } from "~/.server/reponses/handlerError";
import { handlerSuccess } from "~/.server/reponses/handlerSuccess";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ params }) => {
  
    const { municipalityId } = params;
    
    try {
        const municipality = await Service.municipality.findOne(Number(municipalityId));
        return handlerSuccess<MunicipalityI>(200, municipality);
    } catch (error) {
        return handlerError(error)
    }
}
