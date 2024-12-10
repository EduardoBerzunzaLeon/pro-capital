import { Repository } from "~/.server/adapter/repository";
import {  RequestId } from "~/.server/interfaces";
import {  idSchema, townCreateSchema } from "~/schemas";
import { ServerError } from "../errors";
import { Town } from "../domain/entity";
import { Service } from ".";
import { PaginationWithFilters } from "../domain/interface";
import { validationZod } from "./validation.service";
import { TownProps } from "./excelReport.service";

interface UpdateTownI {
    name: string,
    municipalityId: RequestId
}

export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } =  await Repository.town.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data, 
        mapper: Town.mapper,
        errorMessage: 'No se encontraron localidades'
    });
    
}

export const exportData = async (props:PaginationWithFilters) => {
    const data = await Repository.town.findByReport(props);
    return Service.excel.townReport(data as TownProps[]);
}


export const findOne = async (id: RequestId) => {
    const { id: townId } = validationZod({ id }, idSchema);
    const town = await Repository.town.findOne(townId);
    if(!town) throw ServerError.notFound('No se encontro la localidad');
    return Town.create(town);
}

export const findAutocomplete = async (name: string) => {
    const town = await Repository.town.findAutocomplete(name);
    return Service.dto.autocompleteMapper('id', 'name', town);
}

export const deleteOne = async (id: RequestId) => {
    const { id: townId } = validationZod({ id }, idSchema);

    const townWithFolders = await Repository.town.findIfHasFolders(townId);

    if(!townWithFolders) {
        throw ServerError.notFound(`No se encontro la localidad con ID: ${id}`);
    }

    const townsCount = townWithFolders._count.folders;
    if(townsCount > 0) {
        throw ServerError.badRequest(`La localidad de ${townWithFolders.name} tiene ${townsCount} carpetas`)
    }

    const townDeleted = await Repository.town.deleteOne(townId);

    if(!townDeleted  || townDeleted?.count === 0) {
        throw ServerError.internalServer(`No se pudo eliminar la localidad ${townWithFolders.name}`);
    }
}

export const updateOne = async (id: RequestId, { name, municipalityId }: UpdateTownI) => {
    const { municipalityId: mId, name: townName } = validationZod(
        { municipalityId, name }, 
        townCreateSchema
    );
    const { id: townId } = validationZod({ id }, idSchema);

    await Service.municipality.findOne(mId);

    const townUpdated = await Repository.town.updateOne(townId, { name: townName, municipalityId: mId });

    if(!townUpdated) {
        throw ServerError.badRequest(`No se pudo actualizar la localidad con el nombre ${name}`);
    }
}

export const createOne = async (municipalityId: RequestId, name: string, userId: number) => {
    const { municipalityId: id, name: townName } = validationZod(
        { municipalityId, name }, 
        townCreateSchema
    );

    await Service.municipality.findOne(id);

    const town = await Repository.town.findIfExists(townName);

    if(town) {
        throw ServerError.badRequest('La localidad ya existe');
    }

    const newTown = await Repository.town.createOne(townName, id, userId);
    if(!newTown) {
        throw ServerError.internalServer(`No se pudo crear la localidad ${name}, intentelo mas tarde`);
    }
    return Town.create(newTown);
}

export default {
    findAll,
    findOne,
    findAutocomplete,
    deleteOne,
    updateOne,
    createOne,
    exportData,
}