import { db } from "../db";
import { AuthRepository } from "./auth/auth.repository";
import { baseRepository } from "./base.repository";
import { FolderRepository } from "./folder/folder.repository";
import { GroupRepository } from "./group/group.repository";
import { MunicipalityRepository } from "./municipality/municipality.repository";
import { TownRepository } from "./town/town.repository";

function buildRepository() {
    return {
        auth: { ...AuthRepository(baseRepository(db.user)) },
        municipality: { ...MunicipalityRepository(baseRepository(db.municipality)) },
        town: { ...TownRepository(baseRepository(db.town)) },
        folder: { ...FolderRepository(baseRepository(db.folder))},
        group: { ...GroupRepository(baseRepository(db.group))}
    }
}

export const Repository = buildRepository();