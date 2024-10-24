import { BaseCreditI, CreditCreateI, CreditRepositoryI, PaginationWithFilters, UpdatePreviousData } from "~/.server/domain/interface";

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
        return await base.findOne({ client: {
            curp : {
                equals: curp,
                mode: 'insensitive'
            },} }, { 
                id: true, 
                client: {
                    select: { 
                        isDeceased: true,
                        name: true,
                        lastNameFirst: true,
                        lastNameSecond: true,
                        address: true,
                        phoneNumber: true,
                        curp: true,
                        reference: true,
                        fullname: true,
                    }
                }
            });
    }
    
    async function findByRenovate(id: number, curp: string) {
        return await base.findOne({ id, client: { curp } }, { 
            id: true, 
            client: {
                select: { isDeceased: true }
            }
        });
    }

    async function findCredits(curp: string) {
        return await base.findMany({
            searchParams: { client: { curp } },
            select: { id: true }
        });
    }

    async function verifyCredit(id: number, folderId: number) {
        return await base.findOne({
            id: { not: id }, 
            folderId,
            status: { not: { in: [ 
                'LIQUIDADO', 
                'FALLECIDO' 
            ]}}
        }, { id: true })
    } 

    async function verifyFolderInCredit(curp: string, folderId: number) {
        return await base.findOne({
            client: {
                curp: {
                    equals: curp,
                    mode: 'insensitive'
                }
            }, 
            folderId,
            status: { not: { in: ['LIQUIDADO'] } }
        }, { 
            id: true,
            status: true,
            creditAt: true
        });
    }

    async function findCredit(id: number) {

        return await base.findOne({ id },{
                id: true,
                totalAmount: true,
                currentDebt: true,
                paymentAmount: true,
                creditAt: true,
                amount: true,
                status: true,
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
                        id: true,
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
            }, true);
    }

    async function findDetailsCredit(id: number) {
        return await base.findOne({ id }, {
            id: true,
            totalAmount: true,
            currentDebt: true,
            paymentAmount: true,
            creditAt: true,
            captureAt: true,
            canRenovate: true,
            paymentForgivent: true,
            nextPayment: true,
            lastPayment: true,
            amount: true,
            status: true,
            type: true,
            avalGuarantee: true,
            clientGuarantee: true,
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
                    id: true,
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
                    id: true,
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
        })
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

    async function updatePrevious(id: number, data: UpdatePreviousData) {
        return await base.updateOne({ id }, { ...data });
    }

    async function findCreditForDelete(id: number) {
        return await base.findOne({ id }, {
            id: true,
            status: true, 
            previousStatus: true,
            client: {
                select: {
                    id: true,
                    curp: true,
                }
            },
            aval: {
                select: {
                    id: true,
                    curp: true,
                }
            },
            previousCreditId: true,
            payment_detail: {
                select: {
                    id: true
                }
            },
        })
    } 

    async function deleteOne(id: number) {
        return await base.deleteOne({ id });
    }


    async function verifyClientCurp(idClient: number, curp: string) {
        return await base.findMany({ 
            searchParams: { client: { id: idClient }, aval: { curp } },
            select: { aval: { select: { fullname: true } } } 
        });
    }
    
    async function verifyAvalCurp(idAval: number, curp: string) {
        return await base.findMany({ 
            searchParams: { aval: { id: idAval }, client: { curp } },
            select: { client: { select: { fullname: true } } } 
        });
    }

    return {
        createOne,
        deleteOne,
        exportLayout,
        findAll,
        findByCurp,
        findByRenovate,
        findCredit,
        findCreditForDelete,
        findCredits,
        findDetailsCredit,
        updatePrevious,
        verifyCredit,
        verifyClientCurp,
        verifyAvalCurp,
        verifyFolderInCredit,
        base
    }

}