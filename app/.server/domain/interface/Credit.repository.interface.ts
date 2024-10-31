import { Prisma, Status, Type } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';
import { Generic } from '~/.server/interfaces';

export type UpdateCreateI = {
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
    currentDebt: number,
    status: Status
    previousCreditId?: number,
    paymentForgivent: number,
}

export type CreditCreateI = Omit<UpdateCreateI, 'paymentForgivent' | 'previousCreditId' >

export interface UpdatePreviousData {
    status: Status,
    previousStatus: Status,
    canRenovate: boolean
}

export interface UpdateOne {
    amount: number,
    avalGuarantee: string,
    canRenovate: boolean,
    clientGuarantee: string,
    currentDebt: number,
    folderId: number,
    groupId: number, 
    paymentAmount: number,
    status: Status,
    totalAmount: number,
    type: Type,
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
    verifyCredit: (id: number, folderId: number) => Promise<Generic | undefined>,
    createOne: (credit: CreditCreateI) => Promise<Generic | undefined>,
    exportLayout: (folderName: string, groupName: number) => Promise<Generic | undefined>,
    updatePrevious: (id: number, data: UpdatePreviousData) => Promise<Generic | undefined>,
    updateOne: (id: number, data: UpdateOne) => Promise<Generic | undefined>,
    verifyFolderInCredit: (curp: string, folderId: number) => Promise<Generic | undefined>,
    findCreditForDelete: (id: number) => Promise<Generic | undefined>,
    findDetailsCredit: (id: number) => Promise<Generic | undefined>,
    findCreditToUpdate: (id: number) => Promise<Generic | undefined>,
    deleteOne: (id: number) => Promise<Generic | undefined>
    verifyClientCurp: (idClient: number, curp: string) => Promise<Generic[] | undefined>,
    verifyAvalCurp: (idClient: number, curp: string) => Promise<Generic[] | undefined>
    base: BaseCreditI
}