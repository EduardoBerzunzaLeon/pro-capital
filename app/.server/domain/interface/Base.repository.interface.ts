
import { Generic } from "~/.server/interfaces";
import { PaginationWithFilters } from ".";

export interface FindManyWithPaginatorProps<P,S> {
    paginatonWithFilter: PaginationWithFilters
    searchParams?: P,
    select?: S,
}

export interface FindManyProps<P,S,O> {
    searchParams?: P,
    select?: S,
    orderBy?: O,
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

export interface BaseRepositoryI<T, P, S, D, C, O> {
    findOne: (searchParams: P, select?: S, isUnique?: boolean) => Promise<Generic | undefined>,
    findManyPaginator: ({ searchParams, select, paginatonWithFilter }: FindManyWithPaginatorProps<P,S>) => Promise<ResponseWithMetadata>,
    findManyByReportExcel: ({ searchParams, select, paginatonWithFilter}: FindManyWithPaginatorProps<P,S>) => Promise<Generic[] | undefined>,
    findMany: ({ searchParams, select, take }: FindManyProps<P,S, O>) => Promise<Generic[] | undefined>,
    updateOne: (searchParams: P, data: D) => Promise<Generic | undefined>,
    updateMany: (searchParams: P, data: D) => Promise<Generic | undefined>,
    deleteOne: (searchParams: P) => Promise<Generic | undefined>,
    deleteMany: (searchParams: P) => Promise<Generic | undefined>,
    createOne: (data: C) => Promise<Generic | undefined>,
    createMany: (data: C[], skipDuplicates: boolean) => Promise<Generic | undefined>,
    createManyAndReturn: (data: C[], skipDuplicates: boolean) => Promise<Generic[] | undefined>,
    entity: T
}

export interface GenericRepository<T, P, S, D, C, O> {
    base: BaseRepositoryI<T, P, S, D, C, O>
}