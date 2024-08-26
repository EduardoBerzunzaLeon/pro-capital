import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";
import { Generic } from "~/.server/interfaces";

export interface FindManyWithPaginatorProps {
    paginatonWithFilter: PaginationWithFilters
    searchParams?: Generic,
    select?: Generic,
}

export interface FindManyProps {
    searchParams: Generic,
    select?: Generic,
    take?: number
}

export interface ResponseWithMetadata {
    data: Generic | undefined,
    metadata: Metadata
}

export interface Metadata {
    pageCount: number,
    total: number,
    page: number
    nextPage: number | null,
}

export interface BaseRepositoryI {
    findOne: (searchParams: Generic, select?: Generic, isUnique?: boolean) => Promise<Generic | undefined>,
    findManyPaginator: ({ searchParams, select, paginatonWithFilter }: FindManyWithPaginatorProps) => Promise<ResponseWithMetadata>,
    findMany: ({ searchParams, select, take }: FindManyProps) => Promise<Generic | undefined>,
    updateOne: (searchParams: Generic, data: Generic) => Promise<Generic | undefined>,
    deleteOne: (searchParams: Generic) => Promise<Generic | undefined>,
    deleteMany: (searchParams: Generic) => Promise<Generic | undefined>,
    createOne: (data: Generic) => Promise<Generic | undefined>,
    entity: Generic
}

export interface GenericRepository {
    base: BaseRepositoryI
}