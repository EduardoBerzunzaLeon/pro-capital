import { LoaderFunction } from "@remix-run/node";
import { Service } from '../../.server/services/index';

export const dashboardLoader: LoaderFunction = async ({ request }) => {
    return await Service.auth.authenticator.isAuthenticated(request, {
      failureRedirect: "/login",
    });
};
  