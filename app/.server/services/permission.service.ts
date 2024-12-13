import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { Permission } from "../domain/entity/permission.entity";
import { PaginationWithFilters } from "../domain/interface";
import { validationZod } from "./validation.service";
import { RequestId } from "../interfaces";
import { PermissionProps } from "./excelReport.service";

export const findAll = async (roleId: RequestId, props: PaginationWithFilters) => {

    const { id } = validationZod({ id: roleId }, idSchema);
    const role = await Service.role.findById(id);
    const { data, metadata } =  await Repository.permission.findAll({...props});

    const response = Service.paginator.mapper({
        metadata,
        data,
        mapper: Permission.mapper(id),
        errorMessage: 'No se encontraron permisos'
    });

     return {
        role,
        ...response
     }

}

export const exportData = async (roleId: RequestId, props:PaginationWithFilters) => {
    const { id } = validationZod({ id: roleId }, idSchema);
    
    const [role, data] = await Promise.all([
        Service.role.findById(id),
        Repository.permission.findByReport(props)
    ]);

    return Service.excel.permissionReport(id, role.role, data as PermissionProps[]);
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
    exportData,
}