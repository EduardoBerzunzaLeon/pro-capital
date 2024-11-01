import { BasePaymentDetailI, CreatePayment, PaginationWithFilters } from "~/.server/domain/interface";


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

    return {
        findAll,
        findByDate,
        createOne,
        base
    }

}