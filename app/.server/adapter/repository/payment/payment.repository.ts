import { BasePaymentDetailI, CreatePayment, PaginationWithFilters, UpdatePayment } from "~/.server/domain/interface";


export function PaymentRepository(base: BasePaymentDetailI) {

    async function findAll(paginationData: PaginationWithFilters) {
        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                agent: {
                    select: {
                        id: true,
                        avatar: true,
                        fullName: true,
                    }
                },
                paymentAmount: true,
                paymentDate: true,
                captureAt: true,
                folio: true,
                notes: true,
                status: true,
                credit: {
                    select: {
                        currentDebt: true,
                        client: {
                            select: {
                                fullname: true,
                                curp: true
                            }
                        },
                        aval: {
                            select: {
                                fullname: true,
                                curp: true
                            }
                        },
                        group: {
                            select: {
                                name: true
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
                                },
                            }
                        }
                    }
                }
            }
        })
    }

    async function findByDate(creditId: number, paymentDate: Date) {
        return await base.findOne({ creditId, paymentDate }, { id: true });
    }

    async function createOne( data: CreatePayment) {
        return await base.createOne(data);
    }

    async function updateOne(id: number, data: UpdatePayment) {
        return await base.updateOne({id}, data);
    }

    async function deleteOne(id: number) {
        return await base.deleteOne({id});
    }

    async function findLastPayment(creditId: number, paymentId: number) {

        return await base.findMany({
            searchParams: { creditId, id: { not: paymentId } },
            select: {
                id: true,
                paymentDate: true,
            },
            orderBy: {
                paymentDate: 'desc'
            },
            take: 1
        });

    }

    async function findOne(id: number) {
        return await base.findOne({ id }, 
        {
            id: true,
            paymentAmount: true,
            paymentDate: true,
            credit: {
                select: {
                    id: true,
                    currentDebt: true,
                    totalAmount: true,
                    status: true,
                    paymentAmount: true,
                    lastPayment: true,
                    creditAt: true,
                    type: true,
                    isRenovate: true,
                }
            }
        }, true);
    }

    return {
        findAll,
        findByDate,
        deleteOne,
        findOne,
        createOne,
        updateOne,
        findLastPayment,
        base
    }

}