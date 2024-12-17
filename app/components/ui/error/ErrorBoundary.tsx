import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { useMemo } from "react";
import { Generic } from "~/.server/interfaces";
import { ErrorCard } from "~/components/utils/ErrorCard";

export const ErrorBoundary = () => {
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

    return (<ErrorCard 
        error={ textError }
        description='Ocurrio un error, favor de intentarlo más tarde'
    />)
}