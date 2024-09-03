import { BaseAgentRouteI, PaginationWithFilters } from "~/.server/domain/interface";

interface CreateOne {
    routeId: number,
    userId: number,
    assignAt: 
}

export function AgentRouteRepository(base: BaseAgentRouteI) {

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

    async function createMany() 

    return { 
        findAll,
        deleteOne 
    }

}