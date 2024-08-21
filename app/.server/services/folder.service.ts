import { Repository } from "../adapter/repository";
import { PaginationWithFilters } from "../domain/interface/Pagination.interface";



export const findAll = async (props: PaginationWithFilters) => {
    return await Repository.folder.findAll({...props});
}

export default {
    findAll,
}