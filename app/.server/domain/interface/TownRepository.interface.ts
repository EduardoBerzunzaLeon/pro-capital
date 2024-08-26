// import { Autocomplete } from "~/.server/interfaces";
import { Generic } from "~/.server/interfaces";
import { PaginationWithFilters } from "./Pagination.interface";
import { Prisma } from "@prisma/client";
import { GenericRepository, ResponseWithMetadata } from "~/.server/adapter/repository/base.repository.inteface";

export interface UpdateTownProps {
    name: string,
    municipalityId: number
}


export interface FolderRepositoryI extends GenericRepository<
    Prisma.TownDelegate, 
    Prisma.TownWhereInput, 
    Prisma.TownSelect,
    Prisma.$TownPayload
> {
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findAutocomplete: (name: string) => Promise<Generic | undefined>,
    findOne: (id: number) => Promise<Generic | undefined>,
    findIfExists: (name: string) => Promise<Generic | undefined>,
    findIfHasFolders: (id: number) => Promise<Generic | undefined>,
    updateOne: (id: number, data: UpdateTownProps) => Promise<Generic | undefined>,
    deleteOne: (id: number) => Promise<Generic | undefined>
    createOne: (name: string, municipalityId: number) => Promise<Generic | undefined>
}

