import { BaseCreditI, CreditRepositoryI, PaginationWithFilters } from "~/.server/domain/interface";

export function CreditRepository(base: BaseCreditI): CreditRepositoryI {


    async function findAll(paginationData: PaginationWithFilters) {

        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                aval: {
                    select: {
                        fullname: true,
                        address: true,
                        reference: true,
                        curp: true,
                    }
                },
                client: {
                    select: {
                        fullname: true,
                        address: true,
                        reference: true,
                        curp: true,
                    }
                },
                group: {
                    select: {
                        name: true,
                    }
                },
                folder: {
                    select: {
                        name: true,
                        town: {
                            select: {
                                name: true,
                                municipality: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        route: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                amount: true,
                paymentAmount: true,
                captureAt: true,
                creditAt: true,
                canRenovate: true,
                nextPayment: true,
                lastPayment: true,
                currentDebt: true,
                status: true
            }
        })
    


    }

    async function findByCurp(curp: string) {
        return await base.findOne({ client: { curp } }, { 
            id: true, 
            client: {
                select: { isDeceased: true }
            }
        });
    }

    async function findLastCredit(curp: string) {

        return await base.findMany({ 
            searchParams: { client: { curp }},
            select: {
                id: true,
                totalAmount: true,
                currentDebt: true,
                paymentAmount: true,
                client: {
                    select: {
                        fullname: true
                    }
                }
            },
            orderBy: {
                creditAt: 'desc'
            },
            take: 1
        });
    }

    return {
        findAll,
        findByCurp,
        findLastCredit,
        base
    }

}