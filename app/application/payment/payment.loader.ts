import { json, LoaderFunction } from "@remix-run/node";
import { getEmptyPagination, handlerSuccess, } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { permissions } from "../permissions";
import { Params } from "../params";


  export const paymentLoader: LoaderFunction = async ({ request }) => {

    await Service.auth.requirePermission(request, permissions.payments.permissions.view);
     const { params, search } = Params.history.getParams(request);

    try {
      
      const data = await Service.payment.findAll(params);
      
      const { page, limit, column, direction } = params;
      return handlerSuccess(200, { 
        ...data,
        ...search,
        p: page,
        l: limit,
        c: column,
        d: direction,
      });

    } catch (e) {
      console.log(e);
      return json(getEmptyPagination(search));
    }

  }