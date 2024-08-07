// import { parseWithZod } from "@conform-to/zod";
import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import { AuthorizationError } from "remix-auth";
// import { z } from "zod";
import { authenticator } from "~/.server/session";

// const schema = z.object({
//   userName: z.string(),
//   password: z.string(),
// });

export const loginAction: ActionFunction =  async ({ request, context }: ActionFunctionArgs ) => {

  try {
    
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
      context,
    });
  } catch (error) {

    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return json({error: error.message});
    }

  }

  // return json({error: 'errorcito'});
4
}