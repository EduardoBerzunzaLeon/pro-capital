// import { LoaderFunction  } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
// import { authenticator } from "~/.server/session";
import { LogginStart } from "~/components/ui";

// export const loader: LoaderFunction = async ({ request }) => {
//   return await authenticator.isAuthenticated(request, {
//     successRedirect: './'
//   });
// };

export default function Signup() {

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
      <LogginStart text='Bienvenido de nuevo' />
    </>
  );
}
