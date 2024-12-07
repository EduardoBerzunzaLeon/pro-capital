import agentRouteService from "./agentRoute.service";
import authService from "./auth.service";
import avalService from "./aval.service";
import clientService from "./client.service";
import creditService from "./credit.service";
import dto from "./dto.service";
import folderService from "./folder.service";
import leaderService from "./leader.service";
import municipalityService from "./municipality.service";
import paginatorService from "./paginator.service";
import paymentService from "./payment.service";
import roleService from "./role.service";
import routeService from "./route.service";
import townService from "./town.service";
import userService from "./user.service";
import utilsService from "./utils.service";
import validationService from "./validation.service";
import permissionService from "./permission.service";
import groupService from "./group.service";
import excelReportService from "./excelReport.service";



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
        role: { ...roleService },
        permission: { ...permissionService },
        group: { ...groupService },       
        excel: { ...excelReportService }
    }
}

export const Service = buildService();