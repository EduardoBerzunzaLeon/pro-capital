import { AuthRepository } from "./auth/authRepository";

function buildRepository() {
    return {
        auth: {...AuthRepository()},
    }
}

export const Repository = buildRepository();