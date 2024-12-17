import { ClientUpdateSchema, clientUpdateSchema, idSchema } from "~/schemas";
import { Repository } from "../adapter";
import { ClientCreateI, ClientUpdateI } from "../domain/interface";
import { RequestId } from "../interfaces";
import { validationConform, validationZod } from "./validation.service";
import { Service } from ".";
import { activeSchema } from "~/schemas/genericSchema";
import { ServerError } from "../errors";


export const createOne = async (client: ClientCreateI) => {
    return await Repository.client.createOne(client);
}

export const deleteOne = async (id: number) => {
    return await Repository.client.deleteOne(id);
}

export const updateOne = async (curp: string, data: ClientUpdateI) => {
    return await Repository.client.updateOne(curp, data);
}

export const updateById = async (id: RequestId, form: FormData) => {
 
    const { id: idValidated  } = validationZod({ id }, idSchema);
    const dataToSave: ClientUpdateSchema = validationConform(form, clientUpdateSchema);

    const clientFullname = Service.utils.concatFullname({ ...dataToSave });

    await Service.credit.verifyClientCurp(idValidated, dataToSave.curp.toLowerCase());

    return await Repository.client.updateById(idValidated, { 
        ...dataToSave, 
        fullname: clientFullname, 
        curp: dataToSave.curp.toLowerCase() 
    });
}

export const updateDeceased = async (id: RequestId, isDeceased: boolean) => {

    const { isActive: isDeceasedValidated } = validationZod({ isActive: isDeceased }, activeSchema);
    const { id: idValidated } = validationZod({ id }, idSchema);

    const clientUpdated = await Repository.client.updateDeceased(idValidated, isDeceasedValidated);

    if(!clientUpdated) {
        throw ServerError.badRequest('No se pudo cambiar el estatus de vida del cliente');
    }
}

export default {
    createOne,
    deleteOne,
    updateOne,
    updateById,
    updateDeceased
}
