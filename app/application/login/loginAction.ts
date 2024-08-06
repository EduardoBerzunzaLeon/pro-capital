import { parseWithZod } from "@conform-to/zod";
import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { z } from "zod";
import { Repository } from "~/.server/adapter/repository";
// import { getSession } from "~/auth/session";

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginAction: ActionFunction =  async ({ request }: ActionFunctionArgs ) => {
  // const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const submission = parseWithZod(body, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  const email = body.get("email")?.toString() || undefined;
  const password = body.get("password")?.toString() || undefined;
  const payload = {
    userName: email,
    password,
  };

  // return json(submission.reply());


//   const { Repository } =  await import('~/.server/adapter/repository');
  const user = await Repository.auth.login(payload.userName, payload.password);
  // const user  = await db.user.findFirst({where: { userName: payload.userName , password: payload.password}});

  console.log({user});
  return json({...payload});
  // const api = new Api();
  // try {
  //   const response = await api.loginUser(payload);
  //   const sessionPayload = {
  //     token: response.data.access_token,
  //     user: {
  //       email: response.data.user.email,
  //       name: response.data.user.name,
  //     },
  //   };
  //   console.log(response.data.access_token);
  //   session.set("credentials", sessionPayload);
  //   return redirect("/dashboard", {
  //     headers: {
  //       "Set-Cookie": await commitSession(session),
  //     },
  //   });
  // } catch (error: any) {
  //   console.log(error);
  //   return json(error.response.data);
  // }
}