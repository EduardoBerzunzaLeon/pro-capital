import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { UserComplete } from "../domain/entity";
import { PaginationWithFilters } from "../domain/interface";
import { RequestId } from "../interfaces";
import { validationZod } from "./validation.service";
import { ServerError } from "../errors";

export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } = await Repository.user.findAll({...props});
    return Service.paginator.mapper({
        metadata,
        data,
        mapper: UserComplete.mapper,
        errorMessage: 'No se encontraron usuarios'
    })
}

export const findAutocomplete = async (name: string) => {
    const users = await Repository.user.findAutocomplete(name);
    return Service.dto.autocompleteMapper('id', 'fullName', users);
}

export const findOne =  async (id: RequestId) => {
    const { id: idVal } = validationZod({ id }, idSchema);

    const user = await Repository.user.findOne(idVal);

    if(!user) {
        throw ServerError.badRequest('No se encontro el usuario');
    }

    return user;
}

// export const updateOne = async (id: RequestId, formData: FormData) => {

// }
 

export default {
    findAutocomplete,
    findOne,
    findAll,
}