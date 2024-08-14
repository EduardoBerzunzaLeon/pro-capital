import { AuthRepository } from "./auth/authRepository";
import { MunicipalityRepository } from "./municipality/municipalityRepository";

function buildRepository() {
    return {
        auth: { ...AuthRepository() },
        municipality: { ...MunicipalityRepository() }
    }
}

export const Repository = buildRepository();