// import { Autocomplete } from "~/.server/interfaces";
import { Folder } from "../entity/";
import { PaginationI, PaginationWithFilters } from "./Pagination.interface";

// export interface UpdateTownProps {
//     name: string,
//     municipalityId: number
// }

interface CreateFolderProps { 
    consecutive: number, 
    name: string, 
    townId: number, 
    routeId: number
}

export interface FolderRepositoryI {
    findAll: (props: PaginationWithFilters) => Promise<PaginationI<Folder>>,
    // TODO: refactorize any type
    findOne: (id: number) => Promise<any>,
    // findByName: (name: string) => Promise<Autocomplete[]>,
    createOne: (townId: number, routeId: number) => Promise<void>,
    deleteOne: (id: number) => Promise<void>,
    updateOne: (id:number, routeId: number) => Promise<void>,
    findNextConsecutive: (townId: number) => Promise<number>,
}

