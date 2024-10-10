import { BaseCreditI, CreditCreateI, CreditRepositoryI, PaginationWithFilters } from "~/.server/domain/interface";

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
                creditAt: true,
                folder: { 
                    select: {
                        id: true,
                        name: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                client: {
                    select: {
                        name: true,
                        lastNameFirst: true,
                        lastNameSecond: true,
                        address: true,
                        phoneNumber: true,
                        curp: true,
                        reference: true,
                        fullname: true,
                    }
                },
                aval: {
                    select: {
                        name: true,
                        lastNameFirst: true,
                        lastNameSecond: true,
                        address: true,
                        phoneNumber: true,
                        curp: true,
                        reference: true,
                        fullname: true,
                    }
                },
                payment_detail: {
                    select: {
                        id: true,
                        status: true,
                        paymentAmount: true,
                        paymentDate: true,
                        folio: true
                    }
                }
            },
            orderBy: {
                creditAt: 'desc'
            },
            take: 1
        });
    }

    async function exportLayout(folderName: string, groupName: number) {
        return await base.findMany({
            searchParams:  { folder: { name: folderName }, group: { name: groupName } },
            select: {
                id: true,
                totalAmount: true,
                currentDebt: true, 
                paymentAmount: true,
                amount: true,
                creditAt: true,
                clientGuarantee: true,
                avalGuarantee: true,
                client: {
                    select: {
                        fullname: true,
                        address: true,
                        phoneNumber: true,
                    }
                },
                aval: {
                    select: {
                        fullname: true,
                        address: true,
                        phoneNumber: true,
                    }
                },
                folder: {
                    select: {
                        name: true
                    }
                },
                group: {
                    select: {
                        name: true
                    }
                }
            }
        })
    }

    async function createOne(credit: CreditCreateI) {
        return await base.createOne(credit);
    }

    return {
        findAll,
        findByCurp,
        findLastCredit,
        createOne,
        exportLayout,
        base
    }

}