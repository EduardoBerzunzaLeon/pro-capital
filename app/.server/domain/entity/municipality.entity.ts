import { ServerError } from "~/.server/errors";

export interface MunicipalityI {
    id: number;
    name: string;
    towns?: string[]; //TODO: add town interface
}

export class Municipality {

    private constructor(
        readonly id: number,
        readonly name: string,
        readonly towns?: string[]
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