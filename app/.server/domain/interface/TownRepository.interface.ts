// import { Autocomplete } from "~/.server/interfaces";
import { Autocomplete } from "~/.server/interfaces";
import { TownI } from "../entity/town.entity";
import { PaginationI, PaginationWithFilters } from "./Pagination.interface";

export interface UpdateTownProps {
    name: string,
    municipalityId: number
}


export interface TownRepositoryI {
    findAll: (props: PaginationWithFilters) => Promise<PaginationI<TownI>>,
    findOne: (id: number) => Promise<TownI>,
    findByName: (name: string) => Promise<Autocomplete[]>,
    // findByName: (name: string) => Promise<Autocomplete[]>,
    createOne: (name: string, municipalityId: number) => Promise<TownI>,
    deleteOne: (id: number) => Promise<void>,
    updateOne: (id: number, { name, municipalityId }: UpdateTownProps) => Promise<void>,
}

