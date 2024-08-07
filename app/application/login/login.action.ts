import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { handlerError } from "~/.server/errors/handlerError";
import { Service } from "~/.server/services";
import { USER_PASSWORD_STRATEGY } from "~/.server/services/auth.service";


export const loginAction: ActionFunction =  async ({ request, context }: ActionFunctionArgs ) => {

  try {
    return await Service.auth.authenticator.authenticate(USER_PASSWORD_STRATEGY, request, {
      successRedirect: "/",
      throwOnError: true,
      context,
    });

  } catch (error) {
    return handlerError(error);
  }

}