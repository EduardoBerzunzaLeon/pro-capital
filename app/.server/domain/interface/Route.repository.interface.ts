import { Generic } from '~/.server/interfaces';
import { Prisma } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';


export type BaseRouteI = BaseRepositoryI<
    Prisma.RouteDelegate, 
    Prisma.RouteWhereInput, 
    Prisma.RouteSelect,
    Prisma.XOR<Prisma.RouteUpdateInput, Prisma.RouteUncheckedUpdateInput>,
    Prisma.XOR<Prisma.RouteCreateInput, Prisma.RouteUncheckedCreateInput>,
    Prisma.RouteOrderByWithRelationInput | Prisma.RouteOrderByWithRelationInput[]
>;


export interface RouteRepositoryI{
    findLastRoute: () => Promise<number>,
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findByReport: (paginationData: PaginationWithFilters ) => Promise<Generic[] | undefined>,
    findMany: () => Promise<Generic | undefined>,
    findIsActive: (id: number) => Promise<Generic | undefined>,
    findCountFolders: (id: number) => Promise<Generic | undefined>,
    updateIsActive: (id: number, isActive: boolean) => Promise<Generic | undefined>,
    deleteOne: (id:number) => Promise<Generic | undefined>
    createOne: (name: number) => Promise<Generic | undefined>,
    base: BaseRouteI
}

