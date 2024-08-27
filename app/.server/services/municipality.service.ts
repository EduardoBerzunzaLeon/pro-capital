import {  idSchema, nameSchema } from "~/schemas";
import { Repository } from "../adapter/repository"
import { validationConform, validationZod } from "./validation.service";
import { RequestDataGeneric, RequestId } from "../interfaces";
import { PaginationWithFilters } from "../domain/interface/Pagination.interface";
import { ServerError } from "../errors";
import { Municipality } from "../domain/entity";
import { Service } from './index';


export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } = await Repository.municipality.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data, 
        entityMapper: Municipality,
        errorMessage: 'No se encontraron municipios'
    });
}

export const findOne = async (id: RequestId) => {
    const { id: municipalityId } = validationZod({ id }, idSchema);
    const municipality =  await Repository.municipality.findOne(municipalityId);
    if(!municipality) throw ServerError.notFound('No se encontro el municipio');
    return municipality;
}



export const findAutocomplete = async (name: string) => {
    const municipality = await Repository.municipality.findAutocomplete(name);
    return Service.autocomplete.mapper('id', 'name', municipality);
}

export const deleteOne = async (id: RequestId) => {
    const { id: municipalityId } = validationZod({ id }, idSchema);
    const municipalityWithTowns = await Repository.municipality.findIfHasTowns(municipalityId);

    if(!municipalityWithTowns) {
        throw ServerError.notFound(`No se encontro el municipio con ID: ${id}`);
    }

    const municipalitiesCount = municipalityWithTowns._count.towns;
    if(municipalitiesCount > 0) {
        throw ServerError.badRequest(`El municipio de ${municipalityWithTowns.name} tiene ${municipalitiesCount} localidades`)
    }

    const municipalityDeleted = await Repository.municipality.deleteOne(municipalityId);
    
    if(!municipalityDeleted  || municipalityDeleted?.count === 0) {
        throw ServerError.internalServer(`No se pudo eliminar la localidad ${municipalityWithTowns.name}`);
    }
}

export const updateOne = async ({ id, form }: RequestDataGeneric) => {
    const { name } = validationConform(form, nameSchema);
    const { id: municipalityId } = validationZod({ id }, idSchema);
    const municipalityUpdated = await Repository.municipality.updateOne(municipalityId, name);
    if(!municipalityUpdated) {
        throw ServerError.badRequest(`No se pudo actualizar el municipio con ID: ${id}`);
    }
}

export const createOne = async (form: FormData) => {
    const { name } = validationConform(form, nameSchema);
    const municipalityDb = await Repository.municipality.findIfExists(name);
    if(municipalityDb) {
        throw ServerError.badRequest(`El municipio con nombre: ${name} ya existe`);
    }


    const municipalityCreated = await Repository.municipality.createOne(name);
    if(!municipalityCreated) {
        throw ServerError.internalServer(`No se pudo crear el municipio ${name}, intentelo mas tarde`);
    }

    return municipalityCreated;
}

export default {
    findAll,
    findOne,
    findAutocomplete,
    deleteOne,
    updateOne,
    createOne,
}