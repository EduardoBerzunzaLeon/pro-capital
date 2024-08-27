import { Prisma } from "@prisma/client"
import { GenericRepository, ResponseWithMetadata } from "~/.server/adapter/repository/base.repository.inteface"
import { Generic } from "~/.server/interfaces"
import { PaginationWithFilters } from "./Pagination.interface"

export interface MunicipalityRepositoryI extends GenericRepository<
    Prisma.MunicipalityDelegate, 
    Prisma.MunicipalityWhereInput, 
    Prisma.MunicipalitySelect,
    Prisma.$MunicipalityPayload
> {
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findAutocomplete: (name: string) => Promise<Generic[] | undefined>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findIfExists: (name: string) => Promise<Generic | undefined>,
    findIfHasTowns: (id: number) => Promise<Generic | undefined>,
    updateOne: (id: number, name: string) => Promise<Generic | undefined>,
    deleteOne: (id: number) => Promise<Generic | undefined>
    createOne: (name: string) => Promise<Generic | undefined>
}
