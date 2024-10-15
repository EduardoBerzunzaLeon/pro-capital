import { Prisma, Status, Type } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';
import { Generic } from '~/.server/interfaces';

export interface CreditCreateI {
    avalId: number,
    clientId: number,
    groupId: number, 
    folderId: number,
    type: Type,
    amount: number,
    paymentAmount: number,
    totalAmount: number,
    creditAt: Date,
    clientGuarantee: string,
    avalGuarantee: string,
    nextPayment: Date,
    currentDebt: number
    status: Status
}

export type BaseCreditI = BaseRepositoryI<
    Prisma.CreditDelegate, 
    Prisma.CreditWhereInput, 
    Prisma.CreditSelect,
    Prisma.XOR<Prisma.CreditUpdateInput, Prisma.CreditUncheckedUpdateInput>,
    Prisma.XOR<Prisma.CreditCreateInput, Prisma.CreditUncheckedCreateInput>,
    Prisma.CreditOrderByWithRelationInput | Prisma.CreditOrderByWithRelationInput[]
>;

export interface CreditRepositoryI{
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findByCurp: (curp: string) => Promise<Generic | undefined>,
    findCredit: (id: number) => Promise<Generic | undefined>,
    findCredits: (curp: string) => Promise<Generic[] | undefined>,
    findByRenovate: (id: number, curp: string) => Promise<Generic | undefined>,
    createOne: (credit: CreditCreateI) => Promise<Generic | undefined>,
    exportLayout: (folderName: string, groupName: number) => Promise<Generic | undefined>,
    updateStatus: (id: number, status: Status) => Promise<Generic | undefined>,
    base: BaseCreditI
}