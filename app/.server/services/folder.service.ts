import { folderCreateSchema, idSchema } from "~/schemas";
import { Repository } from "../adapter/repository";
import { PaginationWithFilters } from "../domain/interface/Pagination.interface";
import { RequestId } from "../interfaces";
import { validationZod } from "./validation.service";

interface CreateFolderProps { 
    consecutive: number, 
    name: string, 
    townId: RequestId, 
    routeId: RequestId
}


export const findAll = async (props: PaginationWithFilters) => {
    return await Repository.folder.findAll({...props});
}

export const findOne = async (id: RequestId) => {
    const { id: folderId } = validationZod({ id }, idSchema);
    return await Repository.folder.findOne(folderId);
}

export const updateOne = async (id: RequestId, routeId: RequestId) => {
    const { id: folderId } = validationZod({ id }, idSchema);
    const { id: routeIdVal } = validationZod({ id: routeId }, idSchema);
    return await Repository.folder.updateOne(folderId, routeIdVal);
}

export const deleteOne = async (id: RequestId) => {
    const { id: folderId } = validationZod({ id }, idSchema);
    return await Repository.folder.deleteOne(folderId);
}

export const createOne = async (townId: RequestId, routeId: RequestId) => {

    const { id: townIdVal } = validationZod({ id: townId }, idSchema);
    const { id: routeIdVal } = validationZod({ id: routeId }, idSchema);

    return await Repository.folder.createOne(townIdVal, routeIdVal);
}


export const findNextConsecutive = async (townId: RequestId) => {
    const { id } = validationZod({ id: townId }, idSchema);
    return await Repository.folder.findNextConsecutive(id);
}

export default {
    findAll,
    findOne,
    updateOne,
    deleteOne,
    createOne,
    findNextConsecutive
}