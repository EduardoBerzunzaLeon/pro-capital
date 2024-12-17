import { ClientUpdateSchema, clientUpdateSchema, idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { RequestId } from "../interfaces";
import { validationConform, validationZod } from "./validation.service";
import { ServerError } from "../errors";
import { AvalCreateI } from "../domain/interface";
import { activeSchema } from "~/schemas/genericSchema";

export const findAutocomplete = async (curp: string) => {
    const aval = await Repository.aval.findAutocomplete(curp.toLowerCase());
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

export const updateById = async (id: RequestId, form: FormData) => {
 
    const { id: idValidated  } = validationZod({ id }, idSchema);
    const dataToSave: ClientUpdateSchema = validationConform(form, clientUpdateSchema);
    const avalFullname = Service.utils.concatFullname({ ...dataToSave });

    await Service.credit.verifyAvalCurp(idValidated, dataToSave.curp.toLowerCase());

    return await Repository.aval.updateById(idValidated, { 
        ...dataToSave, 
        fullname: avalFullname, 
        curp: dataToSave.curp.toLowerCase() 
    });
}

export const updateDeceased = async (id: RequestId, isDeceased: boolean) => {

    const { isActive: isDeceasedValidated } = validationZod({ isActive: isDeceased }, activeSchema);
    const { id: idValidated } = validationZod({ id }, idSchema);

    const avalUpdated = await Repository.aval.updateDeceased(idValidated, isDeceasedValidated);

    if(!avalUpdated) {
        throw ServerError.badRequest('No se pudo cambiar el estatus de vida del aval');
    }
}

export default {
    findAutocomplete, 
    findOne,
    updateById,
    upsertOne,
    updateDeceased
}