import { ServerError } from "~/.server/errors";
import { TownI } from "./town.entity";

interface RouteI {
    id: number;
    name: string;
    isActive: boolean;
    agentsRoute?: string[]; // TODO: add agentsRoute interface
    folders?: FolderI[]
}

interface LeaderI {
    name: string;
    lastNameFirst: string;
    lastNameSecond?: string | null;
}

interface Count {
    groups: number
}

export interface FolderI {
    id: number;
    name: string;
    town: Pick<TownI, 'name' | 'municipality'>;
    route: Pick<RouteI, 'name'>;
    groups?: string[] //TODO: add group interface
    leader?: LeaderI | null; //TODO: add leader interface
    credits?: string[]; //TODO: add credit Interface
    _count?: Count;
}


export class Folder {

    public readonly id: number;
    public readonly name: string;
    public readonly town: string;
    public readonly municipality: string;
    public readonly route: string;
    public readonly count: number;
    public readonly leader: string;
    public readonly groups?: string[];
    public readonly credits?: string[];

    private constructor({
        id,
        name,
        town,
        municipality,
        route,
        groups,
        leader,
        credits,
        count,
    }: Folder) {
        this.id = id;
        this.name = name;
        this.count = count;
        this.town = town;
        this.municipality = municipality;
        this.route = route;
        this.groups = groups;
        this.leader = leader;
        this.credits = credits;
    }

    static mapper(folders: Partial<FolderI>[]) {
        return  folders.map(Folder.create);
    }

    static create(folder: Partial<FolderI>) {
        const {
            id,
            name,
            town,
            route,
            groups,
            leader,
            credits,
            _count,
        } =  folder;

        if(!name || typeof name !== 'string' ) throw ServerError.badRequest('el nombre es requerido');

        if(!id || typeof id !== 'number') throw ServerError.badRequest('el ID es requerido');

        if(!town)  throw ServerError.badRequest('La localidad es requerida');
        if(!town.municipality?.name)  throw ServerError.badRequest('El municipio es requerido');
        if(!route)  throw ServerError.badRequest('La ruta es requerida');
        if(!route)  throw ServerError.badRequest('el ID es requerido');
        
        const townName = town.name;
        const municipalityName = town.municipality.name;
        const routeName = route.name;
        const leaderName = leader?.name ? `${leader?.name} ${leader?.lastNameFirst}` : '';
        const countGroup = _count?.groups || 0; 


        return new Folder({
            id, 
            name, 
            town: townName, 
            route: routeName, 
            municipality: municipalityName,
            leader: leaderName, 
            count: countGroup,
            credits, 
            groups, 
        });
    }

}
