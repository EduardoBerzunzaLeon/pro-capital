import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { RequestId } from "../interfaces";
import { validationZod } from "./validation.service";
import { ServerError } from "../errors";
import { AvalCreateI } from "../domain/interface";

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

export const upsertOne = async (aval: AvalCreateI) => {
    return await Repository.aval.upsertOne(aval);
}

export default {
    findAutocomplete, 
    findOne,
    upsertOne
}