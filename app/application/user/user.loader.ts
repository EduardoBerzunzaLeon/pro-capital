import { json, LoaderFunction } from "@remix-run/node";
import { getEmptyPagination, handlerSuccess } from "~/.server/reponses";
import { Service } from "~/.server/services";
import { Params } from '../params/index';

export const userLoader: LoaderFunction = async ({ request }) => {

    const { params, search } = Params.user.getParams(request);

    try {

        const data = await Service.user.findAll(params);
        const { page, limit, column, direction } = params;

        return handlerSuccess(200, {
            ...data,
            ...search,
            p: page,
            l: limit,
            c: column,
            d: direction
        })

    } catch (error) {
        console.log({error});
        return json(getEmptyPagination(search))
    }

}
