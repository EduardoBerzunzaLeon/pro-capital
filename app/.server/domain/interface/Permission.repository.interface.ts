import { Prisma } from "@prisma/client";
import { BaseRepositoryI, ResponseWithMetadata } from "./Base.repository.interface";
import { PaginationWithFilters } from "./Pagination.interface";

export type BasePermissionI = BaseRepositoryI<
    Prisma.PermissionDelegate, 
    Prisma.PermissionWhereInput, 
    Prisma.PermissionSelect,
    Prisma.XOR<Prisma.PermissionUpdateInput, Prisma.PermissionUncheckedUpdateInput>,
    Prisma.XOR<Prisma.PermissionCreateInput, Prisma.PermissionUncheckedCreateInput>,
    Prisma.PermissionOrderByWithRelationInput | Prisma.PermissionOrderByWithRelationInput[]
>;

export interface PermissionRepositoryI{
    findAll: (paginationData: PaginationWithFilters) => Promise<ResponseWithMetadata>,
    base: BasePermissionI
}


