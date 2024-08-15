import { Repository } from "../adapter/repository"

export const findAll = async (page: number = 1, limit: number = 2 ) => {
    return await Repository.municipality.findAll(page, limit);
}

export const findOne = async (id: number) => {
    return await Repository.municipality.findOne(id);
}

export const deleteOne = async (id: number) => {
    await Repository.municipality.deleteOne(id);
}

export const updateOne = async (id: number, name: string) => {
    await Repository.municipality.updateOne(id, name);
}

export const createOne = async (name: string) => {
    await Repository.municipality.createOne(name);
}

export default {
    findAll,
    findOne,
    deleteOne,
    updateOne,
    createOne,
}