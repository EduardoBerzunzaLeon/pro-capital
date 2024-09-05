export interface PaginationI<T> {
    data: T[],
    total: number;
    pageCount: number;
    currentPage: number;
    nextPage: number | null;
}


export interface PaginationProps  {
    page: number,
    limit: number,
    column: string,
    direction: string,
    search: string
}

export interface Filter {
    column: string,
    value: string | boolean | number | string[] | number[] | { start: Date, end: Date }
}

export interface PaginationWithFilters {
    page: number,
    limit: number,
    column: string,
    direction: string,
    search: Filter[]
}
