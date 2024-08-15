import { AuthorizationError } from "remix-auth";
import { ValidationConformError } from "./ValidationConformError";
import { json } from "@remix-run/node";
import { ServerError } from "./ServerError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";



export const handlerError = (error: unknown) => {


      if(error instanceof ServerError) {
        const { message, status } = error;
        return json({ error: message, status });
      }

      if(error instanceof PrismaClientKnownRequestError) {
        if(error.meta) {
          const errors = error.meta.target as any;
          return json({ error: `El valor del campo ${errors[0]} ya existe`, status: 404 });
        }
        return error;
      }

      if(!(error instanceof AuthorizationError)) {
        return error
      }
      
      const { cause } = error;

      if( cause instanceof ValidationConformError) {
        return json(cause.submission);
      }
      
      if( cause instanceof ServerError) {
        const { message, status } = cause;
        return json({ error: message, status });
      }
  
      return json({error: error.message});
}