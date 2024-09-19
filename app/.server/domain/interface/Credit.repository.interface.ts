import { Prisma } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';

export type BaseCreditI = BaseRepositoryI<
    Prisma.CreditDelegate, 
    Prisma.CreditWhereInput, 
    Prisma.CreditSelect,
    Prisma.XOR<Prisma.CreditUpdateInput, Prisma.CreditUncheckedUpdateInput>,
    Prisma.XOR<Prisma.CreditCreateInput, Prisma.CreditUncheckedCreateInput>
>;

export interface CreditRepositoryI{
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    base: BaseCreditI
}

