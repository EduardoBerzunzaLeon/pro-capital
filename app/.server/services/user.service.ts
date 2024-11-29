import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { UserComplete } from "../domain/entity";
import { PaginationWithFilters } from "../domain/interface";
import { RequestId } from "../interfaces";
import { validationConform, validationZod } from "./validation.service";
import { ServerError } from "../errors";
import { activeSchema } from "~/schemas/genericSchema";
import { CreateUserSchema, UpdatePasswordSchema, UpdateRoleSchema, UpdateUserSchema } from "~/schemas/userSchema";
import { hash } from "../adapter/encryptor";

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

export const updateIsActive = async (id: RequestId, isActive?: boolean) => {
    const { isActive: isActiveValidated } = validationZod({ isActive }, activeSchema);
    const { id: idVal } = validationZod({ id }, idSchema);

    const user = await Repository.user.findRole(idVal);

    if(!user) {
        throw ServerError.badRequest('No se encontro el usuario');
    }
    
    if(user.role.role === 'ADMIN' && !isActiveValidated) {
        throw ServerError.badRequest('No se puede desactivar un ADMINISTRADOR');
    }
    
    const userUpdated = await Repository.user.updateIsActive(idVal, isActiveValidated);
    if(!userUpdated) {
        throw ServerError.internalServer('No se puede actualizar el usuario');
    }

    return  userUpdated;
}

export const createOne = async ( formData: FormData) => {
    const { role, ...rest} = validationConform(formData, CreateUserSchema);
    const fullName = Service.utils.concatFullname({...rest});
    const password = Service.utils.generateString(8);
    const passwordSalted = await hash(password, 10);

    const dataToSave = {
        ...rest,
        fullName,
        password: passwordSalted,
        roleId: role
    }

    const userSaved =  await Repository.user.createOne(dataToSave);

    if(!userSaved) {
        throw ServerError.internalServer(`No se pudo crear el usuario ${fullName}`);
    }

    return password;
}

// export const updateOne = async (id: RequestId, formData: FormData) => {

// }

export const updatePersonalData = async (id: RequestId, formData: FormData) => {

    const { id: idVal } = validationZod({ id }, idSchema);
    const data =  validationConform(formData, UpdateUserSchema);

    const userUpdated = await Repository.user.updatePersonalData(idVal, data);

    if(!userUpdated) {
        throw ServerError.internalServer('No se pudo actualizar el usuario');
    }

}
 
export const updatePassword = async (id: RequestId, formData: FormData) => {
    const { id: idVal } = validationZod({ id }, idSchema);
    const { password } =  validationConform(formData, UpdatePasswordSchema);

    const passwordSalted = await hash(password, 10);

    const userUpdated =  await Repository.user.updatePassword(idVal, passwordSalted);

    if(!userUpdated) {
        throw ServerError.internalServer('No se pudo actualizar la contraseña');
    }
}

export const updateRole = async (id: RequestId, formData: FormData) => {
    const { id: idVal } = validationZod({ id }, idSchema);
    const { role } =  validationConform(formData, UpdateRoleSchema);

    const userUpdated = await Repository.user.updateRole(idVal, role);

    if(!userUpdated) {
        throw ServerError.internalServer('No se pudo actualizar el rol del usuario');
    }
}

export const updateAvatar = async (id: RequestId, avatar: string) => {
    const { id: idVal } = validationZod({ id }, idSchema);
    const userUpdated = await Repository.user.updateAvatar(idVal, avatar);

    if(!userUpdated) {
        throw ServerError.internalServer('No se pudo actualizar el avatar del usuario');
    }
}

export default {
    findAutocomplete,
    updateIsActive,
    updatePersonalData,
    updatePassword,
    updateRole,
    updateAvatar,
    findOne,
    findAll,
    createOne,
}
