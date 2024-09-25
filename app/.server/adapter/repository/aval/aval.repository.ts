import { AvalRepositoryI, BaseAvalI } from "~/.server/domain/interface";



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

    return {
        findAutocomplete,
        findOne
    }
}