import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";

import { LogginStart } from "~/components/ui";

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
      <LogginStart text='Bienvenido de nuevo, Eduardo Berzunza' />
    </>
  );
}
