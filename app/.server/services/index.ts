import authService from "./auth.service";
import municipalityService from "./municipality.service";
import townService from "./town.service";
import folderService from "./folder.service";
import validationService from "./validation.service";
import dto from "./dto.service";
import paginatorService from "./paginator.service";
import routeService from "./route.service";
import agentRouteService from "./agentRoute.service";
import leaderService from "./leader.service";
import utilsService from "./utils.service";
import creditService from "./credit.service";

function buildService() {
    return {
        auth: { ...authService },
        municipality: {...municipalityService },
        validation: { ...validationService },
        town: { ...townService },
        folder: { ...folderService },
        routes: { ...routeService },
        dto: { ...dto },
        paginator: { ...paginatorService },
        agent: { ...agentRouteService },
        leader: { ...leaderService },
        utils: { ...utilsService },
        credit: { ...creditService },
    }
}

export const Service = buildService();