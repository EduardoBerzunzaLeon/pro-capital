import { AgentRouteRepositoryI, BaseAgentRouteI, PaginationWithFilters } from "~/.server/domain/interface";
import { db } from "../../db";

export interface CreateOne {
    routeId: number,
    userId: number,
    createdById: number,
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

    async function findByReport(paginationData: PaginationWithFilters) {
        return await base.findManyByReportExcel({
            paginatonWithFilter: paginationData,
            select: {
                assignAt: true,
                user: {
                    select: { 
                        fullName: true
                    }
                },
                route: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                createdBy: {
                    select: {
                        fullName: true
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
            userId: { in: ids }, 
            assignAt
        });
    }

    async function deleteManyByRoute(routeId: number, assignAt: Date) {
        return await base.deleteMany({
            routeId,
            assignAt
        })
    }

    async function createMany(data: CreateOne[]) {
        return await base.createMany(data, true);
    } 

    // TODO: move this to user repository
    //  TODO: Preguntar si traer todos los usuarios o solo los agentes

    async function findAgents(fullname: string, assignAt: Date) {

        return await db.user.findMany({
            where: {
                role: {
                    role: {
                        in: ['ADMIN', 'ASESOR', 'SUPERVISOR']
                    }
                },
                fullName: {
                    contains: fullname
                },
                isActive: true
            },
            select: {
                fullName: true,
                id: true,
                avatar: true,
                email: true,
                username: true,
                agentsRoutes: {
                    where: {
                        assignAt: {
                            equals: assignAt
                        }
                    },
                    select: {
                        assignAt: true,
                        route: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            take: 10
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
                        email: true,
                        username: true,
                        id: true
                    }
                }
            }
        });
    }

    return { 
        findAll,
        findAgents,
        findByReport,
        findMany,
        deleteOne,
        deleteMany,
        deleteManyByRoute,
        createMany,
        base
    }

}