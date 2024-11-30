import { Service } from ".";
import { Repository } from "../adapter"
import { Role } from "../domain/entity/role.entity";
import { PaginationWithFilters } from "../domain/interface";


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

export default {
    findMany,
    findAll
}