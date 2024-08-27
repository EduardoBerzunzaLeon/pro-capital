import { ServerError } from "~/.server/errors";
import { MunicipalityI } from "./municipality.entity";
import { Folder } from "./folder.entity";


export interface TownI {
    id: number,
    name: string;
    municipality?: Partial<MunicipalityI>;
    folders?:  Folder[]; 
}

export class Town {

    private constructor(
        readonly id: number,
        readonly name: string,
        readonly municipality?: Partial<MunicipalityI>,
        readonly folders?: Folder[],
    ){}

    static mapper(towns: Partial<TownI>[]) {
        return  towns.map(Town.create);
    }

    static create(town: Partial<TownI>) {
        const { id, name, municipality, folders} = town;

        if(!name || typeof name !== 'string' ) throw ServerError.badRequest('El nombre es requerido');

        if(!id || typeof id !== 'number') throw ServerError.badRequest('El ID es requerido');

        return new Town(id, name, municipality, folders);
    }

}