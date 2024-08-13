import { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";

export const logoutLoader: LoaderFunction = async () => {
    return redirect('/');
};
  

