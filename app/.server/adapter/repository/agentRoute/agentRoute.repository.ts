import { AgentRouteRepositoryI, BaseAgentRouteI, PaginationWithFilters } from "~/.server/domain/interface";
import { db } from "../../db";


export interface CreateOne {
    routeId: number,
    userId: number,
    assignAt: Date
}

export function AgentRouteRepository(base: BaseAgentRouteI): AgentRouteRepositoryI {

    async function findAll(paginationData: PaginationWithFilters ) {
        return await base.findManyPaginator({
            paginatonWithFilter: paginationData,
            select: {
                id: true,
                assignAt: true,
                user: {
                    select: { 
                        avatar: true,
                        fullName: true
                    }
                },
                route: {
                    select: {
                        name: true
                    }
                }
            }
        })
    }

    async function deleteOne(id: number) {
        return await base.deleteOne({ id });
    }

    async function deleteMany(ids: number[], assignAt: Date) {
        return await base.deleteMany({ 
            id: { in: ids }, 
            assignAt: {equals: assignAt} 
        });
    }

    async function createMany(data: CreateOne[]) {
        return await base.createMany(data, true);
    } 

    // TODO: move this to user repository
    //  TODO: Preguntar si traer todos los usuarios o solo los agentes

    async function findAgents() {
        return await db.user.findMany({
            where: {
                role: {
                    role: {
                        in: ['ADMIN', 'AGENT']
                    }
                },
                isActive: true
            },
            select: {
                fullName: true,
                id: true,
            }
        });
    }

    async function findMany(routeId: number, assignAt: Date) {
        return await base.findMany({
            searchParams: {
                routeId,
                assignAt
            },
            select: {
                user: {
                    select: {
                        fullName: true,
                        avatar: true,
                        id: true
                    }
                }
            }
        });
    }

    return { 
        findAll,
        findAgents,
        findMany,
        deleteOne,
        deleteMany,
        createMany,
        base
    }

}