import { AvalCreateI, AvalRepositoryI, BaseAvalI, ClientUpdateByID } from "~/.server/domain/interface";

export function AvalRepository(base: BaseAvalI): AvalRepositoryI {

    async function findAutocomplete(curp: string) {
        return await base.findMany({
            searchParams: { curp: { startsWith: curp } },
            select: { id: true, curp: true }
        });
    }

    async function findOne(id: number) {
        return await base.findOne({ id }, {
            id: true,
            curp: true,
            name: true,
            lastNameFirst: true,
            lastNameSecond: true,
            fullname: true,
            address: true,
            reference: true,
            credits: {
                where: { status: { not: 'LIQUIDADO' } },
                select: {
                    status: true,
                    client: {
                        select: { fullname: true }
                    }
                }
            }
        }, true);
    }

    async function upsertOne(aval: AvalCreateI) {
        return await base.entity.upsert({
            where: { curp: aval.curp },
            update: { ...aval },
            create: { ...aval}
        })
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

    async function deleteOne(id: number) {
        return await base.deleteOne({id});
    }

    async function updateById(id: number, data: ClientUpdateByID) {
        return await base.updateOne({ id }, data);
    }

    async function updateDeceased(id: number, isDeceased: boolean) {
        return await base.updateOne({ id }, { isDeceased });
   }

    return {
        findAutocomplete,
        findOne,
        upsertOne,
        updateById,
        hasCredits,
        deleteOne,
        updateDeceased
    }
}