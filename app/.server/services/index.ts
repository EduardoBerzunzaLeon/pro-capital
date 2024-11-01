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
import avalService from "./aval.service";
import clientService from "./client.service";
import userService from "./user.service";
import paymentService from "./payment.service";


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
        aval: { ...avalService },
        utils: { ...utilsService },
        credit: { ...creditService },
        client: { ...clientService },
        user: { ...userService },
        payment: { ...paymentService },
    }
}

export const Service = buildService();