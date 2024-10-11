import { Repository } from "../adapter";
import { ClientCreateI, ClientUpdateI } from "../domain/interface";


export const createOne = async (client: ClientCreateI) => {
    return await Repository.client.createOne(client);
}

export const deleteOne = async (id: number) => {
    return await Repository.client.deleteOne(id);
}

export const updateOne = async (curp: string, data: ClientUpdateI) => {
    return await Repository.client.updateOne(curp, data);
}

export default {
    createOne,
    deleteOne,
    updateOne
}
