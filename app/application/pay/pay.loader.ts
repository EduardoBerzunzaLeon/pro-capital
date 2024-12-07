import { json, LoaderFunction } from "@remix-run/node";
import { getEmptyPagination, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { Params } from '../params/index';
import { permissions } from "../permissions";

export const payLoader: LoaderFunction  = async ({ request }) => {

    await Service.auth.requirePermission(request, permissions.pays.permissions.view);
    const { params, search } = Params.payment.getParams(request);

    try {
        
        const data = await Service.credit.findAll(params);
        const { page, limit, column, direction } = params;
        return handlerSuccess(200, {
            ...data,
            ...search,
            p: page,
            l: limit,
            c: column,
            d: direction,
        });
           
    } catch (error) {
        return json(getEmptyPagination(search));
    }
    
}