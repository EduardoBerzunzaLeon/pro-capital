import { Prisma } from "@prisma/client";
import { BaseRepositoryI } from "./Base.repository.interface";
import { Generic } from "~/.server/interfaces";


export type BaseAvalI = BaseRepositoryI<
    Prisma.AvalDelegate, 
    Prisma.AvalWhereInput, 
    Prisma.AvalSelect,
    Prisma.XOR<Prisma.AvalUpdateInput, Prisma.AvalUncheckedUpdateInput>,
    Prisma.XOR<Prisma.AvalCreateInput, Prisma.AvalUncheckedCreateInput>,
    Prisma.AvalOrderByWithRelationInput | Prisma.AvalOrderByWithRelationInput[]
>;


export interface AvalRepositoryI{
    findAutocomplete: (curp: string) => Promise<Generic[] | undefined>,
    findOne: (id: number) => Promise<Generic | undefined>
}

