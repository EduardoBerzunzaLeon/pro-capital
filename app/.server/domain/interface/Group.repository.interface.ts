import { BaseRepositoryI } from '.';

import { Generic } from '~/.server/interfaces';
import { Prisma } from '@prisma/client';

export interface Group {
    id: number,
    name: number,
    folderId: number
}

export type CreateGroup = Omit<Group, 'id'> & { predecessorId: number };

export type BaseGroupI = BaseRepositoryI<
    Prisma.GroupDelegate, 
    Prisma.GroupWhereInput, 
    Prisma.GroupSelect,
    Prisma.XOR<Prisma.GroupUpdateInput, Prisma.GroupUncheckedUpdateInput>,
    Prisma.XOR<Prisma.GroupCreateInput, Prisma.GroupUncheckedCreateInput>,
    Prisma.GroupOrderByWithRelationInput | Prisma.GroupOrderByWithRelationInput[]
>;

export interface GroupRepositoryI {
    deleteMany: (groupsId:number[]) => Promise<Generic | undefined>
    createOne: (name: number, folderId: number) => Promise<Generic | undefined>,
    findGroupWithCredits: () => Promise<Generic[] | undefined>,
    updateSuccessor: (id: number, successorId: number) => Promise<Generic | undefined>,
    createMany: (groups: CreateGroup[]) => Promise<Generic[] | undefined>,
    base: BaseGroupI
}

