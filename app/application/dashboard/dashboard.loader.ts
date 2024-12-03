import { json, LoaderFunction } from "@remix-run/node";
import { Service } from '../../.server/services/index';
import { flashSession } from "~/.server/utils/sessions";

export const dashboardLoader: LoaderFunction = async ({ request }) => {
  
    await Service.auth.authenticator.isAuthenticated(request, {
      failureRedirect: "/login",
    });

    const session = await flashSession.getSession(request.headers.get('Cookie'));

    const message = session.get('message') || 'no message found';
    const headers = new Headers();

    headers.append('Set-Cookie', await flashSession.commitSession(session));

    return json({ message }, { headers });

};
  