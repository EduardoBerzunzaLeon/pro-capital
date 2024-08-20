import {  idSchema, nameSchema } from "~/schemas";
import { Repository } from "../adapter/repository"
import { validationConform, validationZod } from "./validation.service";
import { PaginationProps } from "../adapter/repository/pagination/pagination.interface";
import { RequestDataGeneric, RequestId } from "../interfaces";


export const findAll = async (props: PaginationProps) => {
    return await Repository.municipality.findAll({...props});
}

export const findOne = async (id: RequestId) => {
    const { id: municipalityId } = validationZod({ id }, idSchema);
    return await Repository.municipality.findOne(municipalityId);
}

export const findByName = async (name: string) => {
    return await Repository.municipality.findByName(name);
}

export const deleteOne = async (id: RequestId) => {
    const { id: municipalityId } = validationZod({ id }, idSchema);
    await Repository.municipality.deleteOne(municipalityId);
}

export const updateOne = async ({ id, form }: RequestDataGeneric) => {
    const { name } = validationConform(form, nameSchema);
    const { id: municipalityId } = validationZod({ id }, idSchema);
    await Repository.municipality.updateOne(municipalityId, name);
}

export const createOne = async (form: FormData) => {
    const { name } = validationConform(form, nameSchema);
    await Repository.municipality.createOne(name);
}

export default {
    findAll,
    findOne,
    deleteOne,
    updateOne,
    createOne,
    findByName
}