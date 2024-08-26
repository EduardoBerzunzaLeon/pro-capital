import { Repository } from "~/.server/adapter/repository";
import {  RequestId } from "~/.server/interfaces";
import {  validationZod } from "~/.server/services/validation.service";
import {  idSchema, townCreateSchema } from "~/schemas";
import { PaginationWithFilters } from "../domain/interface/Pagination.interface";
import { ServerError } from "../errors";
import { Town } from "../domain/entity";


interface UpdateTownI {
    name: string,
    municipalityId: RequestId
}


export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } =  await Repository.town.findAll({...props});

    if(metadata.total === 0) {
        throw ServerError.notFound('No se encontraron municipios');
    }

    const dataMapped = Town.mapper(data);

    return {
        data: dataMapped,
        ...metadata
    }
}

export const findOne = async (id: RequestId) => {
    const { id: townId } = validationZod({ id }, idSchema);
    const town = await Repository.town.findOne(townId);

    if(!town) throw ServerError.notFound('No se encontro el municipio');

    return town;
}

export const findAutocomplete = async (name: string) => {
    const town = await Repository.town.findAutocomplete(name);

    //  TODO: create autocomplete service
    if(town.length === 0) return [];

    return town.map(({ id, name }: { id: number, name: string}) => ({ id, value: name}));
}

export const deleteOne = async (id: RequestId) => {
    const { id: townId } = validationZod({ id }, idSchema);

    const townWithFolders = await Repository.town.findIfHasFolders(townId);

    if(!townWithFolders) {
        throw ServerError.notFound(`No se encontro el municipio con ID: ${id}`);
    }

    const townsCount = townWithFolders._count.folders;
    if(townsCount > 0) {
        throw ServerError.badRequest(`El municipio de ${townWithFolders.name} tiene ${townsCount} localidades`)
    }

    const townDeleted = await Repository.town.deleteOne(townId);

    if(townDeleted?.count === 0) {
        throw ServerError.internalServer(`No se pudo eliminar el municipio ${townWithFolders.name}`);
    }
}

export const updateOne = async (id: RequestId, { name, municipalityId }: UpdateTownI) => {
    const { municipalityId: mId, name: townName } = validationZod(
        { municipalityId, name }, 
        townCreateSchema
    );
    const { id: townId } = validationZod({ id }, idSchema);

    // TODO: create municipality repository with base repository
    // const municipality = await db.municipality.findUnique({ where: { id: municipalityId }});

    // if(!municipality) throw ServerError.notFound('El municipio solicitado no existe');

    const townUpdated = await Repository.town.updateOne(townId, { name: townName, municipalityId: mId });

    if(townUpdated) {
        throw ServerError.badRequest(`No se pudo actualizar la localidad con el nombre ${name}`);
    }
}

export const createOne = async (municipalityId: RequestId, name: string) => {
    const { municipalityId: id, name: townName } = validationZod(
        { municipalityId, name }, 
        townCreateSchema
    );

    // TODO: create validation municiplaity and town
    // await Repository.municipality.findOne(municipalityId);

    const town = await Repository.town.findIfExists(townName);

    if(town) {
        throw ServerError.badRequest('La localidad ya existe');
    }

    const newTown = await Repository.town.createOne(townName, id);
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
}