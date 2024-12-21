import { LoaderFunction } from "@remix-run/node";
import { ServerError } from "~/.server/errors";
import { getEmptyPagination, handlerError, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { Params } from '../params/index';
import { permissions } from "../permissions";

  export const paymentClientLoader: LoaderFunction = async ({ request, params }) => {

    await Service.auth.requirePermission(request, permissions.payments.permissions.view);

    const { 
      params: customParams, 
      search, 
      validation 
    } = Params.paymentClient.getParams(request, params);

    try {
        
        const { 
          areEmpty, 
          creditValue, 
          clientParsed, 
          folderParsed, 
          groupParsed 
        } = validation;
 
        if(!areEmpty && creditValue !== '') {
          throw ServerError.badRequest('La solicitud a la URL es incorrecta, favor de verificar la ruta de acceso');
        }

        if(clientParsed || folderParsed || groupParsed) {
          await Service.credit.verifyIfExists({
            clientId: Number(clientParsed),
            folderId: Number(folderParsed),
            groupId: Number(groupParsed)
          })
        }

        const data = await Service.payment.findAll(customParams);
        
        const { page, limit, column, direction } = customParams;

        return handlerSuccess(200, { 
          ...data,
          ...search,
          p: page,
          l: limit,
          c: column,
          d: direction,
        });

    } catch (e) {
      
      const { error, status } = handlerError(e);
      console.log({error});
      if(error === 'No se encontraron pagos') {
        return getEmptyPagination();
      }

      throw new Response(error, { status });
    }
  }