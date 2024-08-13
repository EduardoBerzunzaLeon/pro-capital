import { ActionFunction } from "@remix-run/node";
import { Service } from "~/.server/services";

export const logoutAction: ActionFunction =  async ({ request }) => {
    return await Service.auth.authenticator.logout(request, { redirectTo: "/login" });
}

