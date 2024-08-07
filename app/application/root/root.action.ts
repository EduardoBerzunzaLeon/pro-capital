import { ActionFunction } from "@remix-run/node";
import { Service } from "~/.server/services";

export const rootAction: ActionFunction =  async ({ request }) => {

    const data = await request.formData()
    const key = data.get('key');
    
    if(key === 'logout') {
      return await Service.auth.authenticator.logout(request, { redirectTo: "/login" });
    }
  }