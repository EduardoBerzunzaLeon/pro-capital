import type { AuthRepositoryI, BaseAuthI } from "~/.server/domain/interface";

export function AuthRepository(base: BaseAuthI): AuthRepositoryI {
    async function findByUserName(username: string) {
        return await base.findOne({username})
    }

    return { findByUserName, base };
} 