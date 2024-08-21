// import { Autocomplete } from "~/.server/interfaces";
import { Folder } from "../entity/";
import { PaginationI, PaginationWithFilters } from "./Pagination.interface";

// export interface UpdateTownProps {
//     name: string,
//     municipalityId: number
// }


export interface FolderRepositoryI {
    findAll: (props: PaginationWithFilters) => Promise<PaginationI<Folder>>,
    // findOne: (id: number) => Promise<TownI>,
    // findByName: (name: string) => Promise<Autocomplete[]>,
    // createOne: (name: string, municipalityId: number) => Promise<TownI>,
    // deleteOne: (id: number) => Promise<void>,
    // updateOne: (id: number, { name, municipalityId }: UpdateTownProps) => Promise<void>,
}

