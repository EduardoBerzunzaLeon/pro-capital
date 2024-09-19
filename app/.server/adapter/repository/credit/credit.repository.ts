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


    return {
        findAll,
        base
    }

}