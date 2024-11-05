import { PaymentStatus, Prisma } from "@prisma/client"
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from ".";
import { Generic } from "~/.server/interfaces";

export interface CreatePayment {
    creditId: number,
    agentId: number,
    status: PaymentStatus,
    paymentDate: Date,
    paymentAmount: number,   
    folio?: number,
    notes?: string,
}

export type UpdatePayment = Omit<CreatePayment, 'creditId'>;

export type BasePaymentDetailI = BaseRepositoryI<
    Prisma.PaymentDetailDelegate, 
    Prisma.PaymentDetailWhereInput, 
    Prisma.PaymentDetailSelect,
    Prisma.XOR<Prisma.PaymentDetailUpdateInput, Prisma.PaymentDetailUncheckedUpdateInput>,
    Prisma.XOR<Prisma.PaymentDetailCreateInput, Prisma.PaymentDetailUncheckedCreateInput>,
    Prisma.PaymentDetailOrderByWithRelationInput | Prisma.PaymentDetailOrderByWithRelationInput[]
>;

export interface PaymentRepositoryI {
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findByDate: (creditId: number, paymentDate: Date) => Promise<Generic | undefined>
    deleteOne: (id: number) => Promise<Generic | undefined>,
    createOne: (data: CreatePayment) => Promise<Generic | undefined>,
    updateOne: (id: number, data: UpdatePayment) => Promise<Generic | undefined>,
    base: BasePaymentDetailI
    
}
