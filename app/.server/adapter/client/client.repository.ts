import { BaseClientI, ClientCreateI, ClientRepositoryI, ClientUpdateI } from "~/.server/domain/interface";

export function ClientRepository(base: BaseClientI): ClientRepositoryI{

    async function createOne(client: ClientCreateI) {
        return await base.createOne(client);
    }

    async function updateOne(curp: string, data: ClientUpdateI) {
        return await base.updateOne({ curp }, data );
    }

    async function deleteOne(id: number) {
        return await base.deleteOne({id});
    }

    return {
        createOne,
        deleteOne,
        updateOne
    }
}