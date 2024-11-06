import { BasePaymentDetailI, CreatePayment, PaginationWithFilters, UpdatePayment } from "~/.server/domain/interface";


export function PaymentRepository(base: BasePaymentDetailI) {

    // TODO: make this for other propuses
    async function findAll(paginationData: PaginationWithFilters) {
        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                agent: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                },
                paymentAmount: true,
                paymentDate: true,
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