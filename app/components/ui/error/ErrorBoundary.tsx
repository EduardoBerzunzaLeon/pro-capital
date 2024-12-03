import { useRouteError } from "@remix-run/react";
import { Generic } from "~/.server/interfaces";
import { ErrorCard } from "~/components/utils/ErrorCard";

export const ErrorBoundary = () => {
    const error = useRouteError();

    return (<ErrorCard 
        error={(error as Generic)?.message ?? 'Ocurrio un error inesperado'}
        description='Ocurrio un error, favor de intentarlo más tarde'
    />)
}