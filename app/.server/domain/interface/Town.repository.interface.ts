import { Generic } from "~/.server/interfaces";
import { PaginationWithFilters } from "./Pagination.interface";
import { Prisma } from "@prisma/client";
import { BaseRepositoryI, ResponseWithMetadata } from ".";

export interface UpdateTownProps {
    name: string,
    municipalityId: number
}

export type BaseTownI = BaseRepositoryI<
    Prisma.TownDelegate, 
    Prisma.TownWhereInput, 
    Prisma.TownSelect,
    Prisma.XOR<Prisma.TownUpdateInput, Prisma.TownUncheckedUpdateInput>,
    Prisma.XOR<Prisma.TownCreateInput, Prisma.TownUncheckedCreateInput>,
    Prisma.TownOrderByWithRelationInput | Prisma.TownOrderByWithRelationInput[]
>;

export interface TownRepositoryI {
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findAutocomplete: (name: string) => Promise<Generic[] | undefined>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findIfExists: (name: string) => Promise<Generic | undefined>,
    findIfHasFolders: (id: number) => Promise<Generic | undefined>,
    findByReport: (paginationData: PaginationWithFilters) => Promise<Generic | undefined>,
    updateOne: (id: number, data: UpdateTownProps) => Promise<Generic | undefined>,
    deleteOne: (id: number) => Promise<Generic | undefined>
    createOne: (name: string, municipalityId: number) => Promise<Generic | undefined>,
    base: BaseTownI
}

