import { Generic } from '~/.server/interfaces';
import { GenericRepository, ResponseWithMetadata } from '../../adapter/repository/base.repository.inteface';
import { PaginationWithFilters } from './Pagination.interface';
import { Prisma } from '@prisma/client';

export interface FolderRepositoryI extends GenericRepository<
    Prisma.FolderDelegate, 
    Prisma.FolderWhereInput, 
    Prisma.FolderSelect,
    Prisma.$FolderPayload
> {
    findLastConsecutive: (townId: number) => Promise<number>,
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findCountGroups: (id: number) => Promise<Generic | undefined>,
    updateOne: (id: number, routeId: number) => Promise<Generic | undefined>,
    deleteOne: (id:number) => Promise<Generic | undefined>
    createOne: (townId: number, routeId: number, consecutive: number, name: string) => Promise<Generic | undefined>
}

