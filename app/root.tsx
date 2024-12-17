import { useEffect, useMemo } from 'react';
import { isRouteErrorResponse, ShouldRevalidateFunction, useLocation, useOutlet, useRouteError } from 'react-router-dom';
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {NextUIProvider} from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { Bounce, ToastContainer, toast as notify } from 'react-toastify';

import { rootLoader } from "./application/root/root.loader";

import  "react-toastify/dist/ReactToastify.css";
import stylesheet from "~/tailwind.css?url";
import { ErrorCard } from './components/utils/ErrorCard';
import { Generic } from './.server/interfaces';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => ([{
  charset: "utf-8",
  title: "Pro capital",
  viewport: "width=device-width,initial-scale=1",
}]);


export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate
}) => {

  if(nextUrl.search !== currentUrl.search) return false;
  return defaultShouldRevalidate;
};

export function ErrorBoundary() {
  const error = useRouteError();
  const textError = useMemo(() => {

    if(isRouteErrorResponse(error)){

      if(error.status ===  404) return 'No se encontro la URL'

      return error.data
    }

    if((error as Generic)?.message) {
      return (error as { message: string }).message;
    }

    return 'Ocurrio un error inesperado';

  }, [error])


  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body className='overflow-x-hidden'>
        <div className='red-dark text-foreground bg-content1 w-screen max-h-max min-h-screen flex items-center'>
            {/* <ErrorBoundary /> */}
            <ErrorCard 
                error={ textError }
                description='Ocurrio un error, favor de intentarlo más tarde'
            />
        </div>
      <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const { toast } = useLoaderData<typeof rootLoader>();
  const location = useLocation();

  useEffect(() => {
    if(toast){
     notify(toast.message, { type: toast.type });
    }
   }, [toast])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className='overflow-x-hidden'>

        <NextUIProvider 
          navigate={navigate}
          locale='es-MX'
        >
          <div className='red-dark text-foreground bg-content1 w-screen max-h-max min-h-screen'>
            <AnimatePresence mode="wait" initial={false}>
                <motion.main key={location.pathname === '/login' ? location.pathname :'dashboard'}>
                  {outlet}
                </motion.main>
            </AnimatePresence>
          </div>
          <ScrollRestoration 
            getKey={(location) => { return location.pathname }}
          />
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