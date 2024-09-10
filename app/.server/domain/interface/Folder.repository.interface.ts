import { Generic } from '~/.server/interfaces';
import { Prisma } from '@prisma/client';
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from '.';


export type BaseFolderI = BaseRepositoryI<
    Prisma.FolderDelegate, 
    Prisma.FolderWhereInput, 
    Prisma.FolderSelect,
    Prisma.XOR<Prisma.FolderUpdateInput, Prisma.FolderUncheckedUpdateInput>,
    Prisma.XOR<Prisma.FolderCreateInput, Prisma.FolderUncheckedCreateInput>
>;


export interface FolderRepositoryI{
    findLastConsecutive: (townId: number) => Promise<number>,
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findAutocomplete: (name: string) => Promise<Generic[] | undefined>,
    findCountGroups: (id: number) => Promise<Generic | undefined>,
    updateOne: (id: number, routeId: number) => Promise<Generic | undefined>,
    deleteOne: (id:number) => Promise<Generic | undefined>
    createOne: (townId: number, routeId: number, consecutive: number, name: string) => Promise<Generic | undefined>,
    base: BaseFolderI
}

