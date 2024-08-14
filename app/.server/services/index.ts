import authService from "./auth.service";
import municipalityService from "./municipality.service";

function buildService() {
    return {
        auth: { ...authService },
        municipality: {...municipalityService }
    }
}

export const Service = buildService();