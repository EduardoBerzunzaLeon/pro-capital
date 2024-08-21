import { AuthRepository } from "./auth/authRepository";
import { FolderRepository } from "./folder/folderRepository";
import { MunicipalityRepository } from "./municipality/municipalityRepository";
import { TownRepository } from "./town/townRepository";

function buildRepository() {
    return {
        auth: { ...AuthRepository() },
        municipality: { ...MunicipalityRepository() },
        town: { ...TownRepository() },
        folder: { ...FolderRepository()}
    }
}

export const Repository = buildRepository();