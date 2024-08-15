import { MunicipalityI } from "../entity";

export interface Pagination {
    data: MunicipalityI[],
    total: number;
    pageCount: number;
    currentPage: number;
    nextPage: number | null;
}

export interface MunicipalityRepositoryI {
    findAll: (page: number, limit: number) => Promise<Pagination>,
    findOne: (id: number) => Promise<MunicipalityI>,
    createOne: (name: string) => Promise<MunicipalityI>,
    deleteOne: (id: number) => Promise<void>,
    updateOne: (id: number, name: string) => Promise<void>,
}