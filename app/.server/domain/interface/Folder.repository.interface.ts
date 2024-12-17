import { Generic } from '~/.server/interfaces';
import { Prisma } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';

export interface CreateFolderI {
    townId: number,
    routeId: number,
    createdById: number,
    consecutive: number,
    name: string
}


export type BaseFolderI = BaseRepositoryI<
    Prisma.FolderDelegate, 
    Prisma.FolderWhereInput, 
    Prisma.FolderSelect,
    Prisma.XOR<Prisma.FolderUpdateInput, Prisma.FolderUncheckedUpdateInput>,
    Prisma.XOR<Prisma.FolderCreateInput, Prisma.FolderUncheckedCreateInput>,
    Prisma.FolderOrderByWithRelationInput | Prisma.FolderOrderByWithRelationInput[]
>;


export interface FolderRepositoryI{
    findLastConsecutive: (townId: number) => Promise<number>,
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findAutocomplete: (name: string) => Promise<Generic[] | undefined>,
    findByReport: (paginationData: PaginationWithFilters) => Promise<Generic[] | undefined>,
    findLastGroup: (id: number) => Promise<Generic | undefined>,
    findCountGroups: (id: number) => Promise<Generic | undefined>,
    findByNameAndGroup: (name: string, group: number) => Promise<Generic | undefined>,
    findSampleAll: () => Promise<Generic[] | undefined>,
    updateOne: (id: number, routeId: number) => Promise<Generic | undefined>,
    updateIsActive: (id: number, isActive: boolean) =>  Promise<Generic | undefined>,
    deleteOne: (id:number) => Promise<Generic | undefined>
    createOne: (data: CreateFolderI) => Promise<Generic | undefined>,
    base: BaseFolderI
}

