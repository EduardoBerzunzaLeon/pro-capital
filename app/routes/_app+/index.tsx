import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react"
import { Generic } from "~/.server/interfaces";
import { ErrorCard } from "~/components/utils/ErrorCard";

export const loader: LoaderFunction = async () => {

  return {
    holi: 'dashboard'
  }
}


export function ErrorBoundary() {
  const error = useRouteError();
  return (<ErrorCard 
      error={(error as Generic)?.message ?? 'Ocurrio un error inesperado'}
      description='Ocurrio un error, favor de contactar con el administrador'
  />)
}


export default function Index() {

  const loader = useLoaderData();

  console.log({loaderDash: loader});

  return (
    <>dashboard</>
  )
} 
  