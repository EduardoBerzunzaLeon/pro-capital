import { AuthorizationError } from "remix-auth";
import { ValidationConformError } from "../errors/ValidationConformError";
import { json } from "@remix-run/node";
import { ServerError } from "../errors/ServerError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GenericUnknown } from "../interfaces";
import { ZodError } from "zod";

const handlerConform = (error: ValidationConformError, serverData: GenericUnknown) => {
  const errors =  error.submission.error;

  console.log(errors);
  const defaultMessage = 'Ocurrio un error al momento de validar los campos';
  if(!errors) {
    return { error: defaultMessage, status: 400, serverData }
  } 
  const errorMessage = Object.entries(errors)[0][1] 
    ?? [defaultMessage];
  
  return { error: errorMessage[0], status: 400, serverData };
}

const handlerZod = (error: ZodError, serverData: GenericUnknown) => {
  console.log(error.errors[0].message);
  return { error: error.errors[0].message, status: 400, serverData};
}

export const handlerError = (error: unknown, data?: GenericUnknown) => {

      console.log(error);

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

      if(error instanceof ZodError) {
        return json(handlerZod(error, serverData));
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