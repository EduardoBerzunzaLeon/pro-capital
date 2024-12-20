import { Prisma } from "@prisma/client";
import { BaseRepositoryI } from ".";
import { Generic } from "~/.server/interfaces";

export type BaseAuthI = BaseRepositoryI<
    Prisma.UserDelegate, 
    Prisma.UserWhereInput, 
    Prisma.UserSelect,
    Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>,
    Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
    Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[]
>;


export interface AuthRepositoryI {
    findByUserName: (username: string) => Promise<Generic | undefined>,
    findById: (id: number) => Promise<Generic | undefined>,
    base: BaseAuthI
}