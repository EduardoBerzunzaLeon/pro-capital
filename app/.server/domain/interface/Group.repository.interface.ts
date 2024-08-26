import { Generic } from '~/.server/interfaces';
import { GenericRepository } from '../../adapter/repository/base.repository.inteface';
import { Prisma } from '@prisma/client';

export interface GroupRepositoryI extends GenericRepository<
    Prisma.GroupDelegate, 
    Prisma.GroupWhereInput, 
    Prisma.GroupSelect,
    Prisma.$GroupPayload
> {
    deleteMany: (groupsId:number[]) => Promise<Generic | undefined>
    createOne: (name: number, folderId: number) => Promise<Generic | undefined>
}

