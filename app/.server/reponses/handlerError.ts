import { AuthorizationError } from "remix-auth";
import { ValidationConformError } from "../errors/ValidationConformError";
import { json } from "@remix-run/node";
import { ServerError } from "../errors/ServerError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const handlerConform = (error: ValidationConformError, serverData: {
  [x: string]: unknown;
}) => {
  const errors =  error.submission.error;
  const defaultMessage = 'Ocurrio un error al momento de validar los campos';
  if(!errors) {
    return { error: defaultMessage, status: 400, serverData }
  } 
  const errorMessage = Object.entries(errors)[0][1] 
    ?? [defaultMessage];
  
  return { error: errorMessage[0], status: 400, serverData };
}

export const handlerError = (error: unknown, data?: Record<string, unknown>) => {

      const serverData = { ...data };

      if(error instanceof ServerError) {
        const { message, status } = error;
        return json({ error: message, status, serverData });
      }

      if(error instanceof PrismaClientKnownRequestError) {
        if(error.meta) {
          const errors = error.meta.target as unknown[];
          return json({ error: `El valor del campo ${errors[0]} ya existe`, status: 404, serverData});
        }
        return error;
      }

      if(error instanceof ValidationConformError) {
        return json(handlerConform(error, serverData));
      }

      if(!(error instanceof AuthorizationError)) {
        console.log(error);
        return error;
      }
      
      const { cause } = error;

      if( cause instanceof ValidationConformError) {
        return json(handlerConform(cause, serverData));
      }
      
      if( cause instanceof ServerError) {
        const { message, status } = cause;
        return json({ error: message, status, serverData});
      }
  
      return json({error: error.message, status: 400, serverData});
}