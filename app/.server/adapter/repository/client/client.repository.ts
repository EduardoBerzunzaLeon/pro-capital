import { BaseClientI, ClientCreateI, ClientRepositoryI, ClientUpdateByID, ClientUpdateI } from "~/.server/domain/interface";

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

    async function hasCredits(id: number) {
        return await base.findOne({ 
           id,
           credits: {
               some: {
                   totalAmount: {
                       gte: 0
                   }
               }
           } 
       }, { 
           id: true,
        })
   }

   async function updateById(id: number, data: ClientUpdateByID) {
        return await base.updateOne({ id }, data);
   }
   
   async function updateDeceased(id: number, isDeceased: boolean) {
        return await base.updateOne({ id }, { isDeceased });
   }

    return {
        createOne,
        deleteOne,
        hasCredits,
        updateById,
        updateDeceased,
        updateOne,
    }
}