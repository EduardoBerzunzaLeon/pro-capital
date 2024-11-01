import { Generic } from '~/.server/interfaces';
import { Prisma } from '@prisma/client';
import { BaseRepositoryI } from '.';


export type BaseUserI = BaseRepositoryI<
    Prisma.UserDelegate, 
    Prisma.UserWhereInput, 
    Prisma.UserSelect,
    Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>,
    Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
    Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]
>;


export interface UserRepositoryI{
    findAutocomplete: (name: string) => Promise<Generic[] | undefined>,
    base: BaseUserI
}

