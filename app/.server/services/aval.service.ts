import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { RequestId } from "../interfaces";
import { validationZod } from "./validation.service";
import { ServerError } from "../errors";

export const findAutocomplete = async (curp: string) => {
    const aval = await Repository.aval.findAutocomplete(curp.toUpperCase());
    return Service.dto.autocompleteMapper('id', 'curp', aval);
}

export const findOne = async (id: RequestId) => {
    const { id: idValidated } = validationZod({id}, idSchema);
    const avalDb = await Repository.aval.findOne(idValidated);

    if(!avalDb) {
        throw ServerError.badRequest('No se encontro el Aval');
    }

    return avalDb;
}

export default {
    findAutocomplete, 
    findOne
}