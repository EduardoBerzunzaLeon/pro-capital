import { AuthorizationError } from "remix-auth";
import { ValidationConformError } from "./ValidationConformError";
import { json } from "@remix-run/node";
import { ServerError } from "./ServerError";


export const handlerError = (error: unknown) => {
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