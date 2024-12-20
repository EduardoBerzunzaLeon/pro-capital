import { idSchema } from "~/schemas";
import { Repository } from "../adapter/repository";
import { RequestId } from "../interfaces";
import { validationZod } from "./validation.service";
import { Folder } from "../domain/entity";
import { ServerError } from "../errors";
import { db } from "../adapter";
import { Service } from ".";
import { PaginationWithFilters } from "../domain/interface";
import { FolderProps } from "./excelReport.service";
import { activeSchema } from "~/schemas/genericSchema";

export const findAll = async (props: PaginationWithFilters) => {

    const { data, metadata } =  await Repository.folder.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data,  
        mapper: Folder.mapper,
        errorMessage: 'No se encontraron carpetas'
    });
}

export const exportData = async (props:PaginationWithFilters) => {
    const data = await Repository.folder.findByReport(props);
    
    return Service.excel.folderReport(data as FolderProps[]);
}

export const findAutocomplete = async (name: string) => {
    const folder = await Repository.folder.findAutocomplete(name);
    return Service.dto.autocompleteMapper('id', 'name', folder);
}

export const findOne = async (id: RequestId) => {
    const { id: folderId } = validationZod({ id }, idSchema);
    const folder =  await Repository.folder.findOne(folderId);
    if(!folder) throw ServerError.notFound('No se encontro la carpeta');
    return Folder.createSingle(folder);
}

export const updateOne = async (id: RequestId, routeId: RequestId) => {
    const { id: folderId } = validationZod({ id }, idSchema);
    const { id: routeIdVal } = validationZod({ id: routeId }, idSchema);
    await Repository.folder.findOne(folderId);
    const folderUpdated =  await Repository.folder.updateOne(folderId, routeIdVal);

    if(!folderUpdated) {
        throw ServerError.badRequest(`No se pudo actualizar la carpeta`);
    }
}

export const updateIsActive = async(id: RequestId, isActiveFolder?: boolean) => {
    
    const { isActive: isActiveValidated } = validationZod({ isActive: isActiveFolder }, activeSchema);
    const { id: idVal } = validationZod({ id }, idSchema);

    const folderUpdated =  await Repository.folder.updateIsActive(idVal, isActiveValidated);
    if(!folderUpdated) {
        throw ServerError.internalServer('No se pudo actualizar la carpeta');
    }
}


const deleteGroupsInFolder = async ( groups: {id: number}[] ) => {
    const groupsId = groups.map(({id}: { id: number }) => id);

    const groupsDeleted = await Repository.group.deleteMany(groupsId);

    if(groupsDeleted?.count < 0) {
        throw ServerError.internalServer('Ocurrio un error, no se pudo eliminar los grupos de la carpeta')
    }

}

export const deleteOne = async (id: RequestId) => {
    const { id: folderId } = validationZod({ id }, idSchema);

    const folderDb = await Repository.folder.findCountGroups(folderId);

    if(!folderDb) {
        throw ServerError.notFound('No se encontro la carpeta');
    }

    if(folderDb._count.groups > 0) {
        let hasCredit = false;

        for (let index = 0; index < folderDb.groups.length; index++) {
            if(folderDb.groups[index]._count.credits) {
                hasCredit = true;
                break;
            }
        }

        if(hasCredit) {
            throw ServerError.badRequest(`La carpeta ${folderDb.name} tiene creditos asignados a uno o varios grupos`);
        }

        await deleteGroupsInFolder(folderDb.groups);
    }

    const folderDeleted =  await Repository.folder.deleteOne(folderId);
    if(!folderDeleted) {
        throw ServerError.internalServer('No se pudo eliminar la carpeta')
    }
}

export const createOne = async (townId: RequestId, routeId: RequestId, userId: number) => {
    const { id: routeIdVal } = validationZod({ id: routeId }, idSchema);

    // TODO: create route repository
    const [town, route] = await Promise.all([
        Service.town.findOne(townId),
        db.route.findUnique({ where: { id: routeIdVal }})
    ]);

    if(!route) {
        throw ServerError.badRequest('No existe la ruta ni/o la localidad');
    }

    const nextConsecutive = await findNextConsecutive(town.id);

    const data = {
        townId: town.id,
        routeId: routeIdVal,
        createdById: userId,
        consecutive: nextConsecutive,
        name: `${town.name} ${nextConsecutive}`,
    }

    const newFolder = await Repository.folder.createOne(data);

    if(!newFolder) 
        throw ServerError.internalServer('No se pudo crear la carpeta');

    const group = await Repository.group.createOne(1, newFolder.id);

    if(!group){
        await Repository.folder.deleteOne(newFolder.id);
        throw ServerError.internalServer(`No se pudo crear automaticamente el grupo de la carpeta ${newFolder.name}`)
    }
}

export const findNextConsecutive = async (townId: RequestId) => {
    const { id } = validationZod({ id: townId }, idSchema);
    const consecutive =  await Repository.folder.findLastConsecutive(id);
    return consecutive + 1;
}

export const findLastGroup = async (folderId: RequestId) => {
    const { id } = validationZod({ id: folderId }, idSchema);
    return await Repository.folder.findLastGroup(id);
}

export const findSampleAll = async () => {
    return await Repository.folder.findSampleAll()
}

export const findByNameAndGroup = async (folder: string, group: number) => {
    const folderDb = await Repository.folder.findByNameAndGroup(folder, group);

    if(!folderDb) {
        throw ServerError.badRequest('No se encontro la carpeta');
    }

    if(!folderDb.groups || folderDb.groups.length != 1) {
        throw ServerError.badRequest('La carpeta no tiene grupos asignados');
    }

    return folderDb;
}

export default {
    createOne,
    deleteOne,
    exportData,
    findAll,
    findAutocomplete,
    findByNameAndGroup,
    findLastGroup,
    findNextConsecutive,
    findOne,
    findSampleAll,
    updateIsActive,
    updateOne,
}