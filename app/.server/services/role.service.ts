import { RoleTypes } from "@prisma/client";
import { Service } from ".";
import { Repository } from "../adapter"
import { Role } from "../domain/entity/role.entity";
import { PaginationWithFilters } from "../domain/interface";
import { ServerError } from "../errors";


export const findAll = async (props: PaginationWithFilters) => {

    const { data, metadata } =  await Repository.role.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data, 
        mapper: Role.mapper,
        errorMessage: 'No se encontraron roles'
    });
}

export const findMany = async () => {
    return await Repository.role.findMany()
}

export const hasPermission = async (roleName: RoleTypes, permission: string) => {
    const data = await Repository.role.findPermission(roleName, permission);    

    if(data) {
        throw ServerError.forbidden('No tiene acceso a esta ruta');
    }
}

export default {
    findAll,
    findMany,
    hasPermission,
}