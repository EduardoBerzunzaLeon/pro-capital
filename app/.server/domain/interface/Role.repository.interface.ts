import { Generic } from '~/.server/interfaces';
import { Prisma, RoleTypes } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';


export type BaseRoleI = BaseRepositoryI<
    Prisma.RoleDelegate, 
    Prisma.RoleWhereInput, 
    Prisma.RoleSelect,
    Prisma.XOR<Prisma.RoleUpdateInput, Prisma.RoleUncheckedUpdateInput>,
    Prisma.XOR<Prisma.RoleCreateInput, Prisma.RoleUncheckedCreateInput>,
    Prisma.RoleOrderByWithRelationInput | Prisma.RoleOrderByWithRelationInput[]
>;


export interface RoleRepositoryI{
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findByReport: (paginationData: PaginationWithFilters ) => Promise<Generic[] | undefined>,
    findMany: () => Promise<Generic | undefined>,
    findById: (id: number) => Promise<Generic | undefined>,
    findPermission: (roleName: RoleTypes, permission: string) => Promise<Generic | undefined>,
    base: BaseRoleI
}


