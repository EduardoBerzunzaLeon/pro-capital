import { PaginationProps } from "~/.server/adapter/repository/pagination/pagination.interface";
import { MunicipalityI } from "../entity";
import { PaginationI } from "./Pagination.interface";

export interface MunicipalityRepositoryI {
    findAll: ({ page, limit, column, direction }: PaginationProps) => Promise<PaginationI<MunicipalityI>>,
    findOne: (id: number) => Promise<MunicipalityI>,
    createOne: (name: string) => Promise<MunicipalityI>,
    deleteOne: (id: number) => Promise<void>,
    updateOne: (id: number, name: string) => Promise<void>,
}