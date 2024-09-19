import { Service } from ".";
import { Repository } from "../adapter";
import { Credit } from "../domain/entity";
import { PaginationWithFilters } from "../domain/interface";


export const findAll = async (props: PaginationWithFilters) => {

    const { data, metadata } = await Repository.credit.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data,
        mapper: Credit.mapper,
        errorMessage: 'No se encontraron creditos'
    });

}

export default{ 
    findAll
}