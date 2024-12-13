import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { Leader } from "../domain/entity";
import { PaginationWithFilters } from "../domain/interface";
import { RequestId } from "../interfaces";
import { validationConform, validationZod } from './validation.service';
import { ServerError } from "../errors";
import { BirthdaySchema, CreateLeaderServerSchema, ExportBirthdaySchema, UnsubscribeLeaderSchema } from "~/schemas/leaderSchema";
import { LeaderBirthdayProps, LeaderProps } from './excelReport.service';


export const findAll = async (props: PaginationWithFilters) => {

    const { data, metadata } =  await Repository.leader.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data, 
        mapper: Leader.mapper,
        errorMessage: 'No se encontraron líderes'
    });
}

export const exportData = async (props:PaginationWithFilters) => {
    const data = await Repository.leader.findByReport(props);
    return Service.excel.leaderReport(data as LeaderProps[]);
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

export const createOne = async (userId: number, form: FormData) => {

    const data =  await verifyMutation(form);

    await verifyIfHasFolder(data.folderId);

    return await Repository.leader.createOne({...data, createdById: userId});
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

interface FindAllBirthdayProps {
    limit: number | string,  
    page: number | string,
    month: number | string, 
    day: number | string
}

export const findAllBirthday = async (props: Partial<FindAllBirthdayProps>) => {

    const { limit, page, month, day } = validationZod(props, BirthdaySchema);

    const [{ times }] = await Repository.leader.findCountBirthdays(month, day);
    const total = Number(times);
    const pageCount = Math.ceil(total / limit);
    const nextPage = page < pageCount ? page + 1: null;
    const offset = (page * limit) - limit;

    const metadata = { pageCount, nextPage, offset, limit, page, total};
    if(total === 0) {
        return {
            metadata,
            data: []
        };
    }
    
    const data = await Repository.leader.findAllBirthday({ 
        month, 
        day, 
        limit, 
        offset 
    });

    return  { metadata, data }
}

export const exportBirthdays = async (props: Partial<Pick<FindAllBirthdayProps, 'month' | 'day'>>) => {
    const { month, day } = validationZod(props, ExportBirthdaySchema);
    const data = await Repository.leader.findReportAllBirthday({ month, day });
    return Service.excel.leaderBirthdayReport(data as LeaderBirthdayProps[]);
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
    createOne, 
    deleteOne, 
    exportData,
    exportBirthdays,
    findAll, 
    findAllBirthday, 
    findOne, 
    resubscribe, 
    unsubscribe, 
    updateOne, 
    verifyIfHasFolder, 
    verifyIfHasOwnFolder, 
    verifyMutation, 
}