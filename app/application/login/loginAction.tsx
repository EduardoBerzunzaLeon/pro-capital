import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { z } from "zod";
import { getSession } from "~/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function action({ request }: ActionFunctionArgs ) {
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const submission = parseWithZod(body, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  const email = body.get("email");
  const password = body.get("password");
  const payload = {
    email,
    password,
  };

  return json(submission.reply());
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
