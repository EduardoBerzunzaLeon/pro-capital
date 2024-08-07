import { LoaderFunction } from "@remix-run/node";
import { MetaFunction, Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import { authenticator } from "~/.server/session";
import { LogginStart } from "~/components/ui";

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: './'
  });
};

export const meta: MetaFunction = () => {
  return [{ title: "Auth Pages" }];
};

export default function AuthPage() {

  return (
    <>
      <div className="h-screen grid place-items-center bg-background" >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: "easeOut", duration: 2 }}
        >
          <Outlet />
        </motion.div>
      </div>
      <LogginStart/>
    </>
  );
}
