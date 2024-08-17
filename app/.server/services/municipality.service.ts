import { municipalityDeleteSchema, municipalitySchema } from "~/schemas";
import { Repository } from "../adapter/repository"
import { validationConform } from "./validation.service";
import { municipalityCreateSchema } from "~/schemas/municipalitySchema";
import { PaginationProps } from "../adapter/repository/pagination/pagination.interface";


export const findAll = async (props: PaginationProps) => {
    return await Repository.municipality.findAll({...props});
}

export const findOne = async (id: number) => {
    return await Repository.municipality.findOne(id);
}

export const deleteOne = async (form: FormData) => {
    const { id } = validationConform(form, municipalityDeleteSchema);
    await Repository.municipality.deleteOne(id);
}

export const updateOne = async (form: FormData) => {
    const { id, name } = validationConform(form, municipalitySchema);
    await Repository.municipality.updateOne(id, name);
}

export const createOne = async (form: FormData) => {
    const { name } = validationConform(form, municipalityCreateSchema);
    await Repository.municipality.createOne(name);
}

export default {
    findAll,
    findOne,
    deleteOne,
    updateOne,
    createOne,
}