import { BasePaymentDetailI, CreatePayment, PaginationWithFilters, PaymentRepositoryI, UpdatePayment } from "~/.server/domain/interface";
import { db } from "../../db";


export function PaymentRepository(base: BasePaymentDetailI): PaymentRepositoryI {

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
                        id: true,
                        currentDebt: true,
                        nextPayment: true,
                        lastPayment: true,
                        status: true,
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

    async function findLastPayment(creditId: number) {

        return await base.findMany({
            searchParams: { creditId },
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
            agent: {
                select: {
                    id: true,
                    fullName: true,
                    avatar: true
                }
            },
            folio: true,
            status: true,
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
                    client: {
                        select: {
                            fullname: true,
                        }
                    },
                    folder: {
                        select: {
                            name: true,
                        }
                    },
                    group: {
                        select: {
                            name: true
                        }
                    }

                }
            }
        }, true);
    }

    async function findTotalPayment(creditId: number) {
        return await base.entity.groupBy({
            by: ['creditId'],
            where: { creditId },
            _sum: {
                paymentAmount: true
            },
            _count: {
                paymentAmount: true
            }
        })
    }

    async function findByRangeDates(start: Date, end: Date, folderId?: number) {
        const data = await base.entity.aggregate({
            where: {
                paymentDate: {
                    gte: start,
                    lte: end
                },
                credit: {
                    folderId,
                }
            },
            _count: true,
            _sum: {
                paymentAmount: true
            },
        })

        return data;
    }

    async function findAllPaymentsByFolders(start: Date, end: Date) {
        const data = await db.$queryRaw`SELECT
                    b."folderId",
                    COUNT(a."id") as counter,
                    sum(a."paymentAmount") as sumatory
                FROM
                    "PaymentDetail" as a
                    LEFT JOIN "Credit" as b on b.id = a."creditId"
                WHERE
                    a."paymentDate" 
                    BETWEEN ${start} AND ${end}
                GROUP BY
                b."folderId"`;

        return data as { folderId: number, counter: number, sumatory: number }[];
    }

    return {
        findAll,
        findByDate,
        deleteOne,
        findOne,
        createOne,
        updateOne,
        findLastPayment,
        findTotalPayment,
        findByRangeDates,
        findAllPaymentsByFolders,
        base
    }

}