import { Repository } from "~/.server/adapter/repository";
import {  RequestId } from "~/.server/interfaces";
import {  validationZod } from "~/.server/services/validation.service";
import {  idSchema, townCreateSchema } from "~/schemas";
import { PaginationWithFilters } from "../domain/interface/Pagination.interface";


interface UpdateTownI {
    name: string,
    municipalityId: RequestId
}


export const findAll = async (props: PaginationWithFilters) => {
    return await Repository.town.findAll({...props});
}

export const findOne = async (id: RequestId) => {
    const { id: townId } = validationZod({ id }, idSchema);
    return await Repository.town.findOne(townId);
}

export const findByName = async (name: string) => {
    return await Repository.town.findByName(name);
}

export const deleteOne = async (id: RequestId) => {
    const { id: townId } = validationZod({ id }, idSchema);
    await Repository.town.deleteOne(townId);
}

export const updateOne = async (id: RequestId, { name, municipalityId }: UpdateTownI) => {
    const { municipalityId: mId, name: townName } = validationZod(
        { municipalityId, name }, 
        townCreateSchema
    );
    const { id: townId } = validationZod({ id }, idSchema);
    await Repository.town.updateOne(townId, { name: townName, municipalityId: mId });
}

export const createOne = async (municipalityId: RequestId, name: string) => {
    const { municipalityId: id, name: townName } = validationZod(
        { municipalityId, name }, 
        townCreateSchema
    );
    await Repository.town.createOne(townName, id);
}

export default {
    findAll,
    findOne,
    deleteOne,
    updateOne,
    createOne,
    findByName
}