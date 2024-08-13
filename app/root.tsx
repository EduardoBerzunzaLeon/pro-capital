import { useLocation, useOutlet } from 'react-router-dom';
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "@remix-run/react";
import {NextUIProvider} from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { Bounce, ToastContainer } from 'react-toastify';

import { rootLoader } from "./application/root/root.loader";

import  "react-toastify/dist/ReactToastify.css";
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];


export default function App() {
  const outlet = useOutlet();
  const navigate = useNavigate();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className='overflow-x-hidden'>

        <NextUIProvider navigate={navigate}>

          <div className='red-dark text-foreground bg-content1 w-screen max-h-max min-h-screen'>
            <AnimatePresence mode="wait" initial={false}>
                <motion.main key={useLocation().pathname}>
                  {outlet}
                </motion.main>
            </AnimatePresence>
          </div>
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </body>
    </html>
  );
}

export { rootLoader as loader };