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

    // async function findByDate(creditId: number, paymentDate: Date) {
    //     return await base.findOne({ creditId, paymentDate }, { id: true });
    // }


    async function createOne( data: CreatePayment) {
        return await base.createOne(data);
    }

    async function findOne(id: number) {
        return await base.findOne({ 
            id,
            credit: {
                payment_detail: {
                    some: { id: { not: id } }
                }
            } 
        }, {
            paymentAmount: true,
            creditId: true,
            paymentDate: true,
            credit: {
                select: {
                    currentDebt: true,
                    totalAmount: true,
                    status: true,
                    paymentAmount: true,
                    creditAt: true,
                    type: true,
                    isRenovate: true,
                    payment_detail: {
                        select: {
                            paymentDate: true,
                            id: true,
                            
                        }
                    }
                }
            }
        }, true);
    }

    return {
        findAll,
        // findByDate,
        findOne,
        createOne,
        base
    }

}