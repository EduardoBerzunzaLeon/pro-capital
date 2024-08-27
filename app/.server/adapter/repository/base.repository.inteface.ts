import { PaginationWithFilters } from "~/.server/domain/interface/Pagination.interface";
import { Generic } from "~/.server/interfaces";

export interface FindManyWithPaginatorProps<P,S> {
    paginatonWithFilter: PaginationWithFilters
    searchParams?: P,
    select?: S,
}

export interface FindManyProps<P,S> {
    searchParams: P,
    select?: S,
    take?: number
}

export interface ResponseWithMetadata {
    data: Generic[] | [],
    metadata: Metadata
}

export interface Metadata {
    pageCount: number,
    total: number,
    currentPage: number
    nextPage: number | null,
}

export interface BaseRepositoryI<T, P, S, D> {
    findOne: (searchParams: P, select?: S, isUnique?: boolean) => Promise<Generic | undefined>,
    findManyPaginator: ({ searchParams, select, paginatonWithFilter }: FindManyWithPaginatorProps<P,S>) => Promise<ResponseWithMetadata>,
    findMany: ({ searchParams, select, take }: FindManyProps<P,S>) => Promise<Generic[] | undefined>,
    updateOne: (searchParams: P, data: D) => Promise<Generic | undefined>,
    deleteOne: (searchParams: P) => Promise<Generic | undefined>,
    deleteMany: (searchParams: P) => Promise<Generic | undefined>,
    createOne: (data: D) => Promise<Generic | undefined>,
    entity: T
}

export interface GenericRepository<T, P, S, D> {
    base: BaseRepositoryI<T, P, S, D>
}