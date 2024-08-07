import { json, LoaderFunction } from "@remix-run/node";
import { Service } from '../../.server/services/index';

export const rootLoader: LoaderFunction = async ({ request }) => {
    const user = await Service.auth.authenticator.isAuthenticated(request);
    return json({ user });
};
  
