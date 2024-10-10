import { BaseClientI, ClientCreateI, ClientRepositoryI } from "~/.server/domain/interface";

export function ClientRepository(base: BaseClientI): ClientRepositoryI{

    async function createOne(client: ClientCreateI) {
        return await base.createOne(client);
    }

    // TODO: implement update client with ID
    // async function upsertOne(client: ClientCreateI) {
    //     return await base.entity.upsert({
    //         where: { curp: client.curp },
    //         update: { ...client },
    //         create: { ...client }
    //     })
    // }

    async function deleteOne(id: number) {
        return await base.deleteOne({id});
    }

    return {
        createOne,
        deleteOne
    }
}