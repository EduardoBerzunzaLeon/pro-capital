import { Repository } from "../adapter";
import { ClientCreateI } from "../domain/interface";


export const createOne = async (client: ClientCreateI) => {
    return await Repository.client.createOne(client);
}

export const deleteOne = async (id: number) => {
    return await Repository.client.deleteOne(id);
}

export default {
    createOne,
    deleteOne
}
