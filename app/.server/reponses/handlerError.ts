import { AuthorizationError } from "remix-auth";
import { ValidationConformError } from "../errors/ValidationConformError";
import { ServerError } from "../errors/ServerError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Generic, GenericUnknown } from "../interfaces";
import { ZodError } from "zod";
import { jsonWithError } from "remix-toast";

const handlerConform = (error: ValidationConformError, serverData: GenericUnknown) => {
  const errors =  error.submission.error;

  const defaultMessage = 'Ocurrio un error al momento de validar los campos';
  if(!errors) {
    return { error: defaultMessage, status: 400, serverData }
  } 
  const errorMessage = Object.entries(errors)[0][1] 
    ?? [defaultMessage];
  
  return { error: errorMessage[0], status: 400, serverData };
}

const handlerZod = (error: ZodError, serverData: GenericUnknown) => {
  return { error: error.errors[0].message, status: 400, serverData};
}

const handlerPrisma = (error: PrismaClientKnownRequestError, serverData: GenericUnknown) => {
  if(
    typeof error.meta?.cause === 'string' 
    && error.meta?.cause.includes('not found')
  ) {
    return { error: 'No se encontro los datos en el servidor', status: 404, serverData };  
  }

if(!error.meta?.target) {
  console.log(error)
  return { error: 'Ocurrio un error en la base de datos, intentar mas tarde', status: 500, serverData };
}

if(error.meta) {
  const errors = error.meta.target as unknown[];
  return { error: `El valor del campo ${errors[0]} ya existe`, status: 400, serverData};
}

console.log({prismaErrornotHandler: error});

return { error: 'Algo salio mal, intentelo más tarde', status: 500, serverData};
}

interface CustomError {
  error: string,
  status: number,
  serverData: Generic
}

export const handlerError = (error: unknown, data?: GenericUnknown): CustomError => {

      const serverData = { ...data };

      if(error instanceof ServerError) {
        const { message, status } = error;
        return { error: message, status, serverData };
      }

      if(error instanceof PrismaClientKnownRequestError) {
         return handlerPrisma(error, serverData);
      }

      if(error instanceof ValidationConformError) {
        return handlerConform(error, serverData);
      }

      if(error instanceof ZodError) {
        return handlerZod(error, serverData);
      }

      if(error instanceof Response) {
        return { error: 'Algo salio mal en la respuesta, intentelo más tarde', status: 500, serverData};
      }

      if(!(error instanceof AuthorizationError)) {
        return { error: 'Algo salio mal, intentelo más tarde', status: 500, serverData};
      }
      
      const { cause } = error;

      if( cause instanceof ValidationConformError) {
        return handlerConform(cause, serverData);
      }
      
      if( cause instanceof ServerError) {
        const { message, status } = cause;
        return { error: message, status, serverData};
      }
  
      return { error: error.message, status: 400, serverData};
}

export const handlerErrorWithToast = (error: unknown, data: GenericUnknown) =>  {
  const {error: errorMessage, status } = handlerError(error, data);
  return jsonWithError({status, error: errorMessage}, errorMessage);
}

export const getEmptyPagination = () => ({
  error: 'no data',
  serverData: { 
    data: [], 
    total: 0, 
    currentPage: 0,
    pageCount: 0
  }
})