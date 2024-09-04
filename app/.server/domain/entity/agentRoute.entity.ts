import { ServerError } from "~/.server/errors";
import { Route } from "./route.entity";
import moment from 'moment';

interface PrepUser { avatar: string, fullName: string }

export interface AgentRouteI {
    id: number;
    route: Route;
    user: PrepUser;
    assignAt: Date;
}


export class AgentRoute {
    
    private constructor(
        readonly id: number,
        readonly route: Route,
        readonly user: PrepUser,
        readonly assignAt: string,
    ){}


    static mapper(agentsRoute: Partial<AgentRouteI>[]) {
        return agentsRoute.map(AgentRoute.create);
    }

    static create(agentRoute: Partial<AgentRouteI>) {

        const { id, route, user, assignAt } = agentRoute;

        if(!id) throw ServerError.badRequest('El ID es requerido');
        if(!route?.name) throw ServerError.badRequest('La ruta es requerida');
        if(!user?.fullName) throw ServerError.badRequest('El nombre del asesor es requerido');
        if(!assignAt) throw ServerError.badRequest('La fecha es requerida');

        const assignAtFormatted = moment(assignAt).format('YYYY-MM-DD');
        return new AgentRoute(id, route, user, assignAtFormatted);
    }
}