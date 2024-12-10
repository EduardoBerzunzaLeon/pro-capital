import { RoleTypes } from "@prisma/client";
import { Service } from ".";
import { Repository } from "../adapter"
import { Role } from "../domain/entity/role.entity";
import { PaginationWithFilters } from "../domain/interface";
import { ServerError } from '../errors/ServerError';
import { RoleProps } from './excelReport.service';


export const findAll = async (props: PaginationWithFilters) => {

    const { data, metadata } =  await Repository.role.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data, 
        mapper: Role.mapper,
        errorMessage: 'No se encontraron roles'
    });
}


export const exportData = async (props:PaginationWithFilters) => {
    const data = await Repository.role.findByReport(props);
    return Service.excel.roleReport(data as RoleProps[]);
}


export const findMany = async () => {
    return await Repository.role.findMany()
}

export const hasPermission = async (roleName: RoleTypes, permission: string) => {
    
    if( !permission || !roleName ) {
        throw ServerError.badRequest('El permisso y el rol son requeridos')
    }

    const data = await Repository.role.findPermission(roleName, permission);    

    return data;
}

export const findById = async (roleId: number) => {
    const role = await Repository.role.findById(roleId);
    if(!role) {
        throw ServerError.notFound('No se encontro el rol');
    }
    return role;
}

export default {
    findAll,
    findMany,
    findById,
    hasPermission,
    exportData,
}