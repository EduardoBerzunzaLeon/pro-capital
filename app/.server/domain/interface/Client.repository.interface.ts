import { Prisma } from "@prisma/client";
import { BaseRepositoryI } from "./Base.repository.interface";
import { Generic } from "~/.server/interfaces";


export interface ClientCreateI  {
    name: string,
    lastNameFirst: string,
    lastNameSecond: string,
    fullname: string,
    address: string,
    reference: string,
    curp: string,
    phoneNumber?: string
}

export type BaseClientI = BaseRepositoryI<
    Prisma.ClientDelegate, 
    Prisma.ClientWhereInput, 
    Prisma.ClientSelect,
    Prisma.XOR<Prisma.ClientUpdateInput, Prisma.ClientUncheckedUpdateInput>,
    Prisma.XOR<Prisma.ClientCreateInput, Prisma.ClientUncheckedCreateInput>,
    Prisma.ClientOrderByWithRelationInput | Prisma.ClientOrderByWithRelationInput[]
>;


export interface ClientRepositoryI{
    createOne: (client: ClientCreateI) => Promise<Generic | undefined>
    deleteOne: (id: number) => Promise<Generic | undefined>
}

