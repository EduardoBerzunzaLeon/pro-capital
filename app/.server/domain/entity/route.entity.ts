import { ServerError } from "~/.server/errors";
import { Folder } from "./folder.entity";


export interface RouteI {
    id: number,
    name: number,
    isActive: boolean,
    folders?: Folder[]
}


export class Route {

    public readonly id: number;
    public readonly name: number;
    public readonly isActive: boolean;
    public readonly folders?: Folder[]

    private constructor({
        id, name, isActive, folders
    }: Route) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
        this.folders = folders;
    }

    static mapper(routes: Partial<RouteI>[]) {
        return routes.map(Route.create);
    }

    static create(route: Partial<RouteI>) {

        const { id, name, isActive, folders} =  route;


        if(!name || typeof name !== 'number' ) throw ServerError.badRequest('El nombre es requerido');
        if(!id || typeof id !== 'number') throw ServerError.badRequest('El ID es requerido');
        if(typeof isActive !== 'boolean') throw ServerError.badRequest('El estatus activo es requerido');

        return new Route({ id, name, isActive, folders });

    }

}