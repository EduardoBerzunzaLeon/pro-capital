import { PaginationProps } from "~/.server/adapter/repository/pagination/pagination.interface";
import { MunicipalityI } from "../entity";
import { PaginationI } from "./Pagination.interface";
interface Autocomplete {
    value: number;
    label: string;
}

export interface MunicipalityRepositoryI {
    findAll: ({ page, limit, column, direction }: PaginationProps) => Promise<PaginationI<MunicipalityI>>,
    findOne: (id: number) => Promise<MunicipalityI>,
    findByName: (name: string) => Promise<Autocomplete[]>,
    createOne: (name: string) => Promise<MunicipalityI>,
    deleteOne: (id: number) => Promise<void>,
    updateOne: (id: number, name: string) => Promise<void>,
}