import { Prisma } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';
import { Generic } from '~/.server/interfaces';

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
    findLastCredit: (curp: string) => Promise<Generic[] | undefined>,
    base: BaseCreditI
}

