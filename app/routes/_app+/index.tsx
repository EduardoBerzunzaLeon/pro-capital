import { Button } from "@nextui-org/react";
import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/.server/session";

export const action: ActionFunction = async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: "/login" });
};

export default function Index() {
    return (
      <Form method="post" >
        <Button type="submit">
        Cerrar 
        </Button>
      </Form >
    )
  } 
  