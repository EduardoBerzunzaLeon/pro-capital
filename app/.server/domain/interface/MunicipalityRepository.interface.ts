
import { MunicipalityI } from "../entity";
import { PaginationI, PaginationProps } from "./Pagination.interface";
import { Autocomplete } from "~/.server/interfaces";


export interface MunicipalityRepositoryI {
    findAll: (props: PaginationProps) => Promise<PaginationI<MunicipalityI>>,
    findOne: (id: number) => Promise<MunicipalityI>,
    findByName: (name: string) => Promise<Autocomplete[]>,
    createOne: (name: string) => Promise<MunicipalityI>,
    deleteOne: (id: number) => Promise<void>,
    updateOne: (id: number, name: string) => Promise<void>,
}