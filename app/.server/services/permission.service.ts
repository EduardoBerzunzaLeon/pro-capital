import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { Permission } from "../domain/entity/permission.entity";
import { PaginationWithFilters } from "../domain/interface";
import { validationZod } from "./validation.service";
import { RequestId } from "../interfaces";

export const findAll = async (roleId: RequestId, props: PaginationWithFilters) => {

    const { id } = validationZod({ id: roleId }, idSchema);
    const { data, metadata } =  await Repository.permission.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data, 
        mapper: Permission.mapper(id),
        errorMessage: 'No se encontraron permisos'
    });

}

export const updateIsAssigned = async (roleId: RequestId, permissionId: RequestId, isAssigned: boolean) => {
    const { id: roleIdVal }  = validationZod({ id: roleId }, idSchema);   
    const { id: permissionIdVal }  = validationZod({ id: permissionId }, idSchema);   

    if(isAssigned) {
        return await Repository.permission.assignRole(roleIdVal, permissionIdVal);
    }
    
    return await Repository.permission.unassignRole(roleIdVal, permissionIdVal);

}

export default {
    findAll,
    updateIsAssigned,   
}