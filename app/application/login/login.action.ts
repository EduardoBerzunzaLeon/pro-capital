import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { handlerError } from "~/.server/reponses/handlerError";
import { Service } from "~/.server/services";
import { commitSession, getSession, USER_PASSWORD_STRATEGY } from "~/.server/services/auth.service";
import { flashSession } from "~/.server/utils/sessions";


export const loginAction: ActionFunction =  async ({ request, context }: ActionFunctionArgs ) => {

  try {
    const user =  await Service.auth.authenticator.authenticate(USER_PASSWORD_STRATEGY, request, {
      // successRedirect: "/",
      throwOnError: true,
      context,
    });

    const session = await getSession(request.headers.get("cookie"));

    const sessionFlash = await flashSession.getSession(request.headers.get("cookie"));

    session.set(Service.auth.authenticator.sessionKey, user);

    sessionFlash.flash('message', 'welcome to app');
    const headers = new Headers();

    headers.append('Set-Cookie',await commitSession(session));
    headers.append('Set-Cookie',await flashSession.commitSession(sessionFlash));

    return redirect('/', { headers });

  } catch (error) {
    if(error instanceof Response) {
      console.log(error);
      return error;
    }
    return handlerError(error);
  }

}