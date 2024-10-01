import { BaseClientI, ClientCreateI, ClientRepositoryI } from "~/.server/domain/interface";

export function ClientRepository(base: BaseClientI): ClientRepositoryI{

    async function createOne(client: ClientCreateI) {

        console.log({client});
        return await base.createOne(client);
    }

    async function deleteOne(id: number) {
        return await base.deleteOne({id});
    }

    return {
        createOne,
        deleteOne
    }
}