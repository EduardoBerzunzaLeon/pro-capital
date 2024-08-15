export interface PaginationI<T> {
    data: T[],
    total: number;
    pageCount: number;
    currentPage: number;
    nextPage: number | null;
}