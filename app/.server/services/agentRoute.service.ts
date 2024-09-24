import { idSchema } from "~/schemas";
import { Service } from ".";
import { Repository } from "../adapter";
import { AgentRoute } from "../domain/entity/agentRoute.entity";
import { PaginationWithFilters } from "../domain/interface";
import { RequestId } from "../interfaces";
import { validationZod } from "./validation.service";
import { ServerError } from "../errors";

interface CreateManyProps {
    routeId: RequestId;
    agentIds: number[];
    assignAt: Date;
}

interface DeleteManyProps {
    routeId: number;
    agentIds: number[];
    assignAt: Date;
}

export const findAll = async (props: PaginationWithFilters) => {
    const { data, metadata } =  await Repository.agentRoute.findAll({...props});

    return Service.paginator.mapper({
        metadata,
        data, 
        mapper: AgentRoute.mapper,
        errorMessage: 'No se encontraron localidades'
    });
    
}

export const deleteOne = async (id: RequestId) => {
    const { id: agentRouteId } = validationZod({ id }, idSchema);
    const agentRoute = await Repository.agentRoute.deleteOne(agentRouteId);
    if(!agentRoute) throw ServerError.notFound('No se encontro el agente-ruta');
}

export const createMany = async ({routeId, agentIds, assignAt}: CreateManyProps) => {

    if(agentIds.length === 0 || !assignAt) {
        // TODO: DO this with zod or conform
        throw ServerError.badRequest('Todos los campos son requeridos');
    }

    const { id } = validationZod({ id: routeId }, idSchema);
    
    await deleteMany({
        routeId: id,
        assignAt,
        agentIds
    });

    const data = agentIds.map(agentId => ({ routeId: id, userId: agentId, assignAt}));
    await Repository.agentRoute.createMany(data);
}

const deleteMany = async ({routeId, agentIds, assignAt}: DeleteManyProps) => {
    const [ deletedById, deletedByRoutes ] = await Promise.all([
        Repository.agentRoute.deleteMany(agentIds, assignAt),
        Repository.agentRoute.deleteManyByRoute(routeId, assignAt),
    ]);

    console.log({deletedById, deletedByRoutes, assignAt, agentIds});

    if(!deletedById || !deletedByRoutes) {
        throw ServerError.internalServer('No se pudo desasignar los agentes a sus rutas anteriores');
    }
}

export const findAgentsAutocomplete = async (fullname: string, assignAt: Date) => {
    const agents = await Repository.agentRoute.findAgents(fullname, assignAt);
    return agents;
    // return Service.dto.autocompleteMapper('id', 'fullName', agents);
}

export const findMany = async (routeId: RequestId, assignAt: Date) => {

    if(!routeId || !assignAt) return [];
    
    const { id } = validationZod({ id: routeId }, idSchema);
    
    return Repository.agentRoute.findMany(id, assignAt);
}

export default {
    findAll, 
    deleteOne, 
    createMany, 
    findAgentsAutocomplete, 
    findMany, 
}


