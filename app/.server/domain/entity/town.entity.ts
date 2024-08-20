import { ServerError } from "~/.server/errors";
import { MunicipalityI } from "./municipality.entity";


export interface TownI {
    id: number,
    name: string;
    municipality?: MunicipalityI;
    folders?:  string[]; //todo: add folders interface
}

export class Town {

    private constructor(
        readonly id: number,
        readonly name: string,
        readonly municipality?: MunicipalityI,
        readonly folders?: string[],
    ){}

    static mapper(towns: Partial<TownI>[]) {
        return  towns.map(Town.create);
    }

    static create(town: Partial<TownI>) {
        const { id, name, municipality, folders} = town;

        if(!name || typeof name !== 'string' ) throw ServerError.badRequest('el nombre es requerido');

        if(!id || typeof id !== 'number') throw ServerError.badRequest('el ID es requerido');

        return new Town(id, name, municipality, folders);
    }

}