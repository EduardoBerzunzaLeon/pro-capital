import { parseWithZod } from "@conform-to/zod";
import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { authenticator } from "~/.server/session";
// import { getSession } from "~/auth/session";

const schema = z.object({
  userName: z.string(),
  password: z.string(),
});

export const loginAction: ActionFunction =  async ({ request, context }: ActionFunctionArgs ) => {

  // const body = await request.formData();
  // const submission = parseWithZod(body, { schema });

  // if (submission.status !== 'success') {
  //   return json(submission.reply());
  // }

    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      failureRedirect: "/login",
      throwOnError: true,
      context,
    });

    // console.log(resp);
  //   return resp;
  //   //  return await Repository.auth.login(value.userName, value.password);
  // } catch (error) {
  //   console.log({error});
  //   return json({ error });
  // }



}