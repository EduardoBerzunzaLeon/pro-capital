import { AuthRepository } from "./auth/authRepository";
import { MunicipalityRepository } from "./municipality/municipalityRepository";
import { TownRepository } from "./town/townRepository";

function buildRepository() {
    return {
        auth: { ...AuthRepository() },
        municipality: { ...MunicipalityRepository() },
        town: { ...TownRepository() }
    }
}

export const Repository = buildRepository();