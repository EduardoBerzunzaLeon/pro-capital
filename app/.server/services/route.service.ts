import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { Route } from "../domain/entity";
import { PaginationWithFilters } from "../domain/interface";
import { RequestId } from "../interfaces";
import { validationZod } from "./validation.service";
import { ServerError } from "../errors";
import { activeSchema } from "~/schemas/genericSchema";


export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } =  await Repository.route.findAll({...props});
    
    return Service.paginator.mapper({
        metadata,
        data, 
        mapper: Route.mapper,
        errorMessage: 'No se encontraron rutas'
    });
}

export const findLastRoute = async () => {
    const consecutive = await Repository.route.findLastRoute();
    return consecutive + 1;
}

export const findMany = async () =>  {
    return await Repository.route.findMany();
}

export const findIsActive =  async (id: RequestId) => {
    const { id: routeId } = validationZod({ id }, idSchema);
    const route = await Repository.route.findIsActive(routeId);
    if(!route) {
        throw ServerError.notFound('No se encontro la ruta');
    }
    return route;
}

export const updateIsActive = async(id: RequestId, isActiveRoute?: boolean) => {
    
    const { isActive: isActiveValidated } = validationZod({ isActive: isActiveRoute }, activeSchema);
    const { id: routeId } = await findIsActive(id);
    console.log({routeId, isActiveValidated});
    const routeUpdated =  await Repository.route.updateIsActive(routeId, isActiveValidated);
    if(!routeUpdated) {
        throw ServerError.internalServer('No se pudo actualizar la ruta');
    }
}

export const createOne = async () => {
   const consecutive = await findLastRoute();
   const routeCreated =  await Repository.route.createOne(consecutive);
   if(!routeCreated) {
    throw ServerError.internalServer(`No se pudo crear la ruta ${consecutive}`)
   }
}


export const deleteOne = async (id: RequestId) => {
    const { id: routeId } = validationZod({ id }, idSchema);
    const foldersCount = await Repository.route.findCountFolders(routeId);
    if(!foldersCount) {
        throw ServerError.notFound('No se encontro la ruta');
    }

    if(foldersCount._count.folders > 0) {
        throw ServerError.badRequest(`La ruta ${foldersCount.name} tiene ${foldersCount._count.folders} carpetas`);
    }

    await Repository.route.deleteOne(routeId);
}

export default {
    findAll, 
    findLastRoute,
    findMany,
    updateIsActive, 
    createOne, 
    deleteOne, 
}