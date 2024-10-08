import { ClientRepository } from "../client/client.repository";
import { db } from "../db";
import { AgentRouteRepository } from "./agentRoute/agentRoute.repository";
import { AuthRepository } from "./auth/auth.repository";
import { AvalRepository } from "./aval/aval.repository";
import { baseRepository } from "./base.repository";
import { CreditRepository } from "./credit/credit.repository";
import { FolderRepository } from "./folder/folder.repository";
import { GroupRepository } from "./group/group.repository";
import { LeaderRepository } from "./leader/leader.repository";
import { MunicipalityRepository } from "./municipality/municipality.repository";
import { RouteRepository } from "./route/route.repository";
import { TownRepository } from "./town/town.repository";



function buildRepository() {
    return {
        auth: { ...AuthRepository(baseRepository(db.user)) },
        municipality: { ...MunicipalityRepository(baseRepository(db.municipality)) },
        town: { ...TownRepository(baseRepository(db.town)) },
        folder: { ...FolderRepository(baseRepository(db.folder))},
        group: { ...GroupRepository(baseRepository(db.group))},
        route: { ...RouteRepository(baseRepository(db.route))},
        agentRoute: { ...AgentRouteRepository(baseRepository(db.agentRoute))},
        leader: { ...LeaderRepository(baseRepository(db.leader))},
        credit: { ...CreditRepository(baseRepository(db.credit))},
        aval: { ...AvalRepository(baseRepository(db.aval))},
        client: { ...ClientRepository(baseRepository(db.client))}
    }
}

export const Repository = buildRepository();