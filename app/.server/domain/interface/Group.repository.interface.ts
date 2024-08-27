import { Generic } from '~/.server/interfaces';
import { Prisma } from '@prisma/client';
import { BaseRepositoryI } from '.';


export type BaseGroupI = BaseRepositoryI<
    Prisma.GroupDelegate, 
    Prisma.GroupWhereInput, 
    Prisma.GroupSelect,
    Prisma.XOR<Prisma.GroupUpdateInput, Prisma.GroupUncheckedUpdateInput>,
    Prisma.XOR<Prisma.GroupCreateInput, Prisma.GroupUncheckedCreateInput>
>;

export interface GroupRepositoryI {
    deleteMany: (groupsId:number[]) => Promise<Generic | undefined>
    createOne: (name: number, folderId: number) => Promise<Generic | undefined>,
    base: BaseGroupI
}

