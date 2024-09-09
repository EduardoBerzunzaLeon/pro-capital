import { json, LoaderFunction } from "@remix-run/node";
import { getToast } from "remix-toast";
import { Service } from '../../.server/services/index';

export const rootLoader: LoaderFunction = async ({ request }) => {

    console.log('root');
    const [user, { toast, headers}] = await Promise.all([
        Service.auth.authenticator.isAuthenticated(request),
        getToast(request)
    ]);

    return json({ user, toast }, { headers });
};
  
