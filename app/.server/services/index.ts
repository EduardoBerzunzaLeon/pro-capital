import authService from "./auth.service";
import municipalityService from "./municipality.service";
import townService from "./town.service";
import validationService from "./validation.service";

function buildService() {
    return {
        auth: { ...authService },
        municipality: {...municipalityService },
        validation: { ...validationService },
        town: { ...townService }
    }
}

export const Service = buildService();