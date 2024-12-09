import { Prisma } from "@prisma/client"
import { Generic } from "~/.server/interfaces"
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from ".";

export type BaseMunicipalityI = BaseRepositoryI<
    Prisma.MunicipalityDelegate, 
    Prisma.MunicipalityWhereInput, 
    Prisma.MunicipalitySelect,
    Prisma.XOR<Prisma.MunicipalityUpdateInput, Prisma.MunicipalityUncheckedUpdateInput>,
    Prisma.XOR<Prisma.MunicipalityCreateInput, Prisma.MunicipalityUncheckedCreateInput>,
    Prisma.MunicipalityOrderByWithRelationInput | Prisma.MunicipalityOrderByWithRelationInput[]
>;

export interface MunicipalityRepositoryI {
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findByReport: (paginationData: PaginationWithFilters ) => Promise<Generic[] | undefined>,
    findAutocomplete: (name: string) => Promise<Generic[] | undefined>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findIfExists: (name: string) => Promise<Generic | undefined>,
    findIfHasTowns: (id: number) => Promise<Generic | undefined>,
    updateOne: (id: number, name: string) => Promise<Generic | undefined>,
    deleteOne: (id: number) => Promise<Generic | undefined>
    createOne: (name: string) => Promise<Generic | undefined>
    base: BaseMunicipalityI
}
