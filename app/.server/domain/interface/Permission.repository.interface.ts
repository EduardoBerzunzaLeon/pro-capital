import { Prisma } from "@prisma/client";
import { BaseRepositoryI, ResponseWithMetadata } from "./Base.repository.interface";
import { PaginationWithFilters } from "./Pagination.interface";
import { Generic } from "~/.server/interfaces";

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
    findByReport: (paginationData: PaginationWithFilters) => Promise<Generic[] | undefined>,
    unassignRole: (roleId: number, permissionId: number) => Promise<Generic | undefined>,
    assignRole: (roleId: number, permissionId: number) => Promise<Generic | undefined>,
    base: BasePermissionI
}


