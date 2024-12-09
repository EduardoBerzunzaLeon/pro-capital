import { Prisma } from "@prisma/client";
import { BaseRepositoryI, PaginationWithFilters, ResponseWithMetadata } from ".";
import { Generic } from "~/.server/interfaces";
import { CreateOne } from "~/.server/adapter/repository/agentRoute/agentRoute.repository";

export type BaseAgentRouteI = BaseRepositoryI<
    Prisma.AgentRouteDelegate, 
    Prisma.AgentRouteWhereInput, 
    Prisma.AgentRouteSelect,
    Prisma.XOR<Prisma.AgentRouteUpdateInput, Prisma.AgentRouteUncheckedUpdateInput>,
    Prisma.XOR<Prisma.AgentRouteCreateInput, Prisma.AgentRouteUncheckedCreateInput>,
    Prisma.AgentRouteOrderByWithRelationInput | Prisma.AgentRouteOrderByWithRelationInput[]
>;


export interface AgentRouteRepositoryI {
    findAll: (paginationData: PaginationWithFilters ) => Promise<ResponseWithMetadata>,
    findByReport: (paginationData: PaginationWithFilters ) => Promise<Generic[] | undefined>,
    findAgents: (fullname: string,  assignAt: Date) => Promise<Generic[] | undefined>,
    findMany: (routeId: number, assignAt: Date) => Promise<Generic[] | undefined>,
    deleteOne: (id: number) => Promise<Generic | undefined>,
    deleteMany: (ids: number[], assignAt: Date) => Promise<Generic | undefined>,
    deleteManyByRoute: (routeId: number, assignAt: Date) => Promise<Generic | undefined>,
    createMany: (data: CreateOne[]) => Promise<Generic | undefined>,
    base: BaseAgentRouteI
}
