import { ServerError } from "~/.server/errors";
import { TownI } from "./town.entity";

export interface MunicipalityI {
    id: number;
    name: string;
    towns?: TownI[];
}

export class Municipality {

    private constructor(
        readonly id: number,
        readonly name: string,
        readonly towns?: TownI[]
    ){}

    static mapper(municipalities: Partial<MunicipalityI>[]) {
        return  municipalities.map(Municipality.create);
    }

    static create(municipality: Partial<MunicipalityI>) {

        const { id, name, towns } = municipality;
        if(!name || typeof name !== 'string' ) throw ServerError.badRequest('el nombre es requerido');
        if(!id || typeof id !== 'number') throw ServerError.badRequest('el ID es requerido');
       
        return new Municipality(id, name, towns);

    }

}