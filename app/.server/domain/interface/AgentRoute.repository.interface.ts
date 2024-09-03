import { Prisma } from "@prisma/client";
import { BaseRepositoryI } from ".";

export type BaseAgentRouteI = BaseRepositoryI<
    Prisma.AgentRouteDelegate, 
    Prisma.AgentRouteWhereInput, 
    Prisma.AgentRouteSelect,
    Prisma.XOR<Prisma.AgentRouteUpdateInput, Prisma.AgentRouteUncheckedUpdateInput>,
    Prisma.XOR<Prisma.AgentRouteCreateInput, Prisma.UserUncheckedCreateInput>
>;