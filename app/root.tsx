import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {NextUIProvider} from "@nextui-org/react";

import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { AnimatePresence, motion } from "framer-motion";
import { useOutlet, useLocation} from 'react-router-dom';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  const outlet = useOutlet()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className='overflow-x-hidden overflow-y-hidden'>
        <NextUIProvider>
          <main className='red-dark text-foreground bg-secondary-50'>
            <AnimatePresence mode="wait" initial={false}>
                <motion.main key={useLocation().pathname}>
                  {outlet}
                </motion.main>
            </AnimatePresence>
          </main>
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}
