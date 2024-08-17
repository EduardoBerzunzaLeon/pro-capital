import authService from "./auth.service";
import municipalityService from "./municipality.service";
import validationService from "./validation.service";

function buildService() {
    return {
        auth: { ...authService },
        municipality: {...municipalityService },
        validation: { ...validationService },
    }
}

export const Service = buildService();