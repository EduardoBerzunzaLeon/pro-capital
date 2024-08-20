import { Repository } from "~/.server/adapter/repository";
import { RequestDataGeneric, RequestId } from "~/.server/interfaces";
import { validationConform, validationZod } from "~/.server/services/validation.service";
import {  idSchema, townSchema } from "~/schemas";
import { PaginationWithFilters } from "../domain/interface/Pagination.interface";


export const findAll = async (props: PaginationWithFilters) => {
    return await Repository.town.findAll({...props});
}

export const findOne = async (id: RequestId) => {
    const { id: townId } = validationZod({ id }, idSchema);
    return await Repository.town.findOne(townId);
}

// export const findByName = async (name: string) => {
//     return await Repository.municipality.findByName(name);
// }

export const deleteOne = async (id: RequestId) => {
    const { id: townId } = validationZod({ id }, idSchema);
    await Repository.town.deleteOne(townId);
}

export const updateOne = async ({ id, form }: RequestDataGeneric) => {
    const { name, municipalityId } = validationConform(form, townSchema);
    const { id: townId } = validationZod({ id }, idSchema);
    await Repository.town.updateOne(townId, { name, municipalityId });
}

export const createOne = async (form: FormData) => {
    const { name, municipalityId } = validationConform(form, townSchema);
    await Repository.town.createOne(name, municipalityId);
}

export default {
    findAll,
    findOne,
    deleteOne,
    updateOne,
    createOne,
}