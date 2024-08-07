import authService from "./auth.service";

function buildService() {
    return {
        auth: { ...authService },
    }
}

export const Service = buildService();