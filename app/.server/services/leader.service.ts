import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { Leader } from "../domain/entity";
import { PaginationWithFilters } from "../domain/interface";
import { RequestId } from "../interfaces";
import { validationConform, validationZod } from "./validation.service";
import { ServerError } from "../errors";
import { CreateLeaderServerSchema, UnsubscribeLeaderSchema } from "~/schemas/leaderSchema";


export const findAll = async (props: PaginationWithFilters) => {

    const { data, metadata } =  await Repository.leader.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data, 
        mapper: Leader.mapper,
        errorMessage: 'No se encontraron líderes'
    });
}

export const findOne = async (id: RequestId) => {
    const { id: leaderId } = validationZod({ id }, idSchema);
    const leader =  await Repository.leader.findOne(leaderId);
    if(!leader) throw ServerError.notFound('No se encontro la líder');
    return leader;
}

const verifyIfHasFolder = async (folderId: number) => {
    const leader = await Repository.leader.findIfHasFolder(folderId);

    if(leader) {
        throw ServerError.badRequest(`El ${leader.folder.name} ya esta asignado a otra lider`)
    }
    
    return false;
}

const verifyIfHasOwnFolder = async (folderId: number, leaderId: number) => {
    const leader = await Repository.leader.findIfHasOwnFolder(folderId, leaderId);
    return !!leader;
}

const verifyMutation = async (form: FormData) => {
    const { 
        name,
        lastNameFirst,
        lastNameSecond,
        folder: folderId,
        ...restProps
    } = validationConform(form, CreateLeaderServerSchema);

    const fullname = Service.utils.concatFullname({
        name, lastNameFirst, lastNameSecond
    });

    const folder = await Service.folder.findOne(folderId);
    if(!folder) {
        throw ServerError.badRequest('No se encontro la carpeta');
    }

    return  {
        name,
        lastNameFirst,
        lastNameSecond,
        folderId,
        fullname,
        ...restProps
    }
}

export const createOne = async (form: FormData) => {

    const data =  await verifyMutation(form);

    await verifyIfHasFolder(data.folderId);

    return await Repository.leader.createOne({...data});
}

export const deleteOne = async (id: RequestId) => {
    const { id: leaderId } = validationZod({ id }, idSchema);
    return await Repository.leader.deleteOne(leaderId);
}

export const updateOne = async (id: RequestId, form: FormData) => {
    const { id: leaderId } = validationZod({ id }, idSchema);
    const data = await verifyMutation(form);

    const ownFolder = await verifyIfHasOwnFolder(data.folderId, leaderId);

    if(!ownFolder) {
        await verifyIfHasFolder(data.folderId);
    }

    return  await Repository.leader.updateOne(leaderId, data);
}

export const findAllBirthday = async () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return Repository.leader.findAllBirthday(month, day);
}

export const resubscribe = async (id: RequestId, folderId: RequestId) => {
    const { id: leaderIdVal } = validationZod({ id }, idSchema);
    const { id: folderIdVal } = validationZod({ id: folderId }, idSchema);

    // TODO: comprobar el metodo que no exista otra líder activa en la carpeta
    const leaderActive = await Repository.leader.findIfHasOtherLeader(folderIdVal, leaderIdVal);
    
    if(leaderActive?.id) {
        throw ServerError.badRequest('La carpeta ya tiene asignada una lider activa');
    }

    return await Repository.leader.resubscribe(leaderIdVal, folderIdVal);
} 

export const unsubscribe = async (id: RequestId, form: FormData) => {
    const { id: leaderId } = validationZod({ id }, idSchema);
    const { date, reason } = validationConform(form, UnsubscribeLeaderSchema);
    return await Repository.leader.unsubscribe(leaderId, date, reason);
}

export default {
    findAll, 
    findOne, 
    verifyIfHasFolder, 
    verifyIfHasOwnFolder, 
    verifyMutation, 
    createOne, 
    deleteOne, 
    updateOne, 
    findAllBirthday, 
    resubscribe, 
    unsubscribe, 
}